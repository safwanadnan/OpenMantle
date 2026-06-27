import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "pg";
import { z } from "zod";
import { scheduleSubscriptionPoll } from "../queues.js";
import { pollActiveSubscription } from "../partner/service.js";

const uuidParams = z.object({ id: z.string().uuid() });
const appShopParams = z.object({ appId: z.string().uuid() });
const redirectParams = z.object({ appId: z.string().uuid() });
const redirectQuery = z.object({
  plan_handle: z.string().min(1).max(200),
  shop: z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/),
});
const createAppSchema = z.object({
  partnerCredentialId: z.string().uuid(),
  shopifyAppId: z.string().regex(/^gid:\/\/shopify\/App\/\d+$/),
  name: z.string().trim().min(1).max(150),
});
const createShopSchema = z.object({
  shopifyShopId: z.string().regex(/^gid:\/\/shopify\/Shop\/\d+$/),
  domain: z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/),
});
const historicalQuery = z.object({
  limit: z.coerce.number().int().min(1).max(250).default(100),
  before: z.string().datetime().optional(),
});

export async function commerceRoutes(app: FastifyInstance): Promise<void> {
  app.get("/v1/apps", { preHandler: app.requireApiAccess }, async (request) => {
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, partner_credential_id AS "partnerCredentialId", shopify_app_id AS "shopifyAppId", name, created_at AS "createdAt"
       FROM apps ORDER BY created_at DESC`);
    return { data: result.rows };
  });

  app.post("/v1/apps", { preHandler: app.requireSession }, async (request, reply) => {
    const body = createAppSchema.parse(request.body);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `INSERT INTO apps (organization_id, partner_credential_id, shopify_app_id, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, partner_credential_id AS "partnerCredentialId", shopify_app_id AS "shopifyAppId", name`,
      [request.auth!.organizationId, body.partnerCredentialId, body.shopifyAppId, body.name]);
    return reply.code(201).send(result.rows[0]);
  });

  app.get("/v1/apps/:appId/shops", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appShopParams.parse(request.params);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, app_id AS "appId", shopify_shop_id AS "shopifyShopId", domain, created_at AS "createdAt"
       FROM shops WHERE app_id = $1 ORDER BY created_at DESC`, [appId]);
    return { data: result.rows };
  });

  app.post("/v1/apps/:appId/shops", { preHandler: app.requireSession }, async (request, reply) => {
    const { appId } = appShopParams.parse(request.params);
    const body = createShopSchema.parse(request.body);
    const result = await tenantQuery<{
      id: string;
      appId: string;
      credentialId: string;
      shopifyShopId: string;
      domain: string;
    }>(app, request.auth!.organizationId,
      `WITH inserted AS (
         INSERT INTO shops (organization_id, app_id, shopify_shop_id, domain)
         VALUES ($1, $2, $3, $4)
         RETURNING id, app_id, shopify_shop_id, domain
       )
       SELECT i.id, i.app_id AS "appId", a.partner_credential_id AS "credentialId",
              i.shopify_shop_id AS "shopifyShopId", i.domain
       FROM inserted i JOIN apps a ON a.id = i.app_id`,
      [request.auth!.organizationId, appId, body.shopifyShopId, body.domain]);
    const shop = result.rows[0];
    if (!shop?.credentialId) return reply.code(400).send({ error: "App does not have a Partner credential" });
    await scheduleSubscriptionPoll(app.queues, app.config, {
      organizationId: request.auth!.organizationId,
      credentialId: shop.credentialId,
      appId,
      shopId: shop.id,
    });
    return reply.code(201).send(shop);
  });

  app.get("/v1/shops/:id/subscription", { preHandler: app.requireApiAccess }, async (request, reply) => {
    const { id } = uuidParams.parse(request.params);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, shop_id AS "shopId", status, plan_handle AS "planHandle", payload,
              observed_at AS "observedAt"
       FROM subscription_snapshots WHERE shop_id = $1 ORDER BY observed_at DESC LIMIT 1`, [id]);
    if (!result.rows[0]) return reply.code(404).send({ error: "Subscription snapshot not found" });
    return result.rows[0];
  });

  app.get("/v1/historical-events", { preHandler: app.requireApiAccess }, async (request) => {
    const query = historicalQuery.parse(request.query);
    const result = await tenantQuery(app, request.auth!.organizationId,
      `SELECT id, shopify_event_id AS "shopifyEventId", event_type AS "eventType",
              occurred_at AS "occurredAt", shopify_shop_id AS "shopifyShopId",
              subject_type AS "subjectType", subject_id AS "subjectId", payload
       FROM historical_events WHERE ($1::timestamptz IS NULL OR occurred_at < $1)
       ORDER BY occurred_at DESC LIMIT $2`, [query.before ?? null, query.limit]);
    return { data: result.rows };
  });

  app.get("/v1/shopify/app-pricing/return/:appId", async (request, reply) => {
    const { appId } = redirectParams.parse(request.params);
    const query = redirectQuery.parse(request.query);
    const target = await app.pg.query<{
      organization_id: string;
      partner_credential_id: string;
      app_id: string;
      shop_id: string;
    }>("SELECT * FROM find_app_pricing_redirect($1, $2)", [appId, query.shop]);
    const row = target.rows[0];
    if (!row) return reply.code(404).send({ error: "App or shop not found" });
    const subscription = await pollActiveSubscription(app.pg, app.redis, app.config, {
      organizationId: row.organization_id,
      credentialId: row.partner_credential_id,
      appId: row.app_id,
      shopId: row.shop_id,
    }, app.queues);
    const confirmed = subscription?.items.some((item) => item.handle === query.plan_handle) ?? false;
    if (!confirmed) {
      return reply.code(409).send({ error: "Shopify has not confirmed the selected plan", planHandle: query.plan_handle });
    }
    return { confirmed: true, planHandle: query.plan_handle, shop: query.shop };
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
