export interface AppEventsClientOptions {
  clientId: string;
  clientSecret: string;
  apiVersion: string;
  fetchImplementation?: typeof fetch;
}

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
}

export class AppEventsApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "AppEventsApiError";
  }

  get retryable(): boolean {
    return this.status === 409 || this.status === 429 || this.status >= 500;
  }
}

export class AppEventsClient {
  private readonly fetchImplementation: typeof fetch;

  constructor(private readonly options: AppEventsClientOptions) {
    this.fetchImplementation = options.fetchImplementation ?? fetch;
  }

  async createAccessToken(): Promise<{ accessToken: string; expiresIn: number }> {
    const response = await this.fetchImplementation("https://api.shopify.com/auth/access_token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        grant_type: "client_credentials",
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const payload = await parseJson<TokenResponse>(response);
    if (!response.ok || !payload.access_token) {
      throw new AppEventsApiError(payload.error || `App Events authentication returned HTTP ${response.status}`, response.status);
    }
    return { accessToken: payload.access_token, expiresIn: payload.expires_in ?? 3_599 };
  }

  async sendEvent(accessToken: string, event: {
    shopId: string;
    eventHandle: string;
    timestamp: string;
    idempotencyKey: string;
    value: number;
  }): Promise<void> {
    const response = await this.fetchImplementation(
      `https://api.shopify.com/app/${this.options.apiVersion}/events`,
      {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          shop_id: event.shopId,
          event_handle: event.eventHandle,
          timestamp: event.timestamp,
          idempotency_key: event.idempotencyKey,
          attributes: { value: event.value },
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (response.status !== 202) {
      const payload: { error?: string } = await parseJson<{ error?: string }>(response).catch(() => ({}));
      throw new AppEventsApiError(payload.error || `App Events API returned HTTP ${response.status}`, response.status);
    }
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return await response.json() as T;
  } catch {
    throw new AppEventsApiError(`App Events API returned a non-JSON response (HTTP ${response.status})`, response.status);
  }
}
