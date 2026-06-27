---
title: ServiceSaleAdjustment - Partner API
description: >-
  A transaction corresponding to a refund, downgrade, or adjustment of a service
  sale.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSaleAdjustment'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSaleAdjustment.md
api_name: partner
api_type: graphql
type: object
---

# Service​Sale​Adjustment

object

A transaction corresponding to a refund, downgrade, or adjustment of a service sale.

## Fields

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

## ServiceSaleAdjustment Implements

### Implements

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
* [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)
