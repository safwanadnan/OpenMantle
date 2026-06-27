---
title: BillingCycle - Partner API
description: Represents the current billing cycle for a subscription.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/BillingCycle'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/BillingCycle.md'
api_name: partner
api_type: graphql
type: object
---

# Billing​Cycle

object

Represents the current billing cycle for a subscription.

## Fields

* end​Time

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  When the next charge will occur.

* start​Time

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  When the current billing period started.

***

## Map

### Fields with this object

* [ActiveSubscription.currentBillingCycle](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.currentBillingCycle)
* [CancelledSubscription.currentBillingCycle](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.currentBillingCycle)
