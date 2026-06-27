---
title: appSubscriptionCancel - Partner API
description: Cancels an app subscription.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel.md
api_name: partner
api_type: graphql
type: mutation
---

# app​Subscription​Cancel

mutation

Cancels an app subscription.

## Arguments

* app​Id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  required

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

## App​Subscription​Cancel​Payload returns

* app​Subscription

  [Cancelled​Subscription](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription)

  The app subscription that was cancelled.

* user​Errors

  [\[User​Error!\]](https://shopify.dev/docs/api/partner/2026-07/objects/UserError)

  Errors when cancelling the app subscription.

***

## Examples

* ### appSubscriptionCancel reference
