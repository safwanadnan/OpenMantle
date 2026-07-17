import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "pg";
import { z } from "zod";
import { cancelSubscription } from "../partner/service.js";

const appShopParams = z.object({
  appId: z.string().uuid(),
  shopId: z.string().uuid(),
});

const cancelSchema = z.object({
  deferCancellation: z.boolean().default(false),
  prorate: z.boolean().default(false),
  skipFinalUsageCharge: z.boolean().default(false),
});

export async function subscriptionRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /v1/apps/:appId/shops/:shopId/subscription
   * Returns the mirrored subscription with plan details.
   * Pulls from the new `subscriptions` table (managed pricing mirror).
   */
  app.get("/v1/apps/:appId/shops/:shopId/subscription", { preHandler: app.requireApiAccess }, async (request, reply) => {
    const { appId, shopId } = appShopParams.parse(request.params);
    const result = await tenantQuery<{
      id: string;
      shopId: string;
      appId: string;
      planHandle: string | null;
      billingPeriod: string | null;
      cancelAtEndOfCycle: boolean;
      trialEndsAt: string | null;
      cycleStartAt: string | null;
      cycleEndAt: string | null;
      monthlyAmount: string | null;
      observedAt: string;
      plan: Record<string, unknown> | null;
    }>(app, request.auth!.organizationId,
      `SELECT
         s.id,
         s.shop_id AS "shopId",
         sh.app_id AS "appId",
         s.plan_handle AS "planHandle",
         s.billing_period AS "billingPeriod",
         s.cancel_at_end_of_cycle AS "cancelAtEndOfCycle",
         s.trial_ends_at AS "trialEndsAt",
         s.cycle_start_at AS "cycleStartAt",
         s.cycle_end_at AS "cycleEndAt",
         s.monthly_amount AS "monthlyAmount",
         s.observed_at AS "observedAt",
         CASE WHEN p.id IS NOT NULL THEN
           json_build_object(
             'id', p.id,
             'handle', p.handle,
             'name', p.name,
             'priceType', p.price_type,
             'amount', p.amount,
             'currencyCode', p.currency_code,
             'billingPeriod', p.billing_period,
             'trialDays', p.trial_days,
             'isInferred', p.is_inferred
           )
         ELSE NULL END AS "plan"
       FROM subscriptions s
       JOIN shops sh ON sh.id = s.shop_id AND sh.organization_id = s.organization_id
       LEFT JOIN plans p ON p.handle = s.plan_handle AND p.app_id = sh.app_id AND p.organization_id = s.organization_id
       WHERE s.shop_id = $1 AND sh.app_id = $2`,
      [shopId, appId],
    );
    if (!result.rows[0]) {
      return reply.code(404).send({ error: "No active subscription found for this shop" });
    }
    return result.rows[0];
  });

  /**
   * POST /v1/apps/:appId/shops/:shopId/subscription/cancel
   * Cancels the shop's managed pricing subscription via the Partner API.
   * Requires the partner credential to have "View financials" permission.
   */
  app.post("/v1/apps/:appId/shops/:shopId/subscription/cancel", { preHandler: app.requireSession }, async (request, reply) => {
    const { appId, shopId } = appShopParams.parse(request.params);
    const body = cancelSchema.parse(request.body ?? {});
    const organizationId = request.auth!.organizationId;

    // Load shopify IDs and credential
    const target = await tenantQuery<{
      credentialId: string;
      shopifyAppId: string;
      shopifyShopId: string;
    }>(app, organizationId,
      `SELECT
         a.partner_credential_id AS "credentialId",
         a.shopify_app_id AS "shopifyAppId",
         s.shopify_shop_id AS "shopifyShopId"
       FROM apps a
       JOIN shops s ON s.app_id = a.id AND s.organization_id = a.organization_id
       WHERE a.id = $1 AND s.id = $2`,
      [appId, shopId],
    );

    const row = target.rows[0];
    if (!row) return reply.code(404).send({ error: "App or shop not found" });
    if (!row.credentialId) return reply.code(400).send({ error: "App does not have a Partner credential" });

    const result = await cancelSubscription(app.pg, app.redis, app.config, {
      organizationId,
      credentialId: row.credentialId,
      shopifyAppId: row.shopifyAppId,
      shopifyShopId: row.shopifyShopId,
      deferCancellation: body.deferCancellation,
      prorate: body.prorate,
      skipFinalUsageCharge: body.skipFinalUsageCharge,
    });

    return {
      cancelled: true,
      cancelAtEndOfCycle: result.appSubscription?.cancelAtEndOfCycle ?? false,
      billingPeriod: result.appSubscription?.billingPeriod ?? null,
      finalBillingCycleEnd: result.appSubscription?.currentBillingCycle?.endTime ?? null,
    };
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
