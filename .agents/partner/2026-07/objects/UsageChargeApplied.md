---
title: UsageChargeApplied - Partner API
description: An event that marks that an app usage charge was applied.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/UsageChargeApplied'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/UsageChargeApplied.md'
api_name: partner
api_type: graphql
type: object
---

# Usage​Charge​Applied

object

An event that marks that an app usage charge was applied.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  A Shopify [app](https://shopify.dev/concepts/apps).

* charge

  [App​Usage​Record!](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageRecord)

  non-null

  An app charge. This charge varies based on how much the merchant uses the app or a service that the app integrates with.

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

  * [App​Usage​Record​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppUsageRecordEvent)

    interface

***

## UsageChargeApplied Implements

### Implements

* [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)
* [App​Usage​Record​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppUsageRecordEvent)
