---
title: SubscriptionChargeAccepted - Partner API
description: An event that marks that a recurring app charge was accepted.
api_version: 2026-07
source_url:
  html: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeAccepted
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeAccepted.md
api_name: partner
api_type: graphql
type: object
---

# Subscription​Charge​Accepted

object

An event that marks that a recurring app charge was accepted.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  A Shopify [app](https://shopify.dev/concepts/apps).

* charge

  [App​Subscription!](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription)

  non-null

  A recurring charge for use of an app, such as a monthly subscription charge.

* occurred​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the event took place.

* shop

  [Shop!](https://shopify.dev/docs/api/partner/2026-07/objects/Shop)

  non-null

  A Shopify shop.

* type

  [App​Event​Types!](https://shopify.dev/docs/api/partner/2026-07/enums/AppEventTypes)

  non-null

  The type of app event.

***

## Map

No referencing types

***

## Interfaces

* * [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)

    interface

  * [App​Subscription​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppSubscriptionEvent)

    interface

***

## SubscriptionChargeAccepted Implements

### Implements

* [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)
* [App​Subscription​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppSubscriptionEvent)
