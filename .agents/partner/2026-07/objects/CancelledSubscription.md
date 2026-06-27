---
title: CancelledSubscription - Partner API
description: Represents a pricing subscription that was cancelled.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription.md
api_name: partner
api_type: graphql
type: object
---

# Cancelled​Subscription

object

Represents a pricing subscription that was cancelled.

## Fields

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

* cancelled​At

  [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  The date and time when the subscription was cancelled. Returns null for deferred cancellations.

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

## Map

No referencing types

***

## Mutations

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

## CancelledSubscription Mutations

### Mutated by

* [app​Subscription​Cancel](https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel)
