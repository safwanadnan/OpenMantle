---
title: AppSaleAdjustment - Partner API
description: >-
  A transaction corresponding to a refund, downgrade, or adjustment of an app
  charge.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment.md'
api_name: partner
api_type: graphql
type: object
---

# App​Sale​Adjustment

object

A transaction corresponding to a refund, downgrade, or adjustment of an app charge.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  The app associated with the refund.

* charge​Id

  [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  The ID of the [app charge](https://shopify.dev/tutorials/bill-for-your-app-using-graphql-admin-api) associated with the transaction. Example value: `gid://shopify/AppUsageRecord/1234`. This value might be `null` for transactions that occurred before September 2020.

* created​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the transaction was recorded.

* gross​Amount

  [Money](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  The total amount that the merchant paid, excluding taxes.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  The transaction ID.

* net​Amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The net amount that is added to or deducted from your payout.

* shop

  [Shop](https://shopify.dev/docs/api/partner/2026-07/objects/Shop)

  The shop associated with the transaction.

* shopify​Fee

  [Money](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  The amount that Shopify retained from the adjustment.

***

## Map

No referencing types

***

## Interfaces

* * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

  * [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)

    interface

***

## AppSaleAdjustment Implements

### Implements

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
* [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)
