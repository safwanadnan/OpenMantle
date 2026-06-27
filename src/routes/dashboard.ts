import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "pg";
import { z } from "zod";

const analyticsQuery = z.object({ days: z.coerce.number().int().min(1).max(365).default(30) });
const eventsQuery = z.object({
  limit: z.coerce.number().int().min(1).max(250).default(100),
  status: z.enum(["pending", "reported", "failed"]).optional(),
});

export async function dashboardRoutes(app: FastifyInstance): Promise<void> {
  app.get("/v1/dashboard/overview", { preHandler: app.requireSession }, async (request) => {
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT o.id, o.name,
              (SELECT count(*)::int FROM apps) AS "appCount",
              (SELECT count(*)::int FROM shops) AS "shopCount",
              (SELECT count(*)::int FROM usage_events WHERE status = 'pending') AS "pendingUsageCount",
              (SELECT count(*)::int FROM usage_events WHERE status = 'failed') AS "failedUsageCount",
              (SELECT count(*)::int FROM dead_letter_jobs WHERE resolved = false) AS "deadLetterCount",
              (SELECT count(*)::int FROM webhook_deliveries WHERE status = 'failed') AS "failedWebhookCount"
       FROM organizations o WHERE o.id = $1`, [request.auth!.organizationId]);
    return result.rows[0];
  });

  app.get("/v1/dashboard/usage-analytics", { preHandler: app.requireSession }, async (request) => {
    const query = analyticsQuery.parse(request.query);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT date_trunc('day', ue.created_at) AS day, m.key AS "meterKey",
              sum(ue.quantity)::text AS quantity, count(*)::int AS "eventCount",
              count(*) FILTER (WHERE ue.status = 'reported')::int AS "reportedCount"
       FROM usage_events ue JOIN meters m ON m.id = ue.meter_id
       WHERE ue.created_at >= now() - ($1::int * interval '1 day')
       GROUP BY date_trunc('day', ue.created_at), m.key
       ORDER BY day DESC, m.key`, [query.days]);
    return { data: result.rows };
  });

  app.get("/v1/dashboard/usage-events", { preHandler: app.requireSession }, async (request) => {
    const query = eventsQuery.parse(request.query);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT ue.id, ue.type, ue.quantity::text, ue.idempotency_key AS "idempotencyKey",
              ue.status, ue.reported_at AS "reportedAt", ue.failure_reason AS "failureReason",
              ue.created_at AS "createdAt", s.domain AS "shopDomain", m.key AS "meterKey"
       FROM usage_events ue
       JOIN shops s ON s.id = ue.shop_id
       JOIN meters m ON m.id = ue.meter_id
       WHERE ($1::usage_event_status IS NULL OR ue.status = $1)
       ORDER BY ue.created_at DESC LIMIT $2`, [query.status ?? null, query.limit]);
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
