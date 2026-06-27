import type { Redis } from "ioredis";
import type { Pool, PoolClient } from "pg";
import type { Config } from "../config.js";
import { decryptCredential } from "../crypto/credentials.js";
import { PartnerClient } from "./client.js";
import { ACTIVE_SUBSCRIPTION_QUERY, HISTORICAL_EVENTS_QUERY } from "./queries.js";
import { PartnerRateLimiter } from "./rate-limiter.js";
import type { ActiveSubscription, HistoricalEventsPage } from "./types.js";

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
  await writeSnapshot(pool, input.organizationId, input.shopId, data.activeSubscription);
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
): Promise<void> {
  const client = await tenantClient(pool, organizationId);
  try {
    const planHandle = subscription?.items.find((item) => item.price.__typename === "FlatRatePrice" && item.price.active)?.handle
      ?? subscription?.items.find((item) => item.handle)?.handle
      ?? null;
    await client.query(
      `INSERT INTO subscription_snapshots (organization_id, shop_id, status, plan_handle, payload)
       VALUES ($1, $2, $3, $4, $5)`,
      [organizationId, shopId, subscription ? "active" : "none", planHandle, subscription ?? {}],
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
