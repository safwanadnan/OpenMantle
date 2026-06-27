CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE usage_event_type AS ENUM ('usage', 'correction');
CREATE TYPE usage_event_status AS ENUM ('pending', 'reported', 'failed');

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT organization_members_org_user_unique UNIQUE (organization_id, user_id)
);

CREATE TABLE partner_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  partner_organization_id text NOT NULL,
  encrypted_access_token text NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX partner_credentials_org_idx ON partner_credentials(organization_id);

CREATE TABLE apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  partner_credential_id uuid REFERENCES partner_credentials(id) ON DELETE SET NULL,
  shopify_app_id text NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT apps_org_shopify_id_unique UNIQUE (organization_id, shopify_app_id)
);
CREATE INDEX apps_org_idx ON apps(organization_id);

CREATE TABLE shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  shopify_shop_id text NOT NULL,
  domain text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shops_app_shopify_id_unique UNIQUE (app_id, shopify_shop_id)
);
CREATE INDEX shops_org_idx ON shops(organization_id);

CREATE TABLE meters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  key text NOT NULL,
  shopify_meter_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT meters_app_key_unique UNIQUE (app_id, key)
);
CREATE INDEX meters_org_idx ON meters(organization_id);

CREATE TABLE usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  meter_id uuid NOT NULL REFERENCES meters(id) ON DELETE RESTRICT,
  type usage_event_type NOT NULL DEFAULT 'usage',
  quantity bigint NOT NULL,
  idempotency_key text NOT NULL,
  status usage_event_status NOT NULL DEFAULT 'pending',
  reported_at timestamptz,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT usage_events_shop_idempotency_unique UNIQUE (shop_id, idempotency_key),
  CONSTRAINT usage_events_quantity_direction CHECK (
    (type = 'usage' AND quantity > 0) OR (type = 'correction' AND quantity < 0)
  )
);
CREATE INDEX usage_events_org_status_idx ON usage_events(organization_id, status);

CREATE TABLE subscription_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  status text NOT NULL,
  plan_handle text,
  payload jsonb NOT NULL,
  observed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX subscription_snapshots_shop_observed_idx ON subscription_snapshots(shop_id, observed_at);

CREATE TABLE historical_events_cursors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  cursor text,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  prefix text NOT NULL UNIQUE,
  secret_hash text NOT NULL,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX api_keys_org_idx ON api_keys(organization_id);

CREATE TABLE dead_letter_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  queue text NOT NULL,
  job_id text,
  payload jsonb NOT NULL,
  error text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX dead_letter_jobs_org_resolved_idx ON dead_letter_jobs(organization_id, resolved);

CREATE OR REPLACE FUNCTION current_organization_id() RETURNS uuid
LANGUAGE sql STABLE PARALLEL SAFE AS $$
  SELECT nullif(current_setting('app.current_org_id', true), '')::uuid
$$;

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations FORCE ROW LEVEL SECURITY;
CREATE POLICY organizations_tenant_isolation ON organizations
  USING (id = current_organization_id()) WITH CHECK (id = current_organization_id());

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'organization_members', 'partner_credentials', 'apps', 'shops', 'meters',
    'usage_events', 'subscription_snapshots', 'historical_events_cursors',
    'api_keys', 'dead_letter_jobs'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON %I USING (organization_id = current_organization_id()) WITH CHECK (organization_id = current_organization_id())',
      table_name || '_tenant_isolation', table_name
    );
  END LOOP;
END $$;

-- These SECURITY DEFINER functions are the deliberately narrow bootstrap boundary.
-- Normal application reads and writes still run under forced RLS.
CREATE OR REPLACE FUNCTION find_login_user(login_email text)
RETURNS TABLE(user_id uuid, email text, password_hash text, organization_id uuid, role text)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT u.id, u.email, u.password_hash, m.organization_id, m.role
  FROM users u
  JOIN organization_members m ON m.user_id = u.id
  WHERE u.email = lower(login_email)
  ORDER BY m.created_at ASC
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION find_api_key(key_prefix text)
RETURNS TABLE(key_id uuid, organization_id uuid, secret_hash text, revoked_at timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT api_keys.id, api_keys.organization_id, api_keys.secret_hash, api_keys.revoked_at
  FROM api_keys
  WHERE prefix = key_prefix
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION find_login_user(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION find_api_key(text) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'openmantle_app') THEN
    GRANT USAGE ON SCHEMA public TO openmantle_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO openmantle_app;
    REVOKE SELECT, UPDATE, DELETE ON users FROM openmantle_app;
    GRANT INSERT ON users TO openmantle_app;
    GRANT SELECT (id) ON users TO openmantle_app;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO openmantle_app;
    GRANT EXECUTE ON FUNCTION find_login_user(text) TO openmantle_app;
    GRANT EXECUTE ON FUNCTION find_api_key(text) TO openmantle_app;
    GRANT EXECUTE ON FUNCTION current_organization_id() TO openmantle_app;
  END IF;
END $$;
