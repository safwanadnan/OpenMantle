import cors from "@fastify/cors";
import Fastify from "fastify";
import { Redis } from "ioredis";
import { ZodError } from "zod";
import { loadConfig, type Config } from "./config.js";
import { createPool } from "./db/client.js";
import { registerAppDecorators } from "./plugins.js";
import { authRoutes } from "./routes/auth.js";
import { apiKeyRoutes } from "./routes/api-keys.js";

export async function buildServer(config: Config = loadConfig()) {
  const app = Fastify({ logger: config.NODE_ENV !== "test" });
  const pg = createPool(config.DATABASE_URL);
  const redis = new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });

  registerAppDecorators(app, config, pg);
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
  app.addHook("onClose", async () => {
    await Promise.all([pg.end(), redis.quit().catch(() => undefined)]);
  });
  return app;
}
