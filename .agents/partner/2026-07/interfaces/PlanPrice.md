---
title: PlanPrice - Partner API
description: Pricing information for a subscription plan.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/PlanPrice'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/PlanPrice.md'
api_name: partner
api_type: graphql
type: interface
---

# Plan​Price

interface

Pricing information for a subscription plan.

## Fields

* currency​Code

  [Currency!](https://shopify.dev/docs/api/partner/2026-07/enums/Currency)

  non-null

  The price currency code.

***

##### Variables

```json
{
	"currencyCode": ""
}
```

##### Schema

```graphql
interface PlanPrice {
  currencyCode: Currency!
}
```
