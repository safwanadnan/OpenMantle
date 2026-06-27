import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.TEST_DATABASE_URL;
const adminDatabaseUrl = process.env.TEST_DATABASE_ADMIN_URL;
const describeIfDatabase = databaseUrl && adminDatabaseUrl ? describe : describe.skip;
let client: Client;

describeIfDatabase("Postgres tenant RLS", () => {
  beforeAll(async () => {
    const admin = new Client({ connectionString: adminDatabaseUrl });
    await admin.connect();
    const foundation = await readFile(new URL("../drizzle/0000_foundation.sql", import.meta.url), "utf8");
    const partnerIntegration = await readFile(new URL("../drizzle/0001_partner_integration.sql", import.meta.url), "utf8");
    await admin.query(foundation);
    await admin.query(partnerIntegration);
    await admin.end();
    client = new Client({ connectionString: databaseUrl });
    await client.connect();
  });

  afterAll(async () => {
    await client?.end();
  });

  it("prevents an organization from reading or inserting another tenant's apps", async () => {
    const orgA = randomUUID();
    const orgB = randomUUID();

    await client.query("BEGIN");
    await client.query("select set_config('app.current_org_id', $1, true)", [orgA]);
    await client.query("INSERT INTO organizations (id, name, slug) VALUES ($1, 'A', $2)", [orgA, `a-${orgA}`]);
    await client.query("INSERT INTO apps (organization_id, shopify_app_id, name) VALUES ($1, 'app-a', 'App A')", [orgA]);
    await client.query("COMMIT");

    await client.query("BEGIN");
    await client.query("select set_config('app.current_org_id', $1, true)", [orgB]);
    await client.query("INSERT INTO organizations (id, name, slug) VALUES ($1, 'B', $2)", [orgB, `b-${orgB}`]);
    const visible = await client.query("SELECT name FROM apps");
    expect(visible.rows).toEqual([]);
    await expect(
      client.query("INSERT INTO apps (organization_id, shopify_app_id, name) VALUES ($1, 'forbidden', 'Forbidden')", [orgA]),
    ).rejects.toMatchObject({ code: "42501" });
    await client.query("ROLLBACK");
  });
});
