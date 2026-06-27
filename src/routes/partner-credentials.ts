import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { encryptCredential } from "../crypto/credentials.js";
import { scheduleHistoricalSync } from "../queues.js";
import { PartnerApiError } from "../partner/client.js";
import { VERIFY_CREDENTIAL_QUERY } from "../partner/queries.js";
import { partnerClientForToken } from "../partner/service.js";

const credentialSchema = z.object({
  partnerOrganizationId: z.string().regex(/^\d+$/, "Partner organization ID must be numeric"),
  accessToken: z.string().trim().min(20).max(500),
});

export async function partnerCredentialRoutes(app: FastifyInstance): Promise<void> {
  app.get("/v1/partner-credentials", { preHandler: app.requireSession }, async (request) => {
    const client = await app.pg.connect();
    try {
      await client.query("BEGIN");
      await client.query("select set_config('app.current_org_id', $1, true)", [request.auth!.organizationId]);
      const result = await client.query(
        `SELECT id, partner_organization_id AS "partnerOrganizationId", verified_at AS "verifiedAt",
                created_at AS "createdAt"
         FROM partner_credentials ORDER BY created_at DESC`,
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

  app.post("/v1/partner-credentials", { preHandler: app.requireSession }, async (request, reply) => {
    const body = credentialSchema.parse(request.body);
    const credentialId = randomUUID();
    const partner = partnerClientForToken(
      app.config,
      app.redis,
      `verify-${request.auth!.organizationId}-${body.partnerOrganizationId}`,
      body.partnerOrganizationId,
      body.accessToken,
    );
    try {
      await partner.query<{ publicApiVersions: Array<{ handle: string; supported: boolean }> }>(VERIFY_CREDENTIAL_QUERY);
    } catch (error) {
      if (error instanceof PartnerApiError && (error.status === 401 || error.status === 404)) {
        return reply.code(401).send({ error: "Shopify rejected the Partner organization ID or access token" });
      }
      throw error;
    }

    const client = await app.pg.connect();
    try {
      await client.query("BEGIN");
      await client.query("select set_config('app.current_org_id', $1, true)", [request.auth!.organizationId]);
      await client.query(
        `INSERT INTO partner_credentials
           (id, organization_id, partner_organization_id, encrypted_access_token, verified_at)
         VALUES ($1, $2, $3, $4, now())`,
        [
          credentialId,
          request.auth!.organizationId,
          body.partnerOrganizationId,
          encryptCredential(body.accessToken, app.config.CREDENTIAL_ENCRYPTION_KEY),
        ],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      if ((error as { code?: string }).code === "23505") {
        return reply.code(409).send({ error: "A credential for this Partner organization already exists" });
      }
      throw error;
    } finally {
      client.release();
    }

    await scheduleHistoricalSync(app.queues, app.config, {
      organizationId: request.auth!.organizationId,
      credentialId,
    });
    return reply.code(201).send({
      id: credentialId,
      partnerOrganizationId: body.partnerOrganizationId,
      verifiedAt: new Date().toISOString(),
    });
  });
}
