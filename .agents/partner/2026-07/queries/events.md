---
title: events - Partner API
description: A timeline of historical events for the authenticated partner.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/queries/events'
  md: 'https://shopify.dev/docs/api/partner/2026-07/queries/events.md'
api_name: partner
api_type: graphql
type: query
---

# events

query

A timeline of historical events for the authenticated partner.

## PartnerEventConnection arguments

[PartnerEventConnection](https://shopify.dev/docs/api/partner/2026-07/connections/PartnerEventConnection)

* after

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Returns the elements in the list that come after the specified cursor.

* before

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Returns the elements in the list that come before the specified cursor.

* filter

  [Event​Filter​Input](https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput)

  Filter criteria for historical events.

* first

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  Returns the first *n* elements from the list.

* last

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  Returns the last *n* elements from the list.

* order​By

  [Event​Order](https://shopify.dev/docs/api/partner/2026-07/enums/EventOrder)

  Default:OCCURRED\_AT\_DESC

  The order in which to return events.

***

## Possible returns

* edges

  [\[Partner​Event​Edge!\]!](https://shopify.dev/docs/api/partner/2026-07/objects/PartnerEventEdge)

  non-null

  A list of edges.

* page​Info

  [Historical​Events​Page​Info!](https://shopify.dev/docs/api/partner/2026-07/objects/HistoricalEventsPageInfo)

  non-null

  Information about pagination in this connection.

***

## Examples

* ### events reference
