---
title: AppOneTimeSale - Partner API
description: A transaction corresponding to a one-time app charge.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale.md'
api_name: partner
api_type: graphql
type: object
---

# App​One​Time​Sale

object

A transaction corresponding to a one-time app charge.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  The app associated with the sale.

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

  The amount that Shopify retained from the sale.

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

## AppOneTimeSale Implements

### Implements

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
* [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)
