---
title: SubscriptionDiscount - Partner API
description: Discounts applied to subscription items.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionDiscount'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionDiscount.md'
api_name: partner
api_type: graphql
type: object
---

# Subscription​Discount

object

Discounts applied to subscription items.

## Fields

* amount

  [Decimal](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  The fixed amount value of a discount.

* discount​Ends​At

  [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  The date and time when the discount ends.

* original​Discount​Cycles

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  The total number of billing cycles the discount was originally set to apply. The discount will be applied to an indefinite number of billing intervals if this value is blank.

* percentage

  [Float](https://shopify.dev/docs/api/partner/2026-07/scalars/Float)

  The percentage value of a discount.

* remaining​Discount​Cycles

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  The number of billing cycles remaining for this discount.

***

## Map

### Fields with this object

* [SubscriptionItem.discount](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem#field-SubscriptionItem.fields.discount)
