---
title: TieredPlanPrice - Partner API
description: Tiered price information for a subscription plan.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/TieredPlanPrice'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/TieredPlanPrice.md'
api_name: partner
api_type: graphql
type: object
---

# Tiered​Plan​Price

object

Tiered price information for a subscription plan.

## Fields

* currency​Code

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

* [Plan​Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/PlanPrice)

  interface

***

## TieredPlanPrice Implements

### Implements

* [Plan​Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/PlanPrice)
