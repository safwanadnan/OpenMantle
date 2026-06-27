---
title: EventOrder - Partner API
description: Order direction for event results.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/enums/EventOrder'
  md: 'https://shopify.dev/docs/api/partner/2026-07/enums/EventOrder.md'
api_name: partner
api_type: graphql
type: enum
---

# Event​Order

enum

Order direction for event results.

## Valid values

* OCCURRED\_​AT\_​ASC

  Events ordered by occurred\_at ascending (oldest first).

* OCCURRED\_​AT\_​DESC

  Events ordered by occurred\_at descending (newest first).

***

## Fields

* [Query​Root.events(orderBy)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.events.arguments.orderBy)

  ARGUMENT

  The schema's entry-point for queries. This acts as the public, top-level API from which all queries must start.

* [events.orderBy](https://shopify.dev/docs/api/partner/2026-07/queries/events#arguments-orderBy)

  ARGUMENT

***

## Map

### Arguments with this enum

* [Query​Root.events(orderBy)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.events.arguments.orderBy)
* [events.orderBy](https://shopify.dev/docs/api/partner/2026-07/queries/events#arguments-orderBy)
