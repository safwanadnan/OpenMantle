---
title: AppSubscriptionCancelPayload - Partner API
description: The result of an appSubscriptionCancel mutation.
api_version: 2026-07
source_url:
  html: >-
    https://shopify.dev/docs/api/partner/2026-07/payloads/AppSubscriptionCancelPayload
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/payloads/AppSubscriptionCancelPayload.md
api_name: partner
api_type: graphql
type: payload
---

# App​Subscription​Cancel​Payload

payload

The result of an appSubscriptionCancel mutation.

## Fields

* app​Subscription

  [Cancelled​Subscription](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription)

  The app subscription that was cancelled.

* user​Errors

  [\[User​Error!\]](https://shopify.dev/docs/api/partner/2026-07/objects/UserError)

  Errors when cancelling the app subscription.

***

## Mutations with this payload

* [app​Subscription​Cancel](https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel)

  mutation

  Cancels an app subscription.

  * app​Id

    [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    required

    ### Arguments

    The id of the app. Example value: `gid://shopify/App/123`.

  * defer​Cancellation

    [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

    required

    Whether to defer cancellation until the end of the current billing cycle.

  * prorate

    [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

    required

    Whether to issue prorated credits for the unused portion of the subscription. Cannot be used together with `skipFinalUsageCharge`.

  * shop​Id

    [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    required

    The id of the shop. Example value: `gid://shopify/Shop/456`.

  * skip​Final​Usage​Charge

    [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

    required

    Whether to skip the final usage charge when cancelling. Only applicable to usage-billed subscriptions. Cannot be used together with `prorate`.

  ***

***

## Map

### Mutations with this payload

* [app​Subscription​Cancel](https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel)
