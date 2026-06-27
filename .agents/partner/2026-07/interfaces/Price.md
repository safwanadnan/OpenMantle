---
title: Price - Partner API
description: >-
  Pricing information for a subscription item, supporting both recurring
  flat-rate and tiered pricing.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/Price'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/Price.md'
api_name: partner
api_type: graphql
type: interface
---

# Price

interface

Pricing information for a subscription item, supporting both recurring flat-rate and tiered pricing.

## Fields

* active

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether this price is currently active. False if the product has been updated to a different price.

* currency

  [Currency!](https://shopify.dev/docs/api/partner/2026-07/enums/Currency)

  non-null

  The price currency code.

***

##### Variables

```json
{
	"active": "",
	"currency": ""
}
```

##### Schema

```graphql
interface Price {
  active: Boolean!
  currency: Currency!
}
```
