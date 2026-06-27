# OpenMantle

OpenMantle is an open-source billing infrastructure layer for Shopify App Pricing. This repository currently contains the Phase 1 foundation: a Fastify API, BullMQ worker, PostgreSQL/Drizzle schema with enforced tenant RLS, Redis, Caddy, dashboard authentication, and API-key management.

## Run locally

1. Copy `.env.example` to `.env` and replace `JWT_SECRET` with at least 32 random characters.
2. Run `docker compose up --build`.
3. Check `http://localhost:3000/health/ready`.

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

Phase 1 is implemented. Partner credentials, Partner API polling, App Events forwarding, subscription redirects, and usage ingestion belong to the next phases and are not represented as working integrations yet.
