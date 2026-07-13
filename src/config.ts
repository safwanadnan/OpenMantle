import { z } from "zod";

try {
  process.loadEnvFile();
} catch {}

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
  APP_EVENTS_API_VERSION: z.string().regex(/^(unstable|\d{4}-\d{2})$/).default("unstable"),
  USAGE_FORWARD_DELAY_MS: z.coerce.number().int().min(0).default(1_000),
  USAGE_FORWARD_BATCH_SIZE: z.coerce.number().int().min(1).max(100).default(50),
  WEBHOOK_DISPATCH_INTERVAL_MS: z.coerce.number().int().min(1_000).default(5_000),
  WEBHOOK_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(10_000),
  SINGLE_TENANT: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  SINGLE_TENANT_ORG_NAME: z.string().trim().min(1).max(100).default("OpenMantle"),
  SINGLE_TENANT_ADMIN_EMAIL: z.string().email().default("admin@openmantle.local"),
  SUBSCRIPTION_POLL_INTERVAL_MS: z.coerce.number().int().min(60_000).default(300_000),
  HISTORICAL_SYNC_INTERVAL_MS: z.coerce.number().int().min(60_000).default(900_000),
});

export type Config = z.infer<typeof schema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return schema.parse(env);
}
