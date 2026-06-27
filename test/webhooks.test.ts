import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { signWebhook } from "../src/webhooks/service.js";

describe("webhook signing", () => {
  it("signs timestamp and exact request bytes", () => {
    const body = JSON.stringify({ event: "subscription.changed", shopId: "shop-1" });
    const expected = createHmac("sha256", "whsec_test").update(`1719500000.${body}`).digest("hex");
    expect(signWebhook("whsec_test", "1719500000", body)).toBe(expected);
  });
});
