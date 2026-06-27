import { describe, expect, it } from "vitest";
import { createApiKey, hashPassword, parseApiKey, verifyPassword } from "../src/auth/crypto.js";
import { signSession, verifySession } from "../src/auth/jwt.js";

describe("authentication primitives", () => {
  it("hashes passwords with verification", async () => {
    const hash = await hashPassword("a-secure-password");
    expect(hash).not.toContain("a-secure-password");
    expect(await verifyPassword(hash, "a-secure-password")).toBe(true);
    expect(await verifyPassword(hash, "wrong-password")).toBe(false);
  });

  it("only returns a digest when parsing API keys", () => {
    const generated = createApiKey();
    const parsed = parseApiKey(generated.key);
    expect(parsed).toEqual({ prefix: generated.prefix, secretHash: generated.secretHash });
    expect(parseApiKey("invalid")).toBeNull();
  });

  it("signs tenant-bound sessions", async () => {
    const secret = "test-secret-that-is-at-least-thirty-two-characters";
    const claims = { userId: crypto.randomUUID(), organizationId: crypto.randomUUID(), role: "owner" };
    const token = await signSession(claims, secret, "openmantle-test");
    await expect(verifySession(token, secret, "openmantle-test")).resolves.toEqual(claims);
  });
});
