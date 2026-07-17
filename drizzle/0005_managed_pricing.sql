-- Plans: inferred from observed subscriptions, can also be manually configured.
CREATE TABLE plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  handle text NOT NULL,
  name text NOT NULL,
  price_type text NOT NULL DEFAULT 'flat_rate', -- 'flat_rate' | 'tiered'
  amount numeric(18, 6),
  currency_code text NOT NULL DEFAULT 'USD',
  billing_period text, -- 'EVERY_30_DAYS' | 'ANNUAL' | null for usage-only meters
  trial_days integer,
  is_inferred boolean NOT NULL DEFAULT true,
  inferred_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT plans_app_handle_unique UNIQUE (app_id, handle),
  CONSTRAINT plans_org_id_unique UNIQUE (organization_id, id),
  CONSTRAINT plans_app_same_org FOREIGN KEY (organization_id, app_id)
    REFERENCES apps(organization_id, id)
);
CREATE INDEX plans_org_app_idx ON plans(organization_id, app_id);

-- Subscriptions: full mirror of the Partner API activeSubscription response.
-- One row per shop (upserted on each poll); monthly_amount is precomputed for analytics.
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  plan_handle text,
  billing_period text,
  cancel_at_end_of_cycle boolean NOT NULL DEFAULT false,
  trial_ends_at timestamptz,
  cycle_start_at timestamptz,
  cycle_end_at timestamptz,
  legacy_subscription_id text,
  monthly_amount numeric(18, 6),
  raw_payload jsonb NOT NULL DEFAULT '{}',
  observed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_shop_unique UNIQUE (shop_id),
  CONSTRAINT subscriptions_org_id_unique UNIQUE (organization_id, id),
  CONSTRAINT subscriptions_shop_same_org FOREIGN KEY (organization_id, shop_id)
    REFERENCES shops(organization_id, id)
);
CREATE INDEX subscriptions_org_idx ON subscriptions(organization_id);
CREATE INDEX subscriptions_org_plan_idx ON subscriptions(organization_id, plan_handle);
CREATE INDEX subscriptions_org_cycle_end_idx ON subscriptions(organization_id, cycle_end_at);

-- Subscription events: append-only lifecycle log.
-- Drives flow analytics (churn rate, growth, trial conversion, plan changes).
CREATE TABLE subscription_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'activated' | 'plan_changed' | 'cancelled' | 'trial_started' | 'trial_converted' | 'reactivated'
  plan_handle text,
  from_plan_handle text,
  monthly_amount numeric(18, 6),
  from_monthly_amount numeric(18, 6),
  net_change numeric(18, 6), -- precomputed MRR delta for event-based analytics
  occurred_at timestamptz NOT NULL DEFAULT now(),
  raw_payload jsonb,
  CONSTRAINT subscription_events_shop_same_org FOREIGN KEY (organization_id, shop_id)
    REFERENCES shops(organization_id, id)
);
CREATE INDEX sub_events_org_occurred_idx ON subscription_events(organization_id, occurred_at DESC);
CREATE INDEX sub_events_shop_idx ON subscription_events(shop_id, occurred_at DESC);
CREATE INDEX sub_events_org_type_idx ON subscription_events(organization_id, event_type, occurred_at DESC);

-- Enable RLS on all three tables
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['plans', 'subscriptions', 'subscription_events']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON %I USING (organization_id = current_organization_id()) WITH CHECK (organization_id = current_organization_id())',
      table_name || '_tenant_isolation', table_name
    );
  END LOOP;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'openmantle_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON plans, subscriptions, subscription_events TO openmantle_app;
  END IF;
END $$;
