import { randomUUID } from "node:crypto";
import type { Redis } from "ioredis";
import type { Pool, PoolClient } from "pg";
import type { Config } from "../config.js";
import { decryptCredential } from "../crypto/credentials.js";
import { AppEventsApiError, AppEventsClient } from "./client.js";

interface ForwardRow {
  id: string;
  shopify_shop_id: string;
  meter_key: string;
  quantity: string;
  idempotency_key: string;
  created_at: Date;
  app_id: string;
  app_events_client_id: string | null;
  encrypted_app_events_client_secret: string | null;
}

export async function verifyAppEventsCredentials(
  config: Config,
  clientId: string,
  clientSecret: string,
): Promise<void> {
  await new AppEventsClient({ clientId, clientSecret, apiVersion: config.APP_EVENTS_API_VERSION }).createAccessToken();
}

export async function forwardUsageBatch(
  pool: Pool,
  redis: Redis,
  config: Config,
  input: { organizationId: string; shopId: string; meterId: string },
): Promise<{ processed: number; hasMore: boolean }> {
  const lockKey = `openmantle:usage-forward:${input.organizationId}:${input.shopId}:${input.meterId}`;
  const lockValue = randomUUID();
  const locked = await redis.set(lockKey, lockValue, "PX", 120_000, "NX");
  if (!locked) return { processed: 0, hasMore: false };
  try {
    const rows = await loadPendingRows(pool, input, config.USAGE_FORWARD_BATCH_SIZE);
    if (rows.length === 0) return { processed: 0, hasMore: false };
    const credentials = rows[0]!;
    if (!credentials.app_events_client_id || !credentials.encrypted_app_events_client_secret) {
      throw new AppEventsApiError("App Events credentials are not configured", 400);
    }
    const clientSecret = decryptCredential(credentials.encrypted_app_events_client_secret, config.CREDENTIAL_ENCRYPTION_KEY);
    const appEvents = new AppEventsClient({
      clientId: credentials.app_events_client_id,
      clientSecret,
      apiVersion: config.APP_EVENTS_API_VERSION,
    });
    let accessToken = await cachedAccessToken(redis, credentials.app_id, appEvents);
    let processed = 0;
    for (const row of rows) {
      try {
        await appEvents.sendEvent(accessToken, {
          shopId: row.shopify_shop_id,
          eventHandle: row.meter_key,
          timestamp: row.created_at.toISOString(),
          idempotencyKey: row.idempotency_key,
          value: Number(row.quantity),
        });
      } catch (error) {
        if (error instanceof AppEventsApiError && error.status === 401) {
          await redis.del(tokenCacheKey(row.app_id));
          accessToken = await cachedAccessToken(redis, row.app_id, appEvents);
          await appEvents.sendEvent(accessToken, {
            shopId: row.shopify_shop_id,
            eventHandle: row.meter_key,
            timestamp: row.created_at.toISOString(),
            idempotencyKey: row.idempotency_key,
            value: Number(row.quantity),
          });
        } else {
          throw error;
        }
      }
      await markReported(pool, input.organizationId, row.id);
      processed += 1;
    }
    return { processed, hasMore: rows.length === config.USAGE_FORWARD_BATCH_SIZE };
  } finally {
    await redis.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      1,
      lockKey,
      lockValue,
    );
  }
}

export async function deadLetterUsageGroup(
  pool: Pool,
  input: { organizationId: string; shopId: string; meterId: string },
  jobId: string | undefined,
  error: Error,
  attempts: number,
): Promise<void> {
  const client = await tenantClient(pool, input.organizationId);
  try {
    await client.query(
      `UPDATE usage_events SET status = 'failed', failure_reason = $3, forward_attempts = $4, updated_at = now()
       WHERE shop_id = $1 AND meter_id = $2 AND status = 'pending' AND forward_attempts >= $4`,
      [input.shopId, input.meterId, error.message, attempts],
    );
    await client.query(
      `INSERT INTO dead_letter_jobs (organization_id, queue, job_id, payload, error, attempts)
       VALUES ($1, 'usage-forward', $2, $3, $4, $5)`,
      [input.organizationId, jobId ?? null, input, error.message, attempts],
    );
    await client.query("COMMIT");
  } catch (failure) {
    await client.query("ROLLBACK");
    throw failure;
  } finally {
    client.release();
  }
}

async function cachedAccessToken(redis: Redis, appId: string, client: AppEventsClient): Promise<string> {
  const key = tokenCacheKey(appId);
  const cached = await redis.get(key);
  if (cached) return cached;
  const token = await client.createAccessToken();
  await redis.set(key, token.accessToken, "EX", Math.max(30, token.expiresIn - 60));
  return token.accessToken;
}

function tokenCacheKey(appId: string): string {
  return `openmantle:app-events-token:${appId}`;
}

async function loadPendingRows(
  pool: Pool,
  input: { organizationId: string; shopId: string; meterId: string },
  limit: number,
): Promise<ForwardRow[]> {
  const client = await tenantClient(pool, input.organizationId);
  try {
    const result = await client.query<ForwardRow>(
      `WITH selected AS (
         SELECT ue.id, s.shopify_shop_id, m.key AS meter_key, ue.quantity, ue.idempotency_key,
                ue.created_at, a.id AS app_id, a.app_events_client_id, a.encrypted_app_events_client_secret
         FROM usage_events ue
         JOIN shops s ON s.id = ue.shop_id AND s.organization_id = ue.organization_id
         JOIN meters m ON m.id = ue.meter_id AND m.organization_id = ue.organization_id
         JOIN apps a ON a.id = s.app_id AND a.id = m.app_id AND a.organization_id = ue.organization_id
         WHERE ue.shop_id = $1 AND ue.meter_id = $2 AND ue.status = 'pending'
         ORDER BY ue.created_at ASC LIMIT $3
       )
       UPDATE usage_events ue SET forward_attempts = ue.forward_attempts + 1, updated_at = now()
       FROM selected WHERE ue.id = selected.id
       RETURNING ue.id, selected.shopify_shop_id, selected.meter_key, ue.quantity,
                 ue.idempotency_key, ue.created_at, selected.app_id,
                 selected.app_events_client_id, selected.encrypted_app_events_client_secret`,
      [input.shopId, input.meterId, limit],
    );
    await client.query("COMMIT");
    return result.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function markReported(pool: Pool, organizationId: string, eventId: string): Promise<void> {
  const client = await tenantClient(pool, organizationId);
  try {
    await client.query(
      `UPDATE usage_events SET status = 'reported', reported_at = now(), failure_reason = NULL,
              updated_at = now()
       WHERE id = $1 AND status = 'pending'`,
      [eventId],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function tenantClient(pool: Pool, organizationId: string): Promise<PoolClient> {
  const client = await pool.connect();
  await client.query("BEGIN");
  await client.query("select set_config('app.current_org_id', $1, true)", [organizationId]);
  return client;
}
