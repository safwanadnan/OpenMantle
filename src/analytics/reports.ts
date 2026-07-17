import type { Pool } from "pg";
import { resolvePeriod } from "./normalize.js";

export type AnalyticsPeriod = "last_7_days" | "last_30_days" | "last_90_days" | "last_12_months" | "all_time";
export type AnalyticsInterval = "day" | "week" | "month";
export type AnalyticsFormat = "money" | "percent" | "count" | "number";

export interface MetricResponse {
  value: number;
  format: AnalyticsFormat;
  period: string;
  periodStart: string;
  periodEnd: string;
  timeSeries: Array<{ value: number; periodStart: string; periodEnd: string }>;
  timeSeriesInterval: AnalyticsInterval;
}

interface AnalyticsInput {
  organizationId: string;
  appId?: string;
  period: string;
  interval: AnalyticsInterval;
}

interface SeriesRow {
  bucket: Date;
  value: string | null;
}

// ---------------------------------------------------------------------------
// MRR — SUM of monthly_amount for all shops with a live subscription as of D
// ---------------------------------------------------------------------------
export async function getMrr(pool: Pool, input: AnalyticsInput): Promise<MetricResponse> {
  const { start, end } = resolvePeriod(input.period);
  const client = await tenantClient(pool, input.organizationId);
  try {
    const appFilter = input.appId ? "AND s.app_id = $3" : "";
    const params: unknown[] = [input.organizationId, input.interval, ...(input.appId ? [input.appId] : [])];
    const result = await client.query<SeriesRow>(
      `SELECT
         date_trunc($2, gs.bucket) AS bucket,
         SUM(sub.monthly_amount::numeric) AS value
       FROM generate_series($1::timestamptz, now(), ('1 ' || $2)::interval) AS gs(bucket)
       LEFT JOIN subscriptions sub
         ON sub.organization_id = $1
         ${appFilter}
         AND sub.created_at <= gs.bucket
         AND sub.observed_at >= gs.bucket
       GROUP BY date_trunc($2, gs.bucket)
       ORDER BY bucket ASC`,
      params,
    );
    await client.query("COMMIT");
    return buildResponse(result.rows, input.period, start, end, input.interval, "money");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// ARR — MRR × 12 (derived)
// ---------------------------------------------------------------------------
export async function getArr(pool: Pool, input: AnalyticsInput): Promise<MetricResponse> {
  const mrr = await getMrr(pool, input);
  return {
    ...mrr,
    value: mrr.value * 12,
    timeSeries: mrr.timeSeries.map((p) => ({ ...p, value: p.value * 12 })),
  };
}

// ---------------------------------------------------------------------------
// Active subscriptions count
// ---------------------------------------------------------------------------
export async function getActiveSubscriptions(pool: Pool, input: AnalyticsInput): Promise<MetricResponse> {
  const { start, end } = resolvePeriod(input.period);
  const client = await tenantClient(pool, input.organizationId);
  try {
    const appFilter = input.appId ? "AND s.app_id = $3" : "";
    const params: unknown[] = [input.organizationId, input.interval, ...(input.appId ? [input.appId] : [])];
    const result = await client.query<SeriesRow>(
      `SELECT
         date_trunc($2, gs.bucket) AS bucket,
         COUNT(sub.id) AS value
       FROM generate_series($1::timestamptz, now(), ('1 ' || $2)::interval) AS gs(bucket)
       LEFT JOIN subscriptions sub
         ON sub.organization_id = $1
         ${appFilter}
         AND sub.created_at <= gs.bucket
         AND sub.observed_at >= gs.bucket
       GROUP BY date_trunc($2, gs.bucket)
       ORDER BY bucket ASC`,
      params,
    );
    await client.query("COMMIT");
    return buildResponse(result.rows, input.period, start, end, input.interval, "count");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Active customers — distinct shops with live subscriptions
// ---------------------------------------------------------------------------
export async function getActiveCustomers(pool: Pool, input: AnalyticsInput): Promise<MetricResponse> {
  const { start, end } = resolvePeriod(input.period);
  const client = await tenantClient(pool, input.organizationId);
  try {
    const appFilter = input.appId ? "AND s.app_id = $3" : "";
    const params: unknown[] = [input.organizationId, input.interval, ...(input.appId ? [input.appId] : [])];
    const result = await client.query<SeriesRow>(
      `SELECT
         date_trunc($2, gs.bucket) AS bucket,
         COUNT(DISTINCT sub.shop_id) AS value
       FROM generate_series($1::timestamptz, now(), ('1 ' || $2)::interval) AS gs(bucket)
       LEFT JOIN subscriptions sub
         ON sub.organization_id = $1
         ${appFilter}
         AND sub.created_at <= gs.bucket
         AND sub.observed_at >= gs.bucket
       GROUP BY date_trunc($2, gs.bucket)
       ORDER BY bucket ASC`,
      params,
    );
    await client.query("COMMIT");
    return buildResponse(result.rows, input.period, start, end, input.interval, "count");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Churn — cancelled subscription events in period ÷ subscriptions at period start
// ---------------------------------------------------------------------------
export async function getChurn(pool: Pool, input: AnalyticsInput): Promise<MetricResponse> {
  const { start, end } = resolvePeriod(input.period);
  const client = await tenantClient(pool, input.organizationId);
  try {
    const appFilter = input.appId ? "AND se.app_id = $4" : "";
    const params: unknown[] = [input.organizationId, start.toISOString(), end.toISOString(), ...(input.appId ? [input.appId] : [])];

    // Count cancellations in period
    const cancelled = await client.query<{ count: string }>(
      `SELECT COUNT(*) AS count
       FROM subscription_events se
       JOIN shops sh ON sh.id = se.shop_id
       WHERE se.organization_id = $1
         AND se.event_type = 'cancelled'
         AND se.occurred_at BETWEEN $2 AND $3
         ${appFilter}`,
      params,
    );

    // Count active subscriptions at start of period
    const startActive = await client.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM subscriptions
       WHERE organization_id = $1 AND created_at <= $2`,
      [input.organizationId, start.toISOString()],
    );

    const cancelledCount = Number(cancelled.rows[0]?.count ?? 0);
    const startCount = Number(startActive.rows[0]?.count ?? 0);
    const churnRate = startCount > 0 ? (cancelledCount / startCount) * 100 : 0;

    await client.query("COMMIT");
    return {
      value: Math.round(churnRate * 100) / 100,
      format: "percent",
      period: input.period,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      timeSeries: [],
      timeSeriesInterval: input.interval,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Trials — started / converted / cancelled breakdown
// ---------------------------------------------------------------------------
export async function getTrials(pool: Pool, input: AnalyticsInput): Promise<MetricResponse & {
  breakdown: { started: number; converted: number; cancelled: number };
}> {
  const { start, end } = resolvePeriod(input.period);
  const client = await tenantClient(pool, input.organizationId);
  try {
    const appFilter = input.appId ? "AND s.app_id = $4" : "";
    const params: unknown[] = [input.organizationId, start.toISOString(), end.toISOString(), ...(input.appId ? [input.appId] : [])];

    const result = await client.query<{ event_type: string; count: string }>(
      `SELECT se.event_type, COUNT(*) AS count
       FROM subscription_events se
       JOIN shops s ON s.id = se.shop_id
       WHERE se.organization_id = $1
         AND se.event_type IN ('trial_started', 'trial_converted', 'cancelled')
         AND se.occurred_at BETWEEN $2 AND $3
         ${appFilter}
       GROUP BY se.event_type`,
      params,
    );
    await client.query("COMMIT");

    const byType = Object.fromEntries(result.rows.map((r) => [r.event_type, Number(r.count)]));
    const started = byType["trial_started"] ?? 0;
    const converted = byType["trial_converted"] ?? 0;
    const cancelled = byType["cancelled"] ?? 0;

    return {
      value: started,
      format: "count",
      period: input.period,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      timeSeries: [],
      timeSeriesInterval: input.interval,
      breakdown: { started, converted, cancelled },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildResponse(
  rows: SeriesRow[],
  period: string,
  start: Date,
  end: Date,
  interval: AnalyticsInterval,
  format: AnalyticsFormat,
): MetricResponse {
  const series = rows.map((row, i) => {
    const bucketStart = new Date(row.bucket);
    const bucketEnd = new Date(bucketStart);
    if (interval === "day") bucketEnd.setDate(bucketEnd.getDate() + 1);
    else if (interval === "week") bucketEnd.setDate(bucketEnd.getDate() + 7);
    else bucketEnd.setMonth(bucketEnd.getMonth() + 1);
    return {
      value: Number(row.value ?? 0),
      periodStart: bucketStart.toISOString(),
      periodEnd: bucketEnd.toISOString(),
    };
  });
  // Last value for stock metrics; sum for flow metrics (handled by caller if needed)
  const value = series.length > 0 ? (series[series.length - 1]?.value ?? 0) : 0;
  return { value, format, period, periodStart: start.toISOString(), periodEnd: end.toISOString(), timeSeries: series, timeSeriesInterval: interval };
}

async function tenantClient(pool: Pool, organizationId: string) {
  const client = await pool.connect();
  await client.query("BEGIN");
  await client.query("select set_config('app.current_org_id', $1, true)", [organizationId]);
  return client;
}
