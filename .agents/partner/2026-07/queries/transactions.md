---
title: transactions - Partner API
description: >-
  A list of the Partner organization's
  [transactions](https://help.shopify.com/partners/getting-started/getting-paid).
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/queries/transactions'
  md: 'https://shopify.dev/docs/api/partner/2026-07/queries/transactions.md'
api_name: partner
api_type: graphql
type: query
---

# transactions

query

A list of the Partner organization's [transactions](https://help.shopify.com/partners/getting-started/getting-paid).

## TransactionConnection arguments

[TransactionConnection!](https://shopify.dev/docs/api/partner/2026-07/connections/TransactionConnection)

* after

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Returns the elements in the list that come after the specified cursor.

* app​Id

  [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  Returns transactions associated with the specified app ID.

* before

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Returns the elements in the list that come before the specified cursor.

* created​At​Max

  [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  Returns transactions that were created on or before the specified date and time.

* created​At​Min

  [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  Returns transactions that were created on or after the specified date and time.

* first

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  Returns the first *n* elements from the list.

* last

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  Returns the last *n* elements from the list.

* myshopify​Domain

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Returns transactions associated with the specified `.myshopify.com` shop domain. Example value: `example.myshopify.com`.

* shop​Id

  [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  Returns transactions associated with the specified shop ID.

* types

  [\[Transaction​Type!\]](https://shopify.dev/docs/api/partner/2026-07/enums/TransactionType)

  Returns transactions of the specified types.

***

## Possible returns

* edges

  [\[Transaction​Edge!\]!](https://shopify.dev/docs/api/partner/2026-07/objects/TransactionEdge)

  non-null

  A list of edges.

* page​Info

  [Page​Info!](https://shopify.dev/docs/api/partner/2026-07/objects/PageInfo)

  non-null

  Information about pagination in a connection.

***

## Examples

* ### transactions reference
