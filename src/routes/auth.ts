import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../auth/crypto.js";
import { signSession } from "../auth/jwt.js";

const signupSchema = z.object({
  organizationName: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12).max(200),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

function slugify(value: string): string {
  const base = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return `${base || "organization"}-${randomUUID().slice(0, 8)}`;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/v1/auth/signup", async (request, reply) => {
    if (app.config.SINGLE_TENANT) return reply.code(404).send({ error: "Signup is disabled in single-tenant mode" });
    const body = signupSchema.parse(request.body);
    const passwordHash = await hashPassword(body.password);
    const organizationId = randomUUID();
    const client = await app.pg.connect();
    try {
      await client.query("BEGIN");
      await client.query("select set_config('app.current_org_id', $1, true)", [organizationId]);
      await client.query(
        "INSERT INTO organizations (id, name, slug) VALUES ($1, $2, $3)",
        [organizationId, body.organizationName, slugify(body.organizationName)],
      );
      const user = await client.query<{ id: string }>(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
        [body.email, passwordHash],
      );
      const userId = user.rows[0]!.id;
      await client.query(
        "INSERT INTO organization_members (organization_id, user_id, role) VALUES ($1, $2, 'owner')",
        [organizationId, userId],
      );
      await client.query("COMMIT");
      const token = await signSession({ userId, organizationId, role: "owner" }, app.config.JWT_SECRET, app.config.JWT_ISSUER);
      return reply.code(201).send({ token, organizationId, userId });
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      if ((error as { code?: string }).code === "23505") {
        return reply.code(409).send({ error: "An account with that email already exists" });
      }
      throw error;
    } finally {
      client.release();
    }
  });

  app.post("/v1/auth/login", async (request, reply) => {
    if (app.config.SINGLE_TENANT) return reply.code(404).send({ error: "Login is disabled in single-tenant mode" });
    const body = loginSchema.parse(request.body);
    const result = await app.pg.query<{
      user_id: string;
      password_hash: string;
      organization_id: string;
      role: string;
    }>("SELECT * FROM find_login_user($1)", [body.email]);
    const user = result.rows[0];
    if (!user || !(await verifyPassword(user.password_hash, body.password))) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }
    const token = await signSession(
      { userId: user.user_id, organizationId: user.organization_id, role: user.role },
      app.config.JWT_SECRET,
      app.config.JWT_ISSUER,
    );
    return { token, organizationId: user.organization_id, userId: user.user_id };
  });

  app.post("/v1/auth/single-tenant-session", async (_request, reply) => {
    if (!app.config.SINGLE_TENANT) return reply.code(404).send({ error: "Single-tenant mode is disabled" });
    const result = await app.pg.query<{ user_id: string; organization_id: string; role: string }>(
      "SELECT * FROM find_single_tenant()",
    );
    const user = result.rows[0];
    if (!user) return reply.code(503).send({ error: "Single-tenant organization is not initialized" });
    const token = await signSession(
      { userId: user.user_id, organizationId: user.organization_id, role: user.role },
      app.config.JWT_SECRET,
      app.config.JWT_ISSUER,
    );
    return { token, organizationId: user.organization_id, userId: user.user_id };
  });
}
