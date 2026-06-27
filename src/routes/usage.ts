import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "pg";
import { z } from "zod";
import { verifyAppEventsCredentials } from "../app-events/service.js";
import { encryptCredential } from "../crypto/credentials.js";
import { scheduleUsageForward } from "../queues.js";

const appParams = z.object({ appId: z.string().uuid() });
const meterHandle = z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9_.-]+$/);
const createMeterSchema = z.object({ key: meterHandle });
const credentialsSchema = z.object({
  clientId: z.string().trim().min(1).max(200),
  clientSecret: z.string().min(1).max(1_000),
});
const usageSchema = z.object({
  shop_id: z.string().uuid(),
  meter_key: meterHandle,
  quantity: z.number().int().safe().refine((value) => value !== 0, "quantity must not be zero"),
  idempotency_key: z.string().min(1).max(64),
});

interface UsageTarget extends QueryResultRow {
  shop_id: string;
  meter_id: string;
}

interface UsageEventRow extends QueryResultRow {
  id: string;
  shopId: string;
  meterId: string;
  type: "usage" | "correction";
  quantity: string;
  idempotencyKey: string;
  status: "pending" | "reported" | "failed";
  createdAt: Date;
}

export async function usageRoutes(app: FastifyInstance): Promise<void> {
  app.get("/v1/apps/:appId/meters", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appParams.parse(request.params);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, app_id AS "appId", key, created_at AS "createdAt"
       FROM meters WHERE app_id = $1 ORDER BY created_at ASC`, [appId]);
    return { data: result.rows };
  });

  app.post("/v1/apps/:appId/meters", { preHandler: app.requireSession }, async (request, reply) => {
    const { appId } = appParams.parse(request.params);
    const body = createMeterSchema.parse(request.body);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `INSERT INTO meters (organization_id, app_id, key) VALUES ($1, $2, $3)
       RETURNING id, app_id AS "appId", key`,
      [request.auth!.organizationId, appId, body.key]);
    return reply.code(201).send(result.rows[0]);
  });

  app.put("/v1/apps/:appId/app-events-credentials", { preHandler: app.requireSession }, async (request, reply) => {
    const { appId } = appParams.parse(request.params);
    const body = credentialsSchema.parse(request.body);
    await verifyAppEventsCredentials(app.config, body.clientId, body.clientSecret);
    const encryptedSecret = encryptCredential(body.clientSecret, app.config.CREDENTIAL_ENCRYPTION_KEY);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `UPDATE apps SET app_events_client_id = $2, encrypted_app_events_client_secret = $3, updated_at = now()
       WHERE id = $1 RETURNING id`, [appId, body.clientId, encryptedSecret]);
    if (!result.rows[0]) return reply.code(404).send({ error: "App not found" });
    await app.redis.del(`openmantle:app-events-token:${appId}`);
    return { appId, verified: true };
  });

  app.post("/v1/usage", { preHandler: app.requireApiKey }, async (request, reply) => {
    const body = usageSchema.parse(request.body);
    const organizationId = request.auth!.organizationId;
    const client = await app.pg.connect();
    let event: UsageEventRow;
    let duplicate: boolean;
    try {
      await client.query("BEGIN");
      await client.query("select set_config('app.current_org_id', $1, true)", [organizationId]);
      const target = await client.query<UsageTarget>(
        `SELECT s.id AS shop_id, m.id AS meter_id
         FROM shops s
         JOIN meters m ON m.app_id = s.app_id AND m.organization_id = s.organization_id
         WHERE s.id = $1 AND m.key = $2`,
        [body.shop_id, body.meter_key],
      );
      if (!target.rows[0]) {
        await client.query("ROLLBACK");
        return reply.code(404).send({ error: "Shop or meter not found" });
      }
      const { shop_id: shopId, meter_id: meterId } = target.rows[0];
      const inserted = await client.query<UsageEventRow>(
        `INSERT INTO usage_events
           (organization_id, shop_id, meter_id, type, quantity, idempotency_key)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (shop_id, idempotency_key) DO NOTHING
         RETURNING id, shop_id AS "shopId", meter_id AS "meterId", type, quantity,
                   idempotency_key AS "idempotencyKey", status, created_at AS "createdAt"`,
        [organizationId, shopId, meterId, body.quantity > 0 ? "usage" : "correction", body.quantity, body.idempotency_key],
      );
      duplicate = inserted.rows.length === 0;
      if (duplicate) {
        const existing = await client.query<UsageEventRow>(
          `SELECT id, shop_id AS "shopId", meter_id AS "meterId", type, quantity,
                  idempotency_key AS "idempotencyKey", status, created_at AS "createdAt"
           FROM usage_events WHERE shop_id = $1 AND idempotency_key = $2`,
          [shopId, body.idempotency_key],
        );
        if (!existing.rows[0]) throw new Error("Idempotent usage event could not be reloaded");
        event = existing.rows[0];
      } else {
        event = inserted.rows[0]!;
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
    if (event.status === "pending") {
      await scheduleUsageForward(app.queues, app.config, {
        organizationId,
        shopId: event.shopId,
        meterId: event.meterId,
      });
    }
    return reply.code(202).send({ id: event.id, status: event.status, duplicate });
  });

  app.get("/v1/dead-letter-jobs", { preHandler: app.requireSession }, async (request) => {
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, queue, job_id AS "jobId", payload, error, attempts, resolved,
              created_at AS "createdAt"
       FROM dead_letter_jobs WHERE resolved = false ORDER BY created_at DESC LIMIT 100`);
    return { data: result.rows };
  });
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
