DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'openmantle_app') THEN
    CREATE ROLE openmantle_app LOGIN PASSWORD 'openmantle_app';
  END IF;
END $$;
