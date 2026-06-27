---
title: PartnerEventEdge - Partner API
description: An edge in a PartnerEvent connection.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/PartnerEventEdge'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/PartnerEventEdge.md'
api_name: partner
api_type: graphql
type: object
---

# Partner​Event​Edge

object

An edge in a PartnerEvent connection.

## Fields

* cursor

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  A cursor for use in pagination.

* node

  [Partner​Event!](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)

  non-null

  The item at the end of the edge.

***

## Map

### Connections with this object

* [PartnerEventConnection.edges](https://shopify.dev/docs/api/partner/2026-07/connections/PartnerEventConnection#returns-edges)
