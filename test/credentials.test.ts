import { describe, expect, it } from "vitest";
import { decryptCredential, encryptCredential } from "../src/crypto/credentials.js";

const key = Buffer.from("0123456789abcdef0123456789abcdef").toString("base64");

describe("Partner credential encryption", () => {
  it("round-trips a token using authenticated encryption", () => {
    const encrypted = encryptCredential("shp_partner_secret", key);
    expect(encrypted).not.toContain("shp_partner_secret");
    expect(decryptCredential(encrypted, key)).toBe("shp_partner_secret");
  });

  it("rejects a tampered envelope", () => {
    const encrypted = encryptCredential("shp_partner_secret", key);
    const tampered = `${encrypted.slice(0, -1)}${encrypted.endsWith("A") ? "B" : "A"}`;
    expect(() => decryptCredential(tampered, key)).toThrow();
  });
});
