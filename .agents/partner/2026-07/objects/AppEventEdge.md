---
title: AppEventEdge - Partner API
description: An edge in a connection.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppEventEdge'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppEventEdge.md'
api_name: partner
api_type: graphql
type: object
---

# App​Event​Edge

object

An edge in a connection.

## Fields

* cursor

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  A cursor for use in pagination.

* node

  [App​Event!](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)

  non-null

  The item at the end of the edge.

***

## Map

### Connections with this object

* [AppEventConnection.edges](https://shopify.dev/docs/api/partner/2026-07/connections/AppEventConnection#returns-edges)
