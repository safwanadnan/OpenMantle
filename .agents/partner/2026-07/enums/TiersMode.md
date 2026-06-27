---
title: TiersMode - Partner API
description: The pricing model for tiered pricing.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/enums/TiersMode'
  md: 'https://shopify.dev/docs/api/partner/2026-07/enums/TiersMode.md'
api_name: partner
api_type: graphql
type: enum
---

# Tiers​Mode

enum

The pricing model for tiered pricing.

## Valid values

* GRADUATED

  Units are priced at the rate of each tier they pass through.

* VOLUME

  All units are priced at the rate of the tier they fall into.

***

## Fields

* [Tiered​Plan​Price.tiersMode](https://shopify.dev/docs/api/partner/2026-07/objects/TieredPlanPrice#field-TieredPlanPrice.fields.tiersMode)

  OBJECT

  Tiered price information for a subscription plan.

* [Tiered​Price.tiersMode](https://shopify.dev/docs/api/partner/2026-07/objects/TieredPrice#field-TieredPrice.fields.tiersMode)

  OBJECT

  Tiered price information for a subscription item.

***

## Map

### Fields with this enum

* [Tiered​Plan​Price.tiersMode](https://shopify.dev/docs/api/partner/2026-07/objects/TieredPlanPrice#field-TieredPlanPrice.fields.tiersMode)
* [Tiered​Price.tiersMode](https://shopify.dev/docs/api/partner/2026-07/objects/TieredPrice#field-TieredPrice.fields.tiersMode)
