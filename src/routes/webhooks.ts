import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "pg";
import { z } from "zod";
import { encryptCredential } from "../crypto/credentials.js";
import { scheduleWebhookDispatch } from "../queues.js";

const endpointParams = z.object({ id: z.string().uuid() });
const endpointSchema = z.object({
  appId: z.string().uuid(),
  url: z.string().url().max(2_048),
});

export async function webhookRoutes(app: FastifyInstance): Promise<void> {
  app.get("/v1/webhook-endpoints", { preHandler: app.requireSession }, async (request) => {
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, app_id AS "appId", url, active, created_at AS "createdAt"
       FROM webhook_endpoints ORDER BY created_at DESC`);
    return { data: result.rows };
  });

  app.post("/v1/webhook-endpoints", { preHandler: app.requireSession }, async (request, reply) => {
    const body = endpointSchema.parse(request.body);
    const url = validateWebhookUrl(body.url, app.config.NODE_ENV);
    const secret = `whsec_${randomBytes(32).toString("base64url")}`;
    const result = await tenantQuery(app, request.auth!.organizationId,
      `INSERT INTO webhook_endpoints (organization_id, app_id, url, encrypted_secret)
       VALUES ($1, $2, $3, $4)
       RETURNING id, app_id AS "appId", url, active, created_at AS "createdAt"`,
      [request.auth!.organizationId, body.appId, url, encryptCredential(secret, app.config.CREDENTIAL_ENCRYPTION_KEY)]);
    await scheduleWebhookDispatch(app.queues, app.config, request.auth!.organizationId);
    return reply.code(201).send({ ...result.rows[0], secret });
  });

  app.delete("/v1/webhook-endpoints/:id", { preHandler: app.requireSession }, async (request, reply) => {
    const { id } = endpointParams.parse(request.params);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `UPDATE webhook_endpoints SET active = false, updated_at = now() WHERE id = $1 RETURNING id`, [id]);
    if (!result.rows[0]) return reply.code(404).send({ error: "Webhook endpoint not found" });
    return reply.code(204).send();
  });

  app.get("/v1/webhook-deliveries", { preHandler: app.requireSession }, async (request) => {
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, endpoint_id AS "endpointId", shop_id AS "shopId", event_type AS "eventType",
              status, attempts, next_attempt_at AS "nextAttemptAt", delivered_at AS "deliveredAt",
              last_error AS "lastError", created_at AS "createdAt"
       FROM webhook_deliveries ORDER BY created_at DESC LIMIT 100`);
    return { data: result.rows };
  });
}

function validateWebhookUrl(value: string, nodeEnv: string): string {
  const url = new URL(value);
  if (url.username || url.password) throw Object.assign(new Error("Webhook URL must not include credentials"), { statusCode: 400 });
  const localDevelopment = nodeEnv !== "production" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(localDevelopment && url.protocol === "http:")) {
    throw Object.assign(new Error("Webhook URL must use HTTPS"), { statusCode: 400 });
  }
  return url.toString();
}

async function tenantQuery<T extends QueryResultRow = Record<string, unknown>>(
  app: FastifyInstance,
  organizationId: string,
  sql: string,
  parameters: unknown[] = [],
) {
  const client = await app.pg.connect();
  try {
    await client.query("BEGIN");
    await client.query("select set_config('app.current_org_id', $1, true)", [organizationId]);
    const result = await client.query<T>(sql, parameters);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
