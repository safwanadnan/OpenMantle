# OpenMantle

OpenMantle is an open-source billing infrastructure layer for Shopify App Pricing. The repository contains the Phase 1 foundation plus the Partner API integration layer: encrypted credentials, distributed rate limiting, active-subscription polling, historical-event synchronization, and welcome-link confirmation.

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

Register a Shopify app using its `gid://shopify/App/...` ID, then register installs using each shop's `gid://shopify/Shop/...` ID and `.myshopify.com` domain. Creating a shop schedules a staggered subscription poll immediately and every five minutes. Historical events sync every fifteen minutes per credential.

Configure the Shopify App Pricing welcome link to:

```text
https://your-openmantle-host/v1/shopify/app-pricing/return/<openmantle-app-id>
```

Shopify appends `plan_handle` and `shop`. OpenMantle immediately queries `activeSubscription` before confirming the plan and writing a snapshot.

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

Phases 1 and 2 are implemented. Phase 3—public usage ingestion and App Events forwarding—is next. The Partner operations are pinned to `2026-07`; their query documents live in `src/partner/queries.ts` and follow the repository-local Shopify reference in `.agents/partner/2026-07`.
