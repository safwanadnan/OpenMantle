---
title: OneTimeChargeExpired - Partner API
description: >-
  An event that marks that a one-time app charge expired before the merchant
  could accept it.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired.md'
api_name: partner
api_type: graphql
type: object
---

# One​Time​Charge​Expired

object

An event that marks that a one-time app charge expired before the merchant could accept it.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  A Shopify [app](https://shopify.dev/concepts/apps).

* charge

  [App​Purchase​One​Time!](https://shopify.dev/docs/api/partner/2026-07/objects/AppPurchaseOneTime)

  non-null

  A one-time app charge for services and features purchased once by a store. For example, a one-time migration of a merchant's data from one platform to another.

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

  * [App​Purchase​One​Time​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppPurchaseOneTimeEvent)

    interface

***

## OneTimeChargeExpired Implements

### Implements

* [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)
* [App​Purchase​One​Time​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppPurchaseOneTimeEvent)
