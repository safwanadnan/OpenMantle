CREATE OR REPLACE FUNCTION bootstrap_single_tenant(org_name text, admin_email text, admin_password_hash text)
RETURNS TABLE(user_id uuid, organization_id uuid, role text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  org_count integer;
  selected_org uuid;
  selected_user uuid;
BEGIN
  SELECT count(*) INTO org_count FROM organizations;
  IF org_count > 1 THEN
    RAISE EXCEPTION 'SINGLE_TENANT cannot be enabled when multiple organizations exist';
  END IF;

  IF org_count = 0 THEN
    INSERT INTO organizations (name, slug)
    VALUES (org_name, 'single-tenant') RETURNING id INTO selected_org;

    INSERT INTO users (email, password_hash)
    VALUES (lower(admin_email), admin_password_hash)
    ON CONFLICT (email) DO UPDATE SET updated_at = now()
    RETURNING id INTO selected_user;

    INSERT INTO organization_members (organization_id, user_id, role)
    VALUES (selected_org, selected_user, 'owner')
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  ELSE
    SELECT id INTO selected_org FROM organizations LIMIT 1;
    SELECT om.user_id INTO selected_user
    FROM organization_members om
    WHERE om.organization_id = selected_org AND om.role = 'owner'
    ORDER BY om.created_at LIMIT 1;

    IF selected_user IS NULL THEN
      INSERT INTO users (email, password_hash)
      VALUES (lower(admin_email), admin_password_hash)
      ON CONFLICT (email) DO UPDATE SET updated_at = now()
      RETURNING id INTO selected_user;
      INSERT INTO organization_members (organization_id, user_id, role)
      VALUES (selected_org, selected_user, 'owner')
      ON CONFLICT (organization_id, user_id) DO NOTHING;
    END IF;
  END IF;

  RETURN QUERY SELECT selected_user, selected_org, 'owner'::text;
END $$;

CREATE OR REPLACE FUNCTION find_single_tenant()
RETURNS TABLE(user_id uuid, organization_id uuid, role text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF (SELECT count(*) FROM organizations) <> 1 THEN
    RETURN;
  END IF;
  RETURN QUERY
    SELECT om.user_id, om.organization_id, om.role
    FROM organization_members om
    WHERE om.organization_id = (SELECT id FROM organizations LIMIT 1)
    ORDER BY CASE WHEN om.role = 'owner' THEN 0 ELSE 1 END, om.created_at
    LIMIT 1;
END $$;

REVOKE ALL ON FUNCTION bootstrap_single_tenant(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION find_single_tenant() FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'openmantle_app') THEN
    GRANT EXECUTE ON FUNCTION bootstrap_single_tenant(text, text, text) TO openmantle_app;
    GRANT EXECUTE ON FUNCTION find_single_tenant() TO openmantle_app;
  END IF;
END $$;
