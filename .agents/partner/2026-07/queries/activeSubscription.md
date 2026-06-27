---
title: activeSubscription - Partner API
description: The active managed pricing subscription for a shop on a given app.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/queries/activeSubscription'
  md: 'https://shopify.dev/docs/api/partner/2026-07/queries/activeSubscription.md'
api_name: partner
api_type: graphql
type: query
---

# active​Subscription

query

The active managed pricing subscription for a shop on a given app.

## Arguments

* app​Id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  required

  The ID of the app to get the active subscription for. Example value: `gid://shopify/App/1234`.

* shop​Id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  required

  The ID of the shop to get the active subscription for. Example value: `gid://shopify/Shop/1234`.

***

## Possible returns

* Active​Subscription

  [Active​Subscription](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription)

  Represents an active pricing subscription between a shop and an app.

  * app

    [App​Reference!](https://shopify.dev/docs/api/partner/2026-07/objects/AppReference)

    non-null

    The app that provides this subscription.

  * billing​Period

    [App​Pricing​Interval!](https://shopify.dev/docs/api/partner/2026-07/enums/AppPricingInterval)

    non-null

    The frequency at which the shop is billed for an app subscription.

  * cancel​At​End​Of​Cycle

    [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

    non-null

    Returns true if the subscription will be cancelled at the end of the cycle.

  * current​Billing​Cycle

    [Billing​Cycle](https://shopify.dev/docs/api/partner/2026-07/objects/BillingCycle)

    The current billing cycle for the subscription. Returns null if the subscription is still in trial.

  * items

    [\[Subscription​Item!\]!](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem)

    non-null

    The subscription items included in this subscription.

  * legacy​Subscription​Id

    [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    The ID of the legacy AppSubscription object accessible via Admin API.

  * pending​Update

    [Pending​Update](https://shopify.dev/docs/api/partner/2026-07/objects/PendingUpdate)

    Pending updates that will be applied at the next billing cycle. Returns null if no pending updates.

  * shop

    [Shop​Reference!](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference)

    non-null

    The shop that owns this subscription.

  * trial​Ends​At

    [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

    The date and time when the trial period ends. Returns null if no active trial.

***

## Examples

* ### activeSubscription reference
