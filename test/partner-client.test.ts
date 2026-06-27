import { describe, expect, it, vi } from "vitest";
import { PartnerApiError, PartnerClient } from "../src/partner/client.js";

function client(fetchImplementation: typeof fetch) {
  return new PartnerClient({
    credentialId: "credential-1",
    organizationId: "12345",
    accessToken: "secret",
    apiVersion: "2026-07",
    rateLimiter: { acquire: vi.fn().mockResolvedValue(undefined) } as never,
    fetchImplementation,
  });
}

describe("PartnerClient", () => {
  it("uses the versioned organization endpoint and access-token header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { ok: true } }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    await expect(client(fetchMock).query<{ ok: boolean }>("query { ok }", { id: "1" })).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://partners.shopify.com/12345/api/2026-07/graphql.json",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "x-shopify-access-token": "secret" }),
      }),
    );
  });

  it("turns GraphQL errors inside HTTP 200 into typed HTTP-equivalent errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      errors: [{ message: "Invalid access token", extensions: { code: "401" } }],
    }), { status: 200 }));
    const error = await client(fetchMock).query("query { publicApiVersions { handle } }").catch((value) => value);
    expect(error).toBeInstanceOf(PartnerApiError);
    expect((error as PartnerApiError).status).toBe(401);
  });
});
