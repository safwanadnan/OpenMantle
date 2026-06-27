CREATE TABLE historical_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shopify_event_id text NOT NULL,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL,
  shopify_shop_id text,
  subject_type text,
  subject_id text,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT historical_events_org_shopify_id_unique UNIQUE (organization_id, shopify_event_id)
);
CREATE INDEX historical_events_org_occurred_idx ON historical_events(organization_id, occurred_at);

ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_events FORCE ROW LEVEL SECURITY;
CREATE POLICY historical_events_tenant_isolation ON historical_events
  USING (organization_id = current_organization_id())
  WITH CHECK (organization_id = current_organization_id());

ALTER TABLE partner_credentials ADD CONSTRAINT partner_credentials_org_id_unique UNIQUE (organization_id, id);
ALTER TABLE partner_credentials ADD CONSTRAINT partner_credentials_org_partner_org_unique UNIQUE (organization_id, partner_organization_id);
ALTER TABLE apps ADD CONSTRAINT apps_org_id_unique UNIQUE (organization_id, id);
ALTER TABLE shops ADD CONSTRAINT shops_org_id_unique UNIQUE (organization_id, id);
ALTER TABLE meters ADD CONSTRAINT meters_org_id_unique UNIQUE (organization_id, id);

ALTER TABLE apps ADD CONSTRAINT apps_partner_credential_same_org
  FOREIGN KEY (organization_id, partner_credential_id)
  REFERENCES partner_credentials(organization_id, id);
ALTER TABLE shops ADD CONSTRAINT shops_app_same_org
  FOREIGN KEY (organization_id, app_id) REFERENCES apps(organization_id, id);
ALTER TABLE meters ADD CONSTRAINT meters_app_same_org
  FOREIGN KEY (organization_id, app_id) REFERENCES apps(organization_id, id);
ALTER TABLE usage_events ADD CONSTRAINT usage_events_shop_same_org
  FOREIGN KEY (organization_id, shop_id) REFERENCES shops(organization_id, id);
ALTER TABLE usage_events ADD CONSTRAINT usage_events_meter_same_org
  FOREIGN KEY (organization_id, meter_id) REFERENCES meters(organization_id, id);
ALTER TABLE subscription_snapshots ADD CONSTRAINT subscription_snapshots_shop_same_org
  FOREIGN KEY (organization_id, shop_id) REFERENCES shops(organization_id, id);

CREATE OR REPLACE FUNCTION find_app_pricing_redirect(redirect_app_id uuid, redirect_shop_domain text)
RETURNS TABLE(
  organization_id uuid,
  partner_credential_id uuid,
  app_id uuid,
  shop_id uuid,
  shopify_app_id text,
  shopify_shop_id text
)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT apps.organization_id, apps.partner_credential_id, apps.id, shops.id,
         apps.shopify_app_id, shops.shopify_shop_id
  FROM apps
  JOIN shops ON shops.app_id = apps.id AND shops.organization_id = apps.organization_id
  WHERE apps.id = redirect_app_id
    AND apps.partner_credential_id IS NOT NULL
    AND lower(shops.domain) = lower(redirect_shop_domain)
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION find_app_pricing_redirect(uuid, text) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'openmantle_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON historical_events TO openmantle_app;
    GRANT EXECUTE ON FUNCTION find_app_pricing_redirect(uuid, text) TO openmantle_app;
  END IF;
END $$;
