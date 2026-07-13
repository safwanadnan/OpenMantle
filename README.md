# OpenMantle

OpenMantle is an open-source billing infrastructure layer for Shopify App Pricing. The repository contains the Phase 1 foundation, the Partner API integration layer, and the Phase 3 usage pipeline: idempotent ingestion, grouped forwarding, encrypted App Events credentials, token refresh, corrections, retries, and dead-letter visibility.

## Run locally

1. Copy `.env.example` to `.env` and replace `JWT_SECRET` with at least 32 random characters.
2. Generate a credential encryption key with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` and set `CREDENTIAL_ENCRYPTION_KEY`.
3. Run `docker compose up --build`.
4. Check `http://localhost:3000/health/ready`.

The migration service runs once before the API and worker start. PostgreSQL and Redis data are persisted in named Docker volumes.

## First account

```bash
curl -X POST http://localhost:3000/v1/auth/signup \
  -H "content-type: application/json" \
  -d '{"organizationName":"Acme Apps","email":"owner@example.com","password":"a-long-development-password"}'
```

Use the returned token to create an SDK key:

```bash
curl -X POST http://localhost:3000/v1/api-keys \
  -H "content-type: application/json" \
  -H "authorization: Bearer <dashboard-token>" \
  -d '{"name":"Local SDK"}'
```

The `key` field is shown once. Store it securely.

## Connect Shopify

Create a Partner API client with **Manage apps** permission, then connect it. The token is verified against Shopify before being encrypted with AES-256-GCM.

```bash
curl -X POST http://localhost:3000/v1/partner-credentials \
  -H "content-type: application/json" \
  -H "authorization: Bearer <dashboard-token>" \
  -d '{"partnerOrganizationId":"123456","accessToken":"<partner-access-token>"}'
```

Register a Shopify app using its numeric ID, then register installs using each shop's numeric ID and `.myshopify.com` domain. Creating a shop schedules a staggered subscription poll immediately and every five minutes. Historical events sync every fifteen minutes per credential.

Configure the Shopify App Pricing welcome link to:

```text
https://your-openmantle-host/v1/shopify/app-pricing/return/<openmantle-app-id>
```

Shopify appends `plan_handle` and `shop`. OpenMantle immediately queries `activeSubscription` before confirming the plan and writing a snapshot.

## Report usage

The App Events API uses separate Dev Dashboard credentials. Configure them on each OpenMantle app; the secret is verified before it is encrypted at rest:

```bash
curl -X PUT http://localhost:3000/v1/apps/<openmantle-app-id>/app-events-credentials \
  -H "content-type: application/json" \
  -H "authorization: Bearer <dashboard-token>" \
  -d '{"clientId":"<dev-dashboard-client-id>","clientSecret":"<dev-dashboard-client-secret>"}'
```

Create a meter whose key exactly matches the Shopify App Pricing event handle:

```bash
curl -X POST http://localhost:3000/v1/apps/<openmantle-app-id>/meters \
  -H "content-type: application/json" \
  -H "authorization: Bearer <dashboard-token>" \
  -d '{"key":"sms_sent"}'
```

SDK callers can then submit usage with the API key. Positive quantities are usage; negative quantities are stored and forwarded as corrections. Zero is rejected. Shopify's launch announcement says negative reporting is supported, while the current endpoint reference still describes billing values as greater than zero; verify corrections against the private test plan before enabling them in production.

```bash
curl -X POST http://localhost:3000/v1/usage \
  -H "content-type: application/json" \
  -H "authorization: Bearer <openmantle-api-key>" \
  -d '{"shop_id":"<openmantle-shop-id>","meter_key":"sms_sent","quantity":3,"idempotency_key":"sms-batch-2026-06-27-001"}'
```

The endpoint persists first and responds `202` quickly. The database uniqueness constraint on `(shop_id, idempotency_key)` makes retries safe. Workers coalesce events by shop and meter, then send the individual requests required by Shopify. Transient failures retry six times; exhausted events are marked failed and surfaced by `GET /v1/dead-letter-jobs`.

Shopify's `202 Accepted` response confirms ingestion, not successful billing validation. Inspect App Billing Event logs in the Dev Dashboard while validating a meter integration.

## Public API and SDK

The machine-readable OpenAPI 3.1 contract is available at `GET /openapi.yaml` and in [`docs/openapi.yaml`](docs/openapi.yaml). API keys can read apps, shops, meters, subscription snapshots, and paginated historical events in addition to reporting usage.

The publishable TypeScript client lives in [`packages/sdk`](packages/sdk). Build it with:

```bash
npm run build:sdk
```

```ts
import { OpenMantle } from "@openmantle/sdk";

const mantle = new OpenMantle({ apiKey: process.env.OPENMANTLE_API_KEY! });
await mantle.trackUsage({ shopId, meterKey: "sms_sent", quantity: 1, idempotencyKey: eventId });
const stop = mantle.onPlanChange(shopId, async (current, previous) => {
  console.log(previous.planHandle, "->", current.planHandle);
});
```

## Subscription webhooks

Create an outbound endpoint with `POST /v1/webhook-endpoints` using a dashboard token and `{ "appId": "...", "url": "https://..." }`. The signing secret is returned once. Delivery records are committed in the same transaction that records a changed subscription snapshot, retried up to eight times, and visible at `GET /v1/webhook-deliveries`.

Webhook requests include `X-OpenMantle-Event`, `X-OpenMantle-Delivery`, `X-OpenMantle-Timestamp`, and `X-OpenMantle-Signature`. Verify the signature by computing HMAC-SHA256 over `<timestamp>.<exact request body>` and comparing it with the hex value after `sha256=`.

## Dashboard

Open `http://localhost:3000/dashboard` after the stack is healthy. The dashboard is built entirely from Shopify Polaris web components loaded from Shopify's CDN; it has no CSS framework, React component library, or custom visual elements.

It covers Partner credential setup, apps and shops, App Events credentials, meters, per-shop subscription state, usage analytics, historical events, API keys, outbound webhooks, delivery history, and dead-letter resolution.

For a trusted self-hosted installation, set `SINGLE_TENANT=true`. OpenMantle creates or reuses the sole organization and the dashboard obtains its owner session automatically. Do not expose single-tenant mode on an untrusted public network because it intentionally skips interactive login.

## Development

```bash
npm install
npm run typecheck
npm test
npm run dev:api
```

Local processes expect `DATABASE_URL`, `REDIS_URL`, and `JWT_SECRET`. Use `npm run db:migrate` after the database is available.

The RLS integration test is opt-in so unit tests do not require Docker:

```bash
$env:TEST_DATABASE_ADMIN_URL="postgres://migration-owner:password@localhost:5432/openmantle_test"
$env:TEST_DATABASE_URL="postgres://openmantle-app:password@localhost:5432/openmantle_test"
npm run test:integration
```

The API database role must be a non-superuser without `BYPASSRLS`; the migration role owns the schema. Docker Compose creates this separation automatically. Production deployments should use unique passwords rather than the local Compose defaults.

See [docs/architecture.md](docs/architecture.md) for the domain model and tenant isolation design.

## Current scope

Phases 1–5 are implemented. Phase 6—backups, observability, limiter load testing, and production hardening—is next. The SDK package is prepared at version `0.1.0` but is not published automatically. Partner operations are pinned to `2026-07`; App Events defaults to Shopify's currently published `unstable` endpoint and is independently configurable with `APP_EVENTS_API_VERSION`.
