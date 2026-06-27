---
title: transaction - Partner API
description: A Shopify Partner transaction.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/queries/transaction'
  md: 'https://shopify.dev/docs/api/partner/2026-07/queries/transaction.md'
api_name: partner
api_type: graphql
type: query
---

# transaction

query

A Shopify Partner transaction.

## Arguments

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  required

  The transaction ID. Example value: `gid://partners/ThemeSale/1234`.

***

## Possible returns

* Transaction

  [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)

  A Shopify Partner transaction.

  * created​At

    [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

    non-null

    The date and time when the transaction was recorded.

  * id

    [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    non-null

    The transaction ID.

***

## Examples

* ### transaction reference
