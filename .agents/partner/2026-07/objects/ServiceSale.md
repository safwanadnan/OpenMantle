---
title: ServiceSale - Partner API
description: A transaction corresponding to a paid invoice for a service.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSale'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSale.md'
api_name: partner
api_type: graphql
type: object
---

# Service​Sale

object

A transaction corresponding to a paid invoice for a service.

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

## ServiceSale Implements

### Implements

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
* [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)
