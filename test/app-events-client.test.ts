import { describe, expect, it, vi } from "vitest";
import { AppEventsApiError, AppEventsClient } from "../src/app-events/client.js";

function client(fetchImplementation: typeof fetch) {
  return new AppEventsClient({
    clientId: "client-id",
    clientSecret: "client-secret",
    apiVersion: "unstable",
    fetchImplementation,
  });
}

describe("AppEventsClient", () => {
  it("exchanges Dev Dashboard credentials for an access token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      access_token: "jwt-token",
      expires_in: 3_599,
    }), { status: 200 }));
    await expect(client(fetchMock).createAccessToken()).resolves.toEqual({ accessToken: "jwt-token", expiresIn: 3_599 });
    expect(fetchMock).toHaveBeenCalledWith("https://api.shopify.com/auth/access_token", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ client_id: "client-id", client_secret: "client-secret", grant_type: "client_credentials" }),
    }));
  });

  it("sends one signed usage event and requires Shopify's 202 acknowledgement", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 202 }));
    await client(fetchMock).sendEvent("jwt-token", {
      shopId: "gid://shopify/Shop/123",
      eventHandle: "sms_sent",
      timestamp: "2026-06-27T12:00:00.000Z",
      idempotencyKey: "event-1",
      value: 3,
    });
    expect(fetchMock).toHaveBeenCalledWith("https://api.shopify.com/app/unstable/events", expect.objectContaining({
      headers: expect.objectContaining({ authorization: "Bearer jwt-token" }),
      body: JSON.stringify({
        shop_id: "gid://shopify/Shop/123",
        event_handle: "sms_sent",
        timestamp: "2026-06-27T12:00:00.000Z",
        idempotency_key: "event-1",
        attributes: { value: 3 },
      }),
    }));
  });

  it("classifies throttling as retryable", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 }));
    const error = await client(fetchMock).sendEvent("jwt-token", {
      shopId: "gid://shopify/Shop/123",
      eventHandle: "sms_sent",
      timestamp: "2026-06-27T12:00:00.000Z",
      idempotencyKey: "event-1",
      value: 1,
    }).catch((value) => value);
    expect(error).toBeInstanceOf(AppEventsApiError);
    expect((error as AppEventsApiError).retryable).toBe(true);
  });
});
