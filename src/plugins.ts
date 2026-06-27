import { timingSafeEqual } from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { Pool } from "pg";
import type { Config } from "./config.js";
import type { Redis } from "ioredis";
import type { OpenMantleQueues } from "./queues.js";
import { parseApiKey } from "./auth/crypto.js";
import { verifySession } from "./auth/jwt.js";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    pg: Pool;
    redis: Redis;
    queues: OpenMantleQueues;
    requireSession(request: FastifyRequest): Promise<void>;
    requireApiKey(request: FastifyRequest): Promise<void>;
    requireApiAccess(request: FastifyRequest): Promise<void>;
  }
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function registerAppDecorators(
  app: FastifyInstance,
  config: Config,
  pg: Pool,
  redis: Redis,
  queues: OpenMantleQueues,
): void {
  app.decorate("config", config);
  app.decorate("pg", pg);
  app.decorate("redis", redis);
  app.decorate("queues", queues);
  app.decorateRequest("auth", null);

  app.decorate("requireSession", async function requireSession(request: FastifyRequest) {
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) throw unauthorized();
    try {
      request.auth = await verifySession(authorization.slice(7), config.JWT_SECRET, config.JWT_ISSUER);
    } catch {
      throw unauthorized();
    }
  });

  app.decorate("requireApiKey", async function requireApiKey(request: FastifyRequest) {
    const authorization = request.headers.authorization;
    const parsed = authorization?.startsWith("Bearer ") ? parseApiKey(authorization.slice(7)) : null;
    if (!parsed) throw unauthorized();
    const result = await pg.query<{
      key_id: string;
      organization_id: string;
      secret_hash: string;
      revoked_at: Date | null;
    }>("SELECT * FROM find_api_key($1)", [parsed.prefix]);
    const row = result.rows[0];
    if (!row || row.revoked_at || !safeEqual(parsed.secretHash, row.secret_hash)) {
      throw unauthorized();
    }
    request.auth = { userId: `api-key:${row.key_id}`, organizationId: row.organization_id, role: "api" };
  });

  app.decorate("requireApiAccess", async function requireApiAccess(request: FastifyRequest) {
    const token = request.headers.authorization?.startsWith("Bearer ")
      ? request.headers.authorization.slice(7)
      : "";
    if (token.startsWith("om_")) return app.requireApiKey(request);
    return app.requireSession(request);
  });
}

function unauthorized(): Error & { statusCode: number } {
  return Object.assign(new Error("Unauthorized"), { statusCode: 401 });
}
