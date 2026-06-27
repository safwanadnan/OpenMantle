---
title: PriceTier - Partner API
description: Represents a pricing tier for usage-based pricing.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/PriceTier'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/PriceTier.md'
api_name: partner
api_type: graphql
type: object
---

# Price​Tier

object

Represents a pricing tier for usage-based pricing.

## Fields

* amount

  [Decimal!](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  non-null

  The flat amount for this tier.

* amount​Per​Unit

  [Decimal!](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  non-null

  The price per unit in this tier.

* up​To

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  Upper bound for this tier. Null for the final tier with no upper limit.

***

## Map

### Fields with this object

* [TieredPlanPrice.tiers](https://shopify.dev/docs/api/partner/2026-07/objects/TieredPlanPrice#field-TieredPlanPrice.fields.tiers)
* [TieredPrice.tiers](https://shopify.dev/docs/api/partner/2026-07/objects/TieredPrice#field-TieredPrice.fields.tiers)
