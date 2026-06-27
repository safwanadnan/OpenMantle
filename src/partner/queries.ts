export const VERIFY_CREDENTIAL_QUERY = `#graphql
  query VerifyPartnerCredential {
    publicApiVersions {
      handle
      supported
    }
  }
`;

export const ACTIVE_SUBSCRIPTION_QUERY = `#graphql
  query ActiveSubscription($appId: ID!, $shopId: ID!) {
    activeSubscription(appId: $appId, shopId: $shopId) {
      app { id apiKey name }
      shop { id myshopifyDomain name }
      billingPeriod
      cancelAtEndOfCycle
      legacySubscriptionId
      trialEndsAt
      currentBillingCycle { startTime endTime }
      items {
        handle
        description
        price {
          __typename
          active
          currency
          ... on FlatRatePrice { amount }
          ... on TieredPrice {
            tiersMode
            tiers { amount amountPerUnit upTo }
          }
        }
        usage { quantity cost { amount currencyCode } }
      }
      pendingUpdate {
        billingPeriod
        legacySubscriptionId
        items {
          handle
          description
          price { __typename active currency }
        }
      }
    }
  }
`;

export const HISTORICAL_EVENTS_QUERY = `#graphql
  query HistoricalEvents($after: String) {
    events(first: 100, after: $after, orderBy: OCCURRED_AT_ASC) {
      edges {
        cursor
        node {
          __typename
          id
          eventType
          occurredAt
          shop { id myshopifyDomain name }
          subject {
            __typename
            ... on AppReference { id apiKey name }
            ... on ThemeReference { id name }
          }
        }
      }
      pageInfo { endCursor hasNextPage }
    }
  }
`;
