---
title: CreditFailed - Partner API
description: An event that marks that an app credit failed to apply.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed.md'
api_name: partner
api_type: graphql
type: object
---

# Credit​Failed

object

An event that marks that an app credit failed to apply.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  A Shopify [app](https://shopify.dev/concepts/apps).

* app​Credit

  [App​Credit!](https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit)

  non-null

  A [credit](https://shopify.dev/docs/admin-api/rest/reference/billing/applicationcredit) issued to a merchant for an app. Merchants are entitled to app credits under certain circumstances, such as when a paid app subscription is downgraded partway through its billing cycle.

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

* * [App​Credit​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCreditEvent)

    interface

  * [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)

    interface

***

## CreditFailed Implements

### Implements

* [App​Credit​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCreditEvent)
* [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)
