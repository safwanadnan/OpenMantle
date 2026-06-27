---
title: PageInfo - Partner API
description: Information about pagination in a connection.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/PageInfo'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/PageInfo.md'
api_name: partner
api_type: graphql
type: object
---

# Page​Info

object

Information about pagination in a connection.

## Fields

* has​Next​Page

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether there are more pages to fetch.

* has​Previous​Page

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether there are any pages prior to the current page.

***

## Map

### Connections with this object

* [AppEventConnection.pageInfo](https://shopify.dev/docs/api/partner/2026-07/connections/AppEventConnection#returns-pageInfo)
* [TransactionConnection.pageInfo](https://shopify.dev/docs/api/partner/2026-07/connections/TransactionConnection#returns-pageInfo)
