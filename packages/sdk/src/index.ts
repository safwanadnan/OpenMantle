export interface OpenMantleOptions {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface TrackUsageInput {
  shopId: string;
  meterKey: string;
  quantity: number;
  idempotencyKey: string;
}

export interface UsageReceipt {
  id: string;
  status: "pending" | "reported" | "failed";
  duplicate: boolean;
}

export interface SubscriptionSnapshot {
  id: string;
  shopId: string;
  status: string;
  planHandle: string | null;
  payload: Record<string, unknown>;
  observedAt: string;
}

export interface App {
  id: string;
  partnerCredentialId: string | null;
  shopifyAppId: string;
  name: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  appId: string;
  shopifyShopId: string;
  domain: string | null;
  createdAt: string;
}

export interface HistoricalEvent {
  id: string;
  shopifyEventId: string;
  eventType: string;
  occurredAt: string;
  shopifyShopId: string | null;
  subjectType: string | null;
  subjectId: string | null;
  payload: Record<string, unknown>;
}

export interface PlanChangeOptions {
  intervalMs?: number;
  signal?: AbortSignal;
  onError?: (error: unknown) => void;
}

export class OpenMantleError extends Error {
  constructor(message: string, readonly status: number, readonly body?: unknown) {
    super(message);
    this.name = "OpenMantleError";
  }
}

export class OpenMantle {
  private readonly baseUrl: string;
  private readonly fetchImplementation: typeof fetch;

  constructor(private readonly options: OpenMantleOptions) {
    this.baseUrl = (options.baseUrl ?? "http://localhost:3000").replace(/\/$/, "");
    this.fetchImplementation = options.fetch ?? fetch;
  }

  trackUsage(input: TrackUsageInput): Promise<UsageReceipt> {
    return this.request("/v1/usage", {
      method: "POST",
      body: JSON.stringify({
        shop_id: input.shopId,
        meter_key: input.meterKey,
        quantity: input.quantity,
        idempotency_key: input.idempotencyKey,
      }),
    });
  }

  getSubscription(shopId: string): Promise<SubscriptionSnapshot> {
    return this.request(`/v1/shops/${encodeURIComponent(shopId)}/subscription`);
  }

  listApps(): Promise<App[]> {
    return this.request<{ data: App[] }>("/v1/apps").then((result) => result.data);
  }

  listShops(appId: string): Promise<Shop[]> {
    return this.request<{ data: Shop[] }>(`/v1/apps/${encodeURIComponent(appId)}/shops`).then((result) => result.data);
  }

  listHistoricalEvents(options: { limit?: number; before?: string } = {}): Promise<HistoricalEvent[]> {
    const query = new URLSearchParams();
    if (options.limit !== undefined) query.set("limit", String(options.limit));
    if (options.before) query.set("before", options.before);
    const suffix = query.size ? `?${query}` : "";
    return this.request<{ data: HistoricalEvent[] }>(`/v1/historical-events${suffix}`).then((result) => result.data);
  }

  onPlanChange(
    shopId: string,
    callback: (current: SubscriptionSnapshot, previous: SubscriptionSnapshot) => void | Promise<void>,
    options: PlanChangeOptions = {},
  ): () => void {
    const controller = new AbortController();
    const intervalMs = Math.max(1_000, options.intervalMs ?? 30_000);
    const stop = () => controller.abort();
    options.signal?.addEventListener("abort", stop, { once: true });
    void (async () => {
      let previous: SubscriptionSnapshot | undefined;
      while (!controller.signal.aborted) {
        try {
          const current = await this.getSubscription(shopId);
          if (previous && snapshotFingerprint(current) !== snapshotFingerprint(previous)) {
            await callback(current, previous);
          }
          previous = current;
        } catch (error) {
          if (!controller.signal.aborted) options.onError?.(error);
        }
        await delay(intervalMs, controller.signal);
      }
    })();
    return stop;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await this.fetchImplementation(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.options.apiKey}`,
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
    });
    const body = await response.json().catch(() => undefined) as unknown;
    if (!response.ok) {
      const message = body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : `OpenMantle API returned HTTP ${response.status}`;
      throw new OpenMantleError(message, response.status, body);
    }
    return body as T;
  }
}

function snapshotFingerprint(snapshot: SubscriptionSnapshot): string {
  return JSON.stringify([snapshot.status, snapshot.planHandle, snapshot.payload]);
}

async function delay(milliseconds: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return;
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, milliseconds);
    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
  });
}
