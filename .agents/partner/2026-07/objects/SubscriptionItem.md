---
title: SubscriptionItem - Partner API
description: Individual items within a subscription.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem.md'
api_name: partner
api_type: graphql
type: object
---

# Subscription​Item

object

Individual items within a subscription.

## Fields

* description

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  The plan or event description for this subscription item.

* discount

  [Subscription​Discount](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionDiscount)

  The discount applied to this item, if any.

* handle

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  The plan or event handle for this subscription item.

* price

  [Price!](https://shopify.dev/docs/api/partner/2026-07/interfaces/Price)

  non-null

  The pricing information for this subscription item.

* usage

  [Usage](https://shopify.dev/docs/api/partner/2026-07/objects/Usage)

  The usage information for this subscription item if the price is a tiered price.

***

## Map

### Fields with this object

* [ActiveSubscription.items](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.items)
* [CancelledSubscription.items](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.items)
* [PendingUpdate.items](https://shopify.dev/docs/api/partner/2026-07/objects/PendingUpdate#field-PendingUpdate.fields.items)
