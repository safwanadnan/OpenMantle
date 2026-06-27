---
title: AppCharge - Partner API
description: >-
  A [charge](/docs/admin-api/rest/reference/billing/applicationcharge) created
  through an app.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge.md'
api_name: partner
api_type: graphql
type: interface
---

# App​Charge

interface

A [charge](https://shopify.dev/docs/admin-api/rest/reference/billing/applicationcharge) created through an app.

## Fields

* amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The amount of the app charge.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  A globally unique identifier.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The name of the app charge.

* test

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether the app purchase was a test transaction.

***

##### Variables

```json
{
	"amount": "",
	"id": "",
	"name": "",
	"test": ""
}
```

##### Schema

```graphql
interface AppCharge {
  amount: Money!
  id: ID!
  name: String!
  test: Boolean!
}
```
