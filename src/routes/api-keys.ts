import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createApiKey } from "../auth/crypto.js";

const createSchema = z.object({ name: z.string().trim().min(1).max(100) });
const paramsSchema = z.object({ id: z.string().uuid() });

export async function apiKeyRoutes(app: FastifyInstance): Promise<void> {
  app.get("/v1/api-keys", { preHandler: app.requireSession }, async (request) => {
    const client = await app.pg.connect();
    try {
      await client.query("BEGIN");
      await client.query("select set_config('app.current_org_id', $1, true)", [request.auth!.organizationId]);
      const result = await client.query(
        `SELECT id, name, prefix, last_used_at AS "lastUsedAt", revoked_at AS "revokedAt", created_at AS "createdAt"
         FROM api_keys ORDER BY created_at DESC`,
      );
      await client.query("COMMIT");
      return { data: result.rows };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.post("/v1/api-keys", { preHandler: app.requireSession }, async (request, reply) => {
    const body = createSchema.parse(request.body);
    const generated = createApiKey();
    const client = await app.pg.connect();
    try {
      await client.query("BEGIN");
      await client.query("select set_config('app.current_org_id', $1, true)", [request.auth!.organizationId]);
      const result = await client.query<{ id: string; createdAt: Date }>(
        `INSERT INTO api_keys (organization_id, name, prefix, secret_hash)
         VALUES ($1, $2, $3, $4) RETURNING id, created_at AS "createdAt"`,
        [request.auth!.organizationId, body.name, generated.prefix, generated.secretHash],
      );
      await client.query("COMMIT");
      return reply.code(201).send({
        id: result.rows[0]!.id,
        name: body.name,
        prefix: generated.prefix,
        key: generated.key,
        createdAt: result.rows[0]!.createdAt,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  app.delete("/v1/api-keys/:id", { preHandler: app.requireSession }, async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);
    const client = await app.pg.connect();
    try {
      await client.query("BEGIN");
      await client.query("select set_config('app.current_org_id', $1, true)", [request.auth!.organizationId]);
      const result = await client.query("UPDATE api_keys SET revoked_at = now(), updated_at = now() WHERE id = $1 AND revoked_at IS NULL", [id]);
      await client.query("COMMIT");
      if (!result.rowCount) return reply.code(404).send({ error: "API key not found" });
      return reply.code(204).send();
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
}
