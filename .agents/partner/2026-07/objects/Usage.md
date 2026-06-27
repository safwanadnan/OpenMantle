---
title: Usage - Partner API
description: Usage information for the current billing cycle.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Usage'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Usage.md'
api_name: partner
api_type: graphql
type: object
---

# Usage

object

Usage information for the current billing cycle.

## Fields

* cost

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The calculated cost of the current billing cycle.

* quantity

  [Float!](https://shopify.dev/docs/api/partner/2026-07/scalars/Float)

  non-null

  The quantity of usage for the current billing cycle.

***

## Map

### Fields with this object

* [SubscriptionItem.usage](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem#field-SubscriptionItem.fields.usage)
