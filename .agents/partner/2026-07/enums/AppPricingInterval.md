---
title: AppPricingInterval - Partner API
description: The billing frequency for the app.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/enums/AppPricingInterval'
  md: 'https://shopify.dev/docs/api/partner/2026-07/enums/AppPricingInterval.md'
api_name: partner
api_type: graphql
type: enum
---

# App​Pricing​Interval

enum

The billing frequency for the app.

## Valid values

* ANNUAL

  The merchant is billed for this app annually.

* EVERY\_​30\_​DAYS

  The merchant is billed for this app every 30 days.

***

## Fields

* [Active​Subscription.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.billingPeriod)

  OBJECT

  Represents an active pricing subscription between a shop and an app.

* [App​Subscription​Sale.billingInterval](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.billingInterval)

  OBJECT

  A transaction corresponding to an app subscription charge.

* [Cancelled​Subscription.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.billingPeriod)

  OBJECT

  Represents a pricing subscription that was cancelled.

* [Pending​Update.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/PendingUpdate#field-PendingUpdate.fields.billingPeriod)

  OBJECT

  Represents pending changes to a subscription that will be applied at the next billing cycle.

* [Plan.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/Plan#field-Plan.fields.billingPeriod)

  OBJECT

  Subscription plan details.

***

## Map

### Fields with this enum

* [Active​Subscription.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.billingPeriod)
* [App​Subscription​Sale.billingInterval](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.billingInterval)
* [Cancelled​Subscription.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.billingPeriod)
* [Pending​Update.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/PendingUpdate#field-PendingUpdate.fields.billingPeriod)
* [Plan.billingPeriod](https://shopify.dev/docs/api/partner/2026-07/objects/Plan#field-Plan.fields.billingPeriod)
