import { createHmac } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import type { Config } from "../config.js";
import { decryptCredential } from "../crypto/credentials.js";

interface DeliveryRow {
  id: string;
  url: string;
  encrypted_secret: string;
  event_type: string;
  payload: unknown;
  attempts: number;
}

export async function dispatchWebhookBatch(
  pool: Pool,
  config: Config,
  organizationId: string,
  fetchImplementation: typeof fetch = fetch,
): Promise<{ delivered: number; failed: number }> {
  let delivered = 0;
  let failed = 0;
  for (let index = 0; index < 25; index += 1) {
    const row = await claimDelivery(pool, organizationId);
    if (!row) break;
    const body = JSON.stringify(row.payload);
    const timestamp = Math.floor(Date.now() / 1_000).toString();
    const secret = decryptCredential(row.encrypted_secret, config.CREDENTIAL_ENCRYPTION_KEY);
    const signature = signWebhook(secret, timestamp, body);
    try {
      const response = await fetchImplementation(row.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "user-agent": "OpenMantle-Webhooks/0.1",
          "x-openmantle-delivery": row.id,
          "x-openmantle-event": row.event_type,
          "x-openmantle-timestamp": timestamp,
          "x-openmantle-signature": `sha256=${signature}`,
        },
        body,
        redirect: "error",
        signal: AbortSignal.timeout(config.WEBHOOK_REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`Webhook endpoint returned HTTP ${response.status}`);
      await finishDelivery(pool, organizationId, row.id, true, row.attempts, null);
      delivered += 1;
    } catch (error) {
      await finishDelivery(pool, organizationId, row.id, false, row.attempts, error instanceof Error ? error.message : "Webhook failed");
      failed += 1;
    }
  }
  return { delivered, failed };
}

export function signWebhook(secret: string, timestamp: string, body: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

async function claimDelivery(pool: Pool, organizationId: string): Promise<DeliveryRow | null> {
  const client = await tenantClient(pool, organizationId);
  try {
    const result = await client.query<DeliveryRow>(
      `WITH candidate AS (
         SELECT wd.id FROM webhook_deliveries wd
         JOIN webhook_endpoints we ON we.id = wd.endpoint_id AND we.organization_id = wd.organization_id
         WHERE wd.status = 'pending' AND wd.next_attempt_at <= now() AND we.active = true
         ORDER BY wd.next_attempt_at ASC, wd.created_at ASC
         FOR UPDATE OF wd SKIP LOCKED LIMIT 1
       )
       UPDATE webhook_deliveries wd
       SET attempts = wd.attempts + 1, next_attempt_at = now() + interval '2 minutes', updated_at = now()
       FROM candidate, webhook_endpoints we
       WHERE wd.id = candidate.id AND we.id = wd.endpoint_id
       RETURNING wd.id, we.url, we.encrypted_secret, wd.event_type, wd.payload, wd.attempts`,
    );
    await client.query("COMMIT");
    return result.rows[0] ?? null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function finishDelivery(
  pool: Pool,
  organizationId: string,
  deliveryId: string,
  success: boolean,
  attempts: number,
  error: string | null,
): Promise<void> {
  const client = await tenantClient(pool, organizationId);
  try {
    if (success) {
      await client.query(
        `UPDATE webhook_deliveries SET status = 'delivered', delivered_at = now(), last_error = NULL, updated_at = now()
         WHERE id = $1`, [deliveryId],
      );
    } else {
      const terminal = attempts >= 8;
      const delaySeconds = Math.min(3_600, 2 ** Math.min(attempts, 11));
      await client.query(
        `UPDATE webhook_deliveries
         SET status = $2, last_error = $3,
             next_attempt_at = CASE WHEN $2 = 'pending' THEN now() + ($4 * interval '1 second') ELSE next_attempt_at END,
             updated_at = now()
         WHERE id = $1`,
        [deliveryId, terminal ? "failed" : "pending", error, delaySeconds],
      );
    }
    await client.query("COMMIT");
  } catch (failure) {
    await client.query("ROLLBACK");
    throw failure;
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
