import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const usageEventType = pgEnum("usage_event_type", ["usage", "correction"]);
export const usageEventStatus = pgEnum("usage_event_status", ["pending", "reported", "failed"]);
export const webhookDeliveryStatus = pgEnum("webhook_delivery_status", ["pending", "delivered", "failed"]);

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ...timestamps,
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("owner"),
  ...timestamps,
}, (table) => [uniqueIndex("organization_members_org_user_unique").on(table.organizationId, table.userId)]);

export const partnerCredentials = pgTable("partner_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  partnerOrganizationId: text("partner_organization_id").notNull(),
  encryptedAccessToken: text("encrypted_access_token").notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("partner_credentials_org_idx").on(table.organizationId),
  uniqueIndex("partner_credentials_org_partner_org_unique").on(table.organizationId, table.partnerOrganizationId),
]);

export const apps = pgTable("apps", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  partnerCredentialId: uuid("partner_credential_id").references(() => partnerCredentials.id, { onDelete: "set null" }),
  shopifyAppId: text("shopify_app_id").notNull(),
  appEventsClientId: text("app_events_client_id"),
  encryptedAppEventsClientSecret: text("encrypted_app_events_client_secret"),
  name: text("name").notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("apps_org_shopify_id_unique").on(table.organizationId, table.shopifyAppId),
  index("apps_org_idx").on(table.organizationId),
]);

export const shops = pgTable("shops", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  appId: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" }),
  shopifyShopId: text("shopify_shop_id").notNull(),
  domain: text("domain"),
  ...timestamps,
}, (table) => [
  uniqueIndex("shops_app_shopify_id_unique").on(table.appId, table.shopifyShopId),
  index("shops_org_idx").on(table.organizationId),
]);

export const meters = pgTable("meters", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  appId: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  shopifyMeterId: text("shopify_meter_id"),
  ...timestamps,
}, (table) => [
  uniqueIndex("meters_app_key_unique").on(table.appId, table.key),
  index("meters_org_idx").on(table.organizationId),
]);

export const usageEvents = pgTable("usage_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
  meterId: uuid("meter_id").notNull().references(() => meters.id, { onDelete: "restrict" }),
  type: usageEventType("type").notNull().default("usage"),
  quantity: bigint("quantity", { mode: "number" }).notNull(),
  idempotencyKey: text("idempotency_key").notNull(),
  status: usageEventStatus("status").notNull().default("pending"),
  reportedAt: timestamp("reported_at", { withTimezone: true }),
  failureReason: text("failure_reason"),
  forwardAttempts: integer("forward_attempts").notNull().default(0),
  ...timestamps,
}, (table) => [
  uniqueIndex("usage_events_shop_idempotency_unique").on(table.shopId, table.idempotencyKey),
  index("usage_events_org_status_idx").on(table.organizationId, table.status),
]);

export const subscriptionSnapshots = pgTable("subscription_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  planHandle: text("plan_handle"),
  payload: jsonb("payload").notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("subscription_snapshots_shop_observed_idx").on(table.shopId, table.observedAt)]);

export const historicalEventsCursors = pgTable("historical_events_cursors", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }).unique(),
  cursor: text("cursor"),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  ...timestamps,
});

export const historicalEvents = pgTable("historical_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  shopifyEventId: text("shopify_event_id").notNull(),
  eventType: text("event_type").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  shopifyShopId: text("shopify_shop_id"),
  subjectType: text("subject_type"),
  subjectId: text("subject_id"),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("historical_events_org_shopify_id_unique").on(table.organizationId, table.shopifyEventId),
  index("historical_events_org_occurred_idx").on(table.organizationId, table.occurredAt),
]);

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  prefix: text("prefix").notNull().unique(),
  secretHash: text("secret_hash").notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [index("api_keys_org_idx").on(table.organizationId)]);

export const deadLetterJobs = pgTable("dead_letter_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  queue: text("queue").notNull(),
  jobId: text("job_id"),
  payload: jsonb("payload").notNull(),
  error: text("error").notNull(),
  attempts: integer("attempts").notNull().default(0),
  resolved: boolean("resolved").notNull().default(false),
  ...timestamps,
}, (table) => [index("dead_letter_jobs_org_resolved_idx").on(table.organizationId, table.resolved)]);

export const webhookEndpoints = pgTable("webhook_endpoints", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  appId: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  encryptedSecret: text("encrypted_secret").notNull(),
  active: boolean("active").notNull().default(true),
  ...timestamps,
}, (table) => [index("webhook_endpoints_org_app_idx").on(table.organizationId, table.appId)]);

export const webhookDeliveries = pgTable("webhook_deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  endpointId: uuid("endpoint_id").notNull().references(() => webhookEndpoints.id, { onDelete: "cascade" }),
  shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: webhookDeliveryStatus("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  lastError: text("last_error"),
  ...timestamps,
}, (table) => [index("webhook_deliveries_org_pending_idx").on(table.organizationId, table.status, table.nextAttemptAt)]);

// ---------------------------------------------------------------------------
// Shopify App Managed Pricing
// ---------------------------------------------------------------------------

/** Plan catalog — inferred from observed subscriptions or manually configured. */
export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  appId: uuid("app_id").notNull().references(() => apps.id, { onDelete: "cascade" }),
  handle: text("handle").notNull(),
  name: text("name").notNull(),
  priceType: text("price_type").notNull().default("flat_rate"), // 'flat_rate' | 'tiered'
  amount: text("amount"), // stored as text to preserve decimal precision
  currencyCode: text("currency_code").notNull().default("USD"),
  billingPeriod: text("billing_period"), // 'EVERY_30_DAYS' | 'ANNUAL' | null
  trialDays: integer("trial_days"),
  isInferred: boolean("is_inferred").notNull().default(true),
  inferredAt: timestamp("inferred_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("plans_app_handle_unique").on(table.appId, table.handle),
  index("plans_org_app_idx").on(table.organizationId, table.appId),
]);

/** Live subscription mirror — one row per shop, upserted on every poll. */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
  planHandle: text("plan_handle"),
  billingPeriod: text("billing_period"),
  cancelAtEndOfCycle: boolean("cancel_at_end_of_cycle").notNull().default(false),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  cycleStartAt: timestamp("cycle_start_at", { withTimezone: true }),
  cycleEndAt: timestamp("cycle_end_at", { withTimezone: true }),
  legacySubscriptionId: text("legacy_subscription_id"),
  monthlyAmount: text("monthly_amount"), // precomputed for analytics
  rawPayload: jsonb("raw_payload").notNull().default({}),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
}, (table) => [
  uniqueIndex("subscriptions_shop_unique").on(table.shopId),
  index("subscriptions_org_idx").on(table.organizationId),
  index("subscriptions_org_plan_idx").on(table.organizationId, table.planHandle),
  index("subscriptions_org_cycle_end_idx").on(table.organizationId, table.cycleEndAt),
]);

/** Append-only subscription lifecycle events — powers flow analytics. */
export const subscriptionEvents = pgTable("subscription_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // 'activated' | 'plan_changed' | 'cancelled' | 'trial_started' | 'trial_converted' | 'reactivated'
  planHandle: text("plan_handle"),
  fromPlanHandle: text("from_plan_handle"),
  monthlyAmount: text("monthly_amount"),
  fromMonthlyAmount: text("from_monthly_amount"),
  netChange: text("net_change"), // signed MRR delta
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  rawPayload: jsonb("raw_payload"),
}, (table) => [
  index("sub_events_org_occurred_idx").on(table.organizationId, table.occurredAt),
  index("sub_events_shop_idx").on(table.shopId, table.occurredAt),
  index("sub_events_org_type_idx").on(table.organizationId, table.eventType, table.occurredAt),
]);
