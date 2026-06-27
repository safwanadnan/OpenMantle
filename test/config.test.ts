import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

const base = {
  DATABASE_URL: "postgres://localhost/openmantle",
  REDIS_URL: "redis://localhost:6379",
  JWT_SECRET: "a-development-secret-that-is-long-enough",
  CREDENTIAL_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64"),
};

describe("single-tenant configuration", () => {
  it("is disabled by default", () => {
    expect(loadConfig(base).SINGLE_TENANT).toBe(false);
  });

  it("only enables for the explicit true value", () => {
    expect(loadConfig({ ...base, SINGLE_TENANT: "true" }).SINGLE_TENANT).toBe(true);
    expect(loadConfig({ ...base, SINGLE_TENANT: "false" }).SINGLE_TENANT).toBe(false);
  });
});
