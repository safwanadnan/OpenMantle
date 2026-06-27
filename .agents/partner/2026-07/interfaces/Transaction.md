---
title: Transaction - Partner API
description: A Shopify Partner transaction.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction.md'
api_name: partner
api_type: graphql
type: interface
---

# Transaction

interface

A Shopify Partner transaction.

## Fields

* created​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the transaction was recorded.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  The transaction ID.

***

##### Variables

```json
{
	"createdAt": "",
	"id": ""
}
```

##### Schema

```graphql
interface Transaction {
  createdAt: DateTime!
  id: ID!
}
```
