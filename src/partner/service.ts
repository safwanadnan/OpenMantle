import type { Redis } from "ioredis";
import type { Pool, PoolClient } from "pg";
import type { Config } from "../config.js";
import { decryptCredential } from "../crypto/credentials.js";
import { PartnerClient } from "./client.js";
import { ACTIVE_SUBSCRIPTION_QUERY, APP_SUBSCRIPTION_CANCEL_MUTATION, HISTORICAL_EVENTS_QUERY } from "./queries.js";
import { PartnerRateLimiter } from "./rate-limiter.js";
import type { ActiveSubscription, CancelSubscriptionResult, HistoricalEventsPage } from "./types.js";
import { scheduleWebhookDispatch, type OpenMantleQueues } from "../queues.js";
import { computeMonthlyAmount } from "../analytics/normalize.js";

interface CredentialRow {
  partner_organization_id: string;
  encrypted_access_token: string;
}

interface PollRow extends CredentialRow {
  shopify_app_id: string;
  shopify_shop_id: string;
}

export function partnerClientForToken(
  config: Config,
  redis: Redis,
  credentialId: string,
  partnerOrganizationId: string,
  accessToken: string,
): PartnerClient {
  return new PartnerClient({
    credentialId,
    organizationId: partnerOrganizationId,
    accessToken,
    apiVersion: config.PARTNER_API_VERSION,
    rateLimiter: new PartnerRateLimiter(redis, config.PARTNER_API_REQUESTS_PER_SECOND),
  });
}

export async function pollActiveSubscription(
  pool: Pool,
  redis: Redis,
  config: Config,
  input: { organizationId: string; credentialId: string; appId: string; shopId: string },
  queues?: Pick<OpenMantleQueues, "webhookDelivery">,
): Promise<ActiveSubscription | null> {
  const row = await loadPollRow(pool, input);
  const partner = partnerClientForToken(
    config,
    redis,
    input.credentialId,
    row.partner_organization_id,
    decryptCredential(row.encrypted_access_token, config.CREDENTIAL_ENCRYPTION_KEY),
  );
  const data = await partner.query<{ activeSubscription: ActiveSubscription | null }>(ACTIVE_SUBSCRIPTION_QUERY, {
    appId: row.shopify_app_id,
    shopId: row.shopify_shop_id,
  });
  const deliveries = await writeSnapshot(pool, input.organizationId, input.shopId, data.activeSubscription);
  if (deliveries > 0 && queues) await scheduleWebhookDispatch(queues, config, input.organizationId);

  // Self-healing plan inference + subscription mirror (non-critical — don't throw on failure)
  if (data.activeSubscription) {
    await inferAndUpsertPlan(pool, input.organizationId, input.appId, data.activeSubscription).catch((error: unknown) => {
      console.error(JSON.stringify({ event: "plan.inference.failed", shopId: input.shopId, error: (error as Error).message }));
    });
    await upsertSubscriptionMirror(pool, input.organizationId, input.shopId, data.activeSubscription).catch((error: unknown) => {
      console.error(JSON.stringify({ event: "subscription.mirror.failed", shopId: input.shopId, error: (error as Error).message }));
    });
  } else {
    await markSubscriptionGone(pool, input.organizationId, input.shopId).catch((error: unknown) => {
      console.error(JSON.stringify({ event: "subscription.mirror.gone.failed", shopId: input.shopId, error: (error as Error).message }));
    });
  }

  return data.activeSubscription;
}

export async function syncHistoricalEvents(
  pool: Pool,
  redis: Redis,
  config: Config,
  input: { organizationId: string; credentialId: string },
): Promise<number> {
  const client = await tenantClient(pool, input.organizationId);
  let credential: CredentialRow;
  let cursor: string | null;
  try {
    const result = await client.query<CredentialRow>(
      "SELECT partner_organization_id, encrypted_access_token FROM partner_credentials WHERE id = $1",
      [input.credentialId],
    );
    if (!result.rows[0]) throw new Error("Partner credential not found");
    credential = result.rows[0];
    const cursorResult = await client.query<{ cursor: string | null }>(
      "SELECT cursor FROM historical_events_cursors WHERE organization_id = $1",
      [input.organizationId],
    );
    cursor = cursorResult.rows[0]?.cursor ?? null;
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const partner = partnerClientForToken(
    config,
    redis,
    input.credentialId,
    credential.partner_organization_id,
    decryptCredential(credential.encrypted_access_token, config.CREDENTIAL_ENCRYPTION_KEY),
  );
  let inserted = 0;
  let hasNextPage = true;
  while (hasNextPage) {
    const page = await partner.query<HistoricalEventsPage>(HISTORICAL_EVENTS_QUERY, { after: cursor });
    const db = await tenantClient(pool, input.organizationId);
    try {
      for (const edge of page.events.edges) {
        const node = edge.node;
        const insert = await db.query(
          `INSERT INTO historical_events
             (organization_id, shopify_event_id, event_type, occurred_at, shopify_shop_id, subject_type, subject_id, payload)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (organization_id, shopify_event_id) DO NOTHING`,
          [
            input.organizationId,
            node.id,
            node.eventType,
            node.occurredAt,
            node.shop?.id ?? null,
            node.subject?.__typename ?? null,
            node.subject?.id ?? null,
            node,
          ],
        );
        cursor = edge.cursor;
        inserted += insert.rowCount ?? 0;
      }
      cursor = page.events.pageInfo.endCursor ?? cursor;
      await db.query(
        `INSERT INTO historical_events_cursors (organization_id, cursor, last_synced_at)
         VALUES ($1, $2, now())
         ON CONFLICT (organization_id) DO UPDATE
         SET cursor = EXCLUDED.cursor, last_synced_at = now(), updated_at = now()`,
        [input.organizationId, cursor],
      );
      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    } finally {
      db.release();
    }
    hasNextPage = page.events.pageInfo.hasNextPage;
    if (page.events.edges.length === 0) break;
  }
  return inserted;
}

/**
 * Cancel a managed pricing subscription via the Partner API.
 * Requires the Partner API credential to have "View financials" permission.
 */
export async function cancelSubscription(
  pool: Pool,
  redis: Redis,
  config: Config,
  input: {
    organizationId: string;
    credentialId: string;
    shopifyAppId: string;
    shopifyShopId: string;
    deferCancellation?: boolean;
    prorate?: boolean;
    skipFinalUsageCharge?: boolean;
  },
): Promise<CancelSubscriptionResult["appSubscriptionCancel"]> {
  const client = await tenantClient(pool, input.organizationId);
  let credential: CredentialRow;
  try {
    const result = await client.query<CredentialRow>(
      "SELECT partner_organization_id, encrypted_access_token FROM partner_credentials WHERE id = $1",
      [input.credentialId],
    );
    if (!result.rows[0]) throw new Error("Partner credential not found");
    credential = result.rows[0];
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  const partner = partnerClientForToken(
    config, redis, input.credentialId,
    credential.partner_organization_id,
    decryptCredential(credential.encrypted_access_token, config.CREDENTIAL_ENCRYPTION_KEY),
  );
  const data = await partner.query<CancelSubscriptionResult>(APP_SUBSCRIPTION_CANCEL_MUTATION, {
    appId: input.shopifyAppId,
    shopId: input.shopifyShopId,
    deferCancellation: input.deferCancellation ?? false,
    prorate: input.prorate ?? false,
    skipFinalUsageCharge: input.skipFinalUsageCharge ?? false,
  });
  if (data.appSubscriptionCancel.userErrors.length > 0) {
    throw new Error(data.appSubscriptionCancel.userErrors.map((e) => e.message).join("; "));
  }
  return data.appSubscriptionCancel;
}

// ---------------------------------------------------------------------------
// Self-healing plan inference
// ---------------------------------------------------------------------------

/**
 * For each active subscription item, ensure a plan row exists locally.
 * If a plan with this handle is new, insert it (is_inferred = true).
 * If it already exists, only update the name to avoid stomping manual configs.
 */
async function inferAndUpsertPlan(
  pool: Pool,
  organizationId: string,
  appId: string,
  subscription: ActiveSubscription,
): Promise<void> {
  const client = await tenantClient(pool, organizationId);
  try {
    for (const item of subscription.items) {
      if (!item.handle || !item.price.active) continue;

      const isFlatRate = item.price.__typename === "FlatRatePrice";
      const priceType = isFlatRate ? "flat_rate" : "tiered";
      const amount = item.price.__typename === "FlatRatePrice"
        ? String(item.price.amount ?? "0")
        : null; // tiered plans don't have a single amount
      const currency = item.price.currency ?? "USD";
      const billingPeriod = subscription.billingPeriod ?? null;

      await client.query(
        `INSERT INTO plans
           (organization_id, app_id, handle, name, price_type, amount, currency_code,
            billing_period, trial_days, is_inferred, inferred_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, now())
         ON CONFLICT (app_id, handle) DO UPDATE
           SET name = EXCLUDED.name,
               updated_at = now()`,
        [
          organizationId, appId,
          item.handle,
          item.description ?? item.handle,
          priceType, amount, currency, billingPeriod,
          null, // trial_days not available from subscription; set manually if needed
        ],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Subscription mirror upsert
// ---------------------------------------------------------------------------

async function upsertSubscriptionMirror(
  pool: Pool,
  organizationId: string,
  shopId: string,
  subscription: ActiveSubscription,
): Promise<void> {
  const client = await tenantClient(pool, organizationId);
  try {
    // Determine the primary plan handle (prefer flat-rate active item)
    const planHandle = subscription.items.find((i) => i.price.__typename === "FlatRatePrice" && i.price.active)?.handle
      ?? subscription.items.find((i) => i.handle)?.handle
      ?? null;

    // Compute precomputed monthly amount from the active flat-rate item
    const flatItem = subscription.items.find((i) => i.price.__typename === "FlatRatePrice" && i.price.active);
    const rawAmount = flatItem?.price.__typename === "FlatRatePrice" ? String(flatItem.price.amount ?? "0") : "0";
    const rawDiscount = flatItem?.discount ?? null;
    const monthlyAmount = computeMonthlyAmount(
      rawAmount,
      subscription.billingPeriod ?? "EVERY_30_DAYS",
      rawDiscount ? {
        percentage: rawDiscount.percentage ?? null,
        fixedAmount: rawDiscount.amount ? String(rawDiscount.amount) : null,
        discountEndsAt: rawDiscount.discountEndsAt ?? null,
        originalDiscountCycles: rawDiscount.originalDiscountCycles ?? null,
      } : null,
    );

    const previous = await client.query<{
      plan_handle: string | null;
      monthly_amount: string | null;
      trial_ends_at: Date | null;
    }>(
      `SELECT plan_handle, monthly_amount, trial_ends_at
       FROM subscriptions WHERE shop_id = $1`,
      [shopId],
    );
    const prior = previous.rows[0] ?? null;

    await client.query(
      `INSERT INTO subscriptions
         (organization_id, shop_id, plan_handle, billing_period, cancel_at_end_of_cycle,
          trial_ends_at, cycle_start_at, cycle_end_at, legacy_subscription_id,
          monthly_amount, raw_payload, observed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now())
       ON CONFLICT (shop_id) DO UPDATE SET
         plan_handle = EXCLUDED.plan_handle,
         billing_period = EXCLUDED.billing_period,
         cancel_at_end_of_cycle = EXCLUDED.cancel_at_end_of_cycle,
         trial_ends_at = EXCLUDED.trial_ends_at,
         cycle_start_at = EXCLUDED.cycle_start_at,
         cycle_end_at = EXCLUDED.cycle_end_at,
         legacy_subscription_id = EXCLUDED.legacy_subscription_id,
         monthly_amount = EXCLUDED.monthly_amount,
         raw_payload = EXCLUDED.raw_payload,
         observed_at = now(),
         updated_at = now()`,
      [
        organizationId, shopId,
        planHandle,
        subscription.billingPeriod ?? null,
        subscription.cancelAtEndOfCycle,
        subscription.trialEndsAt ?? null,
        subscription.currentBillingCycle?.startTime ?? null,
        subscription.currentBillingCycle?.endTime ?? null,
        subscription.legacySubscriptionId ?? null,
        String(monthlyAmount),
        subscription,
      ],
    );

    // Emit lifecycle event for analytics
    await emitSubscriptionEvent(client, organizationId, shopId, {
      prior,
      current: { planHandle, monthlyAmount: String(monthlyAmount) },
      subscription,
    });

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function markSubscriptionGone(
  pool: Pool,
  organizationId: string,
  shopId: string,
): Promise<void> {
  const client = await tenantClient(pool, organizationId);
  try {
    const existing = await client.query<{ plan_handle: string | null; monthly_amount: string | null }>(
      "SELECT plan_handle, monthly_amount FROM subscriptions WHERE shop_id = $1",
      [shopId],
    );
    if (!existing.rows[0]) {
      await client.query("COMMIT");
      return; // Nothing to clean up
    }
    const prior = existing.rows[0];
    await client.query(
      "DELETE FROM subscriptions WHERE shop_id = $1",
      [shopId],
    );
    // Emit cancellation event
    await client.query(
      `INSERT INTO subscription_events
         (organization_id, shop_id, event_type, plan_handle, from_plan_handle,
          monthly_amount, from_monthly_amount, net_change)
       VALUES ($1, $2, 'cancelled', null, $3, '0', $4, $5)`,
      [
        organizationId, shopId,
        prior.plan_handle,
        prior.monthly_amount,
        prior.monthly_amount ? String(-Number(prior.monthly_amount)) : "0",
      ],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function determineEventType(
  prior: { plan_handle: string | null; monthly_amount: string | null; trial_ends_at: Date | null } | null,
  current: { planHandle: string | null; monthlyAmount: string },
  subscription: ActiveSubscription,
): string | null {
  const isTrialActive = subscription.trialEndsAt !== null && new Date(subscription.trialEndsAt) > new Date();

  if (!prior) {
    // First time we see this subscription
    return isTrialActive ? "trial_started" : "activated";
  }
  const hadTrial = prior.trial_ends_at !== null;
  const trialJustEnded = hadTrial && !isTrialActive;
  if (trialJustEnded) return "trial_converted";

  if (prior.plan_handle !== current.planHandle) return "plan_changed";

  // No meaningful change — skip event
  return null;
}

async function emitSubscriptionEvent(
  client: PoolClient,
  organizationId: string,
  shopId: string,
  args: {
    prior: { plan_handle: string | null; monthly_amount: string | null; trial_ends_at: Date | null } | null;
    current: { planHandle: string | null; monthlyAmount: string };
    subscription: ActiveSubscription;
  },
): Promise<void> {
  const eventType = determineEventType(args.prior, args.current, args.subscription);
  if (!eventType) return;

  const fromMonthlyAmount = args.prior?.monthly_amount ?? null;
  const toMonthlyAmount = args.current.monthlyAmount;
  const netChange = fromMonthlyAmount !== null
    ? String(Number(toMonthlyAmount) - Number(fromMonthlyAmount))
    : toMonthlyAmount;

  await client.query(
    `INSERT INTO subscription_events
       (organization_id, shop_id, event_type, plan_handle, from_plan_handle,
        monthly_amount, from_monthly_amount, net_change)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      organizationId, shopId, eventType,
      args.current.planHandle,
      args.prior?.plan_handle ?? null,
      toMonthlyAmount,
      fromMonthlyAmount,
      netChange,
    ],
  );
}

async function loadPollRow(
  pool: Pool,
  input: { organizationId: string; credentialId: string; appId: string; shopId: string },
): Promise<PollRow> {
  const client = await tenantClient(pool, input.organizationId);
  try {
    const result = await client.query<PollRow>(
      `SELECT pc.partner_organization_id, pc.encrypted_access_token, a.shopify_app_id, s.shopify_shop_id
       FROM partner_credentials pc
       JOIN apps a ON a.partner_credential_id = pc.id AND a.organization_id = pc.organization_id
       JOIN shops s ON s.app_id = a.id AND s.organization_id = a.organization_id
       WHERE pc.id = $1 AND a.id = $2 AND s.id = $3`,
      [input.credentialId, input.appId, input.shopId],
    );
    await client.query("COMMIT");
    if (!result.rows[0]) throw new Error("Subscription poll target not found");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

async function writeSnapshot(
  pool: Pool,
  organizationId: string,
  shopId: string,
  subscription: ActiveSubscription | null,
): Promise<number> {
  const client = await tenantClient(pool, organizationId);
  try {
    const planHandle = subscription?.items.find((item) => item.price.__typename === "FlatRatePrice" && item.price.active)?.handle
      ?? subscription?.items.find((item) => item.handle)?.handle
      ?? null;
    const previous = await client.query<{ status: string; plan_handle: string | null; payload: unknown }>(
      `SELECT status, plan_handle, payload FROM subscription_snapshots
       WHERE shop_id = $1 ORDER BY observed_at DESC LIMIT 1`, [shopId],
    );
    const status = subscription ? "active" : "none";
    const snapshot = await client.query<{ id: string; observed_at: Date }>(
      `INSERT INTO subscription_snapshots (organization_id, shop_id, status, plan_handle, payload)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, observed_at`,
      [organizationId, shopId, status, planHandle, subscription ?? {}],
    );
    const prior = previous.rows[0];
    const changed = !prior
      || prior.status !== status
      || prior.plan_handle !== planHandle
      || stableStringify(prior.payload) !== stableStringify(subscription ?? {});
    let deliveries = 0;
    if (changed) {
      const current = snapshot.rows[0]!;
      const inserted = await client.query(
        `INSERT INTO webhook_deliveries (organization_id, endpoint_id, shop_id, event_type, payload)
         SELECT $1, we.id, $2, 'subscription.changed', $3
         FROM webhook_endpoints we
         JOIN shops s ON s.app_id = we.app_id AND s.organization_id = we.organization_id
         WHERE we.organization_id = $1 AND s.id = $2 AND we.active = true`,
        [organizationId, shopId, {
          id: current.id,
          event: "subscription.changed",
          organizationId,
          shopId,
          observedAt: current.observed_at.toISOString(),
          previous: prior ? { status: prior.status, planHandle: prior.plan_handle } : null,
          current: { status, planHandle, subscription },
        }],
      );
      deliveries = inserted.rowCount ?? 0;
    }
    await client.query("COMMIT");
    return deliveries;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

async function tenantClient(pool: Pool, organizationId: string): Promise<PoolClient> {
  const client = await pool.connect();
  await client.query("BEGIN");
  await client.query("select set_config('app.current_org_id', $1, true)", [organizationId]);
  return client;
}
