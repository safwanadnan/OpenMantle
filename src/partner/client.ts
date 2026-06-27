import type { PartnerRateLimiter } from "./rate-limiter.js";

export interface GraphqlError {
  message: string;
  extensions?: { code?: string } & Record<string, unknown>;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: GraphqlError[];
}

export class PartnerApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: GraphqlError[] = [],
  ) {
    super(message);
    this.name = "PartnerApiError";
  }
}

export interface PartnerClientOptions {
  credentialId: string;
  organizationId: string;
  accessToken: string;
  apiVersion: string;
  rateLimiter: PartnerRateLimiter;
  fetchImplementation?: typeof fetch;
}

export class PartnerClient {
  private readonly fetchImplementation: typeof fetch;

  constructor(private readonly options: PartnerClientOptions) {
    this.fetchImplementation = options.fetchImplementation ?? fetch;
  }

  async query<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await this.options.rateLimiter.acquire(this.options.credentialId);
      try {
        const response = await this.fetchImplementation(
          `https://partners.shopify.com/${encodeURIComponent(this.options.organizationId)}/api/${this.options.apiVersion}/graphql.json`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-shopify-access-token": this.options.accessToken,
              "accept-language": "en",
            },
            body: JSON.stringify({ query, variables }),
            signal: AbortSignal.timeout(15_000),
          },
        );
        const payload = await parseResponse<T>(response);
        const throttled = response.status === 429 || payload.errors?.some((error) => error.extensions?.code === "429");
        if (throttled && attempt < 3) {
          await backoff(attempt);
          continue;
        }
        if (!response.ok || payload.errors?.length) {
          const graphqlStatus = Number(payload.errors?.find((error) => error.extensions?.code)?.extensions?.code);
          const effectiveStatus = Number.isInteger(graphqlStatus) && graphqlStatus >= 400 && graphqlStatus <= 599
            ? graphqlStatus
            : response.status;
          throw new PartnerApiError(
            payload.errors?.map((error) => error.message).join("; ") || `Partner API returned HTTP ${response.status}`,
            effectiveStatus,
            payload.errors,
          );
        }
        if (payload.data === undefined) throw new PartnerApiError("Partner API response did not contain data", response.status);
        return payload.data;
      } catch (error) {
        lastError = error;
        if (error instanceof PartnerApiError && error.status < 500 && error.status !== 429) throw error;
        if (attempt < 3) {
          await backoff(attempt);
          continue;
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Partner API request failed");
  }
}

async function parseResponse<T>(response: Response): Promise<GraphqlResponse<T>> {
  try {
    return await response.json() as GraphqlResponse<T>;
  } catch {
    throw new PartnerApiError(`Partner API returned a non-JSON response (HTTP ${response.status})`, response.status);
  }
}

async function backoff(attempt: number): Promise<void> {
  const delay = 250 * (2 ** attempt) + Math.floor(Math.random() * 100);
  await new Promise((resolve) => setTimeout(resolve, delay));
}
