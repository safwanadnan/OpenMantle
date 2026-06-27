---
title: FlatRatePrice - Partner API
description: Flat-rate price information for a subscription item.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/FlatRatePrice'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/FlatRatePrice.md'
api_name: partner
api_type: graphql
type: object
---

# Flat​Rate​Price

object

Flat-rate price information for a subscription item.

## Fields

* active

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether this price is currently active. False if the product has been updated to a different price.

* amount

  [Decimal!](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  non-null

  The flat rate amount for recurring charges.

* currency

  [Currency!](https://shopify.dev/docs/api/partner/2026-07/enums/Currency)

  non-null

  The price currency code.

***

## Map

No referencing types

***

## Interfaces

* [Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/Price)

  interface

***

## FlatRatePrice Implements

### Implements

* [Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/Price)
