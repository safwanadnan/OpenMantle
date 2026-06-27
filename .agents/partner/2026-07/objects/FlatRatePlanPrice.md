---
title: FlatRatePlanPrice - Partner API
description: Flat-rate price information for a subscription plan.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/FlatRatePlanPrice'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/FlatRatePlanPrice.md'
api_name: partner
api_type: graphql
type: object
---

# Flat​Rate​Plan​Price

object

Flat-rate price information for a subscription plan.

## Fields

* amount

  [Decimal!](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  non-null

  The flat rate amount for recurring charges.

* currency​Code

  [Currency!](https://shopify.dev/docs/api/partner/2026-07/enums/Currency)

  non-null

  The price currency code.

***

## Map

No referencing types

***

## Interfaces

* [Plan​Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/PlanPrice)

  interface

***

## FlatRatePlanPrice Implements

### Implements

* [Plan​Price](https://shopify.dev/docs/api/partner/2026-07/interfaces/PlanPrice)
