---
title: HistoricalEventsPageInfo - Partner API
description: Information about pagination in a historical events connection.
api_version: 2026-07
source_url:
  html: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/HistoricalEventsPageInfo
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/HistoricalEventsPageInfo.md
api_name: partner
api_type: graphql
type: object
---

# Historical​Events​Page​Info

object

Information about pagination in a historical events connection.

## Fields

* end​Cursor

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  The cursor of the last edge in the connection.

* has​Next​Page

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether there are more pages to fetch.

* has​Previous​Page

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether there are any pages prior to the current page.

* start​Cursor

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  The cursor of the first edge in the connection.

***

## Map

### Connections with this object

* [PartnerEventConnection.pageInfo](https://shopify.dev/docs/api/partner/2026-07/connections/PartnerEventConnection#returns-pageInfo)
