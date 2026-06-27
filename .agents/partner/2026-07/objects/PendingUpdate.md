---
title: PendingUpdate - Partner API
description: >-
  Represents pending changes to a subscription that will be applied at the next
  billing cycle.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/PendingUpdate'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/PendingUpdate.md'
api_name: partner
api_type: graphql
type: object
---

# Pending​Update

object

Represents pending changes to a subscription that will be applied at the next billing cycle.

## Fields

* billing​Period

  [App​Pricing​Interval!](https://shopify.dev/docs/api/partner/2026-07/enums/AppPricingInterval)

  non-null

  The billing period for the pending update.

* items

  [\[Subscription​Item!\]!](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem)

  non-null

  The subscription items that will be applied in the next billing cycle.

* legacy​Subscription​Id

  [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  The ID of the legacy AppSubscription object accessible via Admin API.

***

## Map

### Fields with this object

* [ActiveSubscription.pendingUpdate](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.pendingUpdate)
* [CancelledSubscription.pendingUpdate](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.pendingUpdate)
