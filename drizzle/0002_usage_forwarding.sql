ALTER TABLE apps ADD COLUMN app_events_client_id text;
ALTER TABLE apps ADD COLUMN encrypted_app_events_client_secret text;
ALTER TABLE usage_events ADD COLUMN forward_attempts integer NOT NULL DEFAULT 0;

CREATE INDEX usage_events_pending_group_idx
  ON usage_events (organization_id, shop_id, meter_id, created_at)
  WHERE status = 'pending';

ALTER TABLE apps ADD CONSTRAINT apps_app_events_credentials_complete CHECK (
  (app_events_client_id IS NULL AND encrypted_app_events_client_secret IS NULL)
  OR (app_events_client_id IS NOT NULL AND encrypted_app_events_client_secret IS NOT NULL)
);
