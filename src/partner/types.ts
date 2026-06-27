export interface ActiveSubscription {
  app: { id: string; apiKey: string; name: string };
  shop: { id: string; myshopifyDomain: string; name: string };
  billingPeriod: string;
  cancelAtEndOfCycle: boolean;
  legacySubscriptionId: string | null;
  trialEndsAt: string | null;
  currentBillingCycle: { startTime: string; endTime: string } | null;
  items: Array<{
    handle: string | null;
    description: string | null;
    price: { __typename: string; active: boolean; currency: string } & Record<string, unknown>;
    usage: { quantity: number; cost: { amount: string; currencyCode: string } } | null;
  }>;
  pendingUpdate: Record<string, unknown> | null;
}

export interface HistoricalEventNode {
  __typename: string;
  id: string;
  eventType: string;
  occurredAt: string;
  shop: { id: string; myshopifyDomain: string; name: string } | null;
  subject: ({ __typename: string; id: string } & Record<string, unknown>) | null;
}

export interface HistoricalEventsPage {
  events: {
    edges: Array<{ cursor: string; node: HistoricalEventNode }>;
    pageInfo: { endCursor: string | null; hasNextPage: boolean };
  };
}
