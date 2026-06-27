import { describe, expect, it, vi } from "vitest";
import { OpenMantle, OpenMantleError } from "../packages/sdk/src/index.js";

describe("OpenMantle SDK", () => {
  it("maps trackUsage to the public wire format", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "event-1", status: "pending", duplicate: false }), { status: 202 }));
    const client = new OpenMantle({ apiKey: "om_test.secret", baseUrl: "https://mantle.test/", fetch: fetchMock });
    await expect(client.trackUsage({
      shopId: "shop-1", meterKey: "sms_sent", quantity: 2, idempotencyKey: "sms-1",
    })).resolves.toEqual({ id: "event-1", status: "pending", duplicate: false });
    expect(fetchMock).toHaveBeenCalledWith("https://mantle.test/v1/usage", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ authorization: "Bearer om_test.secret" }),
      body: JSON.stringify({ shop_id: "shop-1", meter_key: "sms_sent", quantity: 2, idempotency_key: "sms-1" }),
    }));
  });

  it("throws a typed error for API failures", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
    const client = new OpenMantle({ apiKey: "bad", fetch: fetchMock });
    const error = await client.listApps().catch((value) => value);
    expect(error).toBeInstanceOf(OpenMantleError);
    expect((error as OpenMantleError).status).toBe(401);
  });
});
