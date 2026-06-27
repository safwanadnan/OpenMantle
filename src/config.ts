import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().min(1).default("openmantle"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  CREDENTIAL_ENCRYPTION_KEY: z.string().refine((value) => {
    try {
      return Buffer.from(value, "base64").length === 32;
    } catch {
      return false;
    }
  }, "CREDENTIAL_ENCRYPTION_KEY must be a base64-encoded 32-byte key"),
  PARTNER_API_VERSION: z.string().regex(/^\d{4}-\d{2}$/).default("2026-07"),
  PARTNER_API_REQUESTS_PER_SECOND: z.coerce.number().int().min(1).max(3).default(3),
  SUBSCRIPTION_POLL_INTERVAL_MS: z.coerce.number().int().min(60_000).default(300_000),
  HISTORICAL_SYNC_INTERVAL_MS: z.coerce.number().int().min(60_000).default(900_000),
});

export type Config = z.infer<typeof schema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return schema.parse(env);
}
