import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  getActiveCustomers,
  getActiveSubscriptions,
  getArr,
  getChurn,
  getMrr,
  getTrials,
  type AnalyticsInterval,
} from "../analytics/reports.js";

const appParams = z.object({ appId: z.string().uuid() });

const analyticsQuery = z.object({
  period: z.enum(["last_7_days", "last_30_days", "last_90_days", "last_12_months", "all_time"]).default("last_30_days"),
  interval: z.enum(["day", "week", "month"]).default("day"),
});

export async function analyticsRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /v1/apps/:appId/analytics/mrr
   * Monthly Recurring Revenue — sum of monthly_amount for all active subscriptions.
   */
  app.get("/v1/apps/:appId/analytics/mrr", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appParams.parse(request.params);
    const query = analyticsQuery.parse(request.query);
    return getMrr(app.pg, {
      organizationId: request.auth!.organizationId,
      appId,
      period: query.period,
      interval: query.interval as AnalyticsInterval,
    });
  });

  /**
   * GET /v1/apps/:appId/analytics/arr
   * Annual Recurring Revenue — MRR × 12.
   */
  app.get("/v1/apps/:appId/analytics/arr", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appParams.parse(request.params);
    const query = analyticsQuery.parse(request.query);
    return getArr(app.pg, {
      organizationId: request.auth!.organizationId,
      appId,
      period: query.period,
      interval: query.interval as AnalyticsInterval,
    });
  });

  /**
   * GET /v1/apps/:appId/analytics/active-subscriptions
   * Count of active subscriptions over time.
   */
  app.get("/v1/apps/:appId/analytics/active-subscriptions", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appParams.parse(request.params);
    const query = analyticsQuery.parse(request.query);
    return getActiveSubscriptions(app.pg, {
      organizationId: request.auth!.organizationId,
      appId,
      period: query.period,
      interval: query.interval as AnalyticsInterval,
    });
  });

  /**
   * GET /v1/apps/:appId/analytics/active-customers
   * Count of distinct shops with active subscriptions over time.
   */
  app.get("/v1/apps/:appId/analytics/active-customers", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appParams.parse(request.params);
    const query = analyticsQuery.parse(request.query);
    return getActiveCustomers(app.pg, {
      organizationId: request.auth!.organizationId,
      appId,
      period: query.period,
      interval: query.interval as AnalyticsInterval,
    });
  });

  /**
   * GET /v1/apps/:appId/analytics/churn
   * Churn rate — cancelled subscriptions / subscriptions at start of period.
   * Returns a percentage value (e.g. 4.5 = 4.5%).
   */
  app.get("/v1/apps/:appId/analytics/churn", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appParams.parse(request.params);
    const query = analyticsQuery.parse(request.query);
    return getChurn(app.pg, {
      organizationId: request.auth!.organizationId,
      appId,
      period: query.period,
      interval: query.interval as AnalyticsInterval,
    });
  });

  /**
   * GET /v1/apps/:appId/analytics/trials
   * Trial breakdown — started / converted / cancelled counts.
   * The `breakdown` field contains the split; `value` is total started.
   */
  app.get("/v1/apps/:appId/analytics/trials", { preHandler: app.requireApiAccess }, async (request) => {
    const { appId } = appParams.parse(request.params);
    const query = analyticsQuery.parse(request.query);
    return getTrials(app.pg, {
      organizationId: request.auth!.organizationId,
      appId,
      period: query.period,
      interval: query.interval as AnalyticsInterval,
    });
  });
}
