import { drizzle, type NodePgDatabase, type NodePgTransaction } from "drizzle-orm/node-postgres";
import { sql, type ExtractTablesWithRelations } from "drizzle-orm";
import { Pool, type PoolClient } from "pg";
import * as schema from "./schema.js";

export type Database = NodePgDatabase<typeof schema>;
export type TenantTransaction = NodePgTransaction<
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export function createPool(connectionString: string): Pool {
  return new Pool({ connectionString, max: 20 });
}

export function createDatabase(pool: Pool): Database {
  return drizzle(pool, { schema });
}

export async function withTenant<T>(
  db: Database,
  organizationId: string,
  callback: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.current_org_id', ${organizationId}, true)`);
    return callback(tx);
  });
}

export async function setTenantOnClient(client: PoolClient, organizationId: string): Promise<void> {
  await client.query("select set_config('app.current_org_id', $1, true)", [organizationId]);
}
