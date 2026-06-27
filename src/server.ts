import cors from "@fastify/cors";
import Fastify from "fastify";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Redis } from "ioredis";
import { ZodError } from "zod";
import { loadConfig, type Config } from "./config.js";
import { createPool } from "./db/client.js";
import { registerAppDecorators } from "./plugins.js";
import { authRoutes } from "./routes/auth.js";
import { apiKeyRoutes } from "./routes/api-keys.js";
import { createQueues } from "./queues.js";
import { partnerCredentialRoutes } from "./routes/partner-credentials.js";
import { commerceRoutes } from "./routes/commerce.js";
import { usageRoutes } from "./routes/usage.js";
import { webhookRoutes } from "./routes/webhooks.js";

export async function buildServer(config: Config = loadConfig()) {
  const app = Fastify({ logger: config.NODE_ENV !== "test" });
  const pg = createPool(config.DATABASE_URL);
  const redis = new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
  const queues = createQueues(config);

  registerAppDecorators(app, config, pg, redis, queues);
  await app.register(cors, { origin: config.CORS_ORIGIN, credentials: true });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({ error: "Invalid request", details: error.issues });
    }
    const statusCode = typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Request failed";
    if (statusCode >= 500) app.log.error(error);
    return reply.code(statusCode).send({ error: statusCode >= 500 ? "Internal server error" : message });
  });

  app.get("/health/live", async () => ({ status: "ok" }));
  app.get("/openapi.yaml", async (_request, reply) => {
    const spec = await readFile(resolve(process.cwd(), "docs/openapi.yaml"), "utf8");
    return reply.type("application/yaml; charset=utf-8").send(spec);
  });
  app.get("/health/ready", async (_request, reply) => {
    try {
      await pg.query("SELECT 1");
      if (redis.status === "wait") await redis.connect();
      await redis.ping();
      return { status: "ready" };
    } catch (error) {
      app.log.error(error);
      return reply.code(503).send({ status: "not-ready" });
    }
  });

  await app.register(authRoutes);
  await app.register(apiKeyRoutes);
  await app.register(partnerCredentialRoutes);
  await app.register(commerceRoutes);
  await app.register(usageRoutes);
  await app.register(webhookRoutes);
  app.addHook("onClose", async () => {
    await Promise.all([
      pg.end(),
      redis.quit().catch(() => undefined),
      queues.partnerPoll.close(),
      queues.historicalSync.close(),
      queues.usageForward.close(),
      queues.webhookDelivery.close(),
    ]);
  });
  return app;
}
