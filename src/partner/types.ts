export interface FlatRatePriceDetails {
  __typename: "FlatRatePrice";
  active: boolean;
  currency: string;
  amount: string;
}

export interface TieredPriceDetails {
  __typename: "TieredPrice";
  active: boolean;
  currency: string;
  tiersMode: string;
  tiers: Array<{ amount: string; amountPerUnit: string; upTo: number | null }>;
}

export interface SubscriptionDiscount {
  amount: string | null;
  percentage: number | null;
  discountEndsAt: string | null;
  originalDiscountCycles: number | null;
  remainingDiscountCycles: number | null;
}

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
    price: FlatRatePriceDetails | TieredPriceDetails;
    discount: SubscriptionDiscount | null;
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

export interface CancelSubscriptionResult {
  appSubscriptionCancel: {
    appSubscription: {
      billingPeriod: string;
      cancelAtEndOfCycle: boolean;
      currentBillingCycle: { startTime: string; endTime: string } | null;
    } | null;
    userErrors: Array<{ field: string | null; message: string }>;
  };
}

