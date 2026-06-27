---
title: TieredPrice - Partner API
description: Tiered price information for a subscription item.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/TieredPrice'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/TieredPrice.md'
api_name: partner
api_type: graphql
type: object
---

# Tiered​Price

object

Tiered price information for a subscription item.

## Fields

* active

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether this price is currently active. False if the product has been updated to a different price.

* currency

  [Currency!](https://shopify.dev/docs/api/partner/2026-07/enums/Currency)

  non-null

  The price currency code.

* tiers

  [\[Price​Tier!\]!](https://shopify.dev/docs/api/partner/2026-07/objects/PriceTier)

  non-null

  Array of pricing tiers for tiered pricing models.

* tiers​Mode

  [Tiers​Mode!](https://shopify.dev/docs/api/partner/2026-07/enums/TiersMode)

  non-null

  The tier pricing model.

***

## Map

No referencing types

***

## Interfaces

* [Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/Price)

  interface

***

## TieredPrice Implements

### Implements

* [Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/Price)
