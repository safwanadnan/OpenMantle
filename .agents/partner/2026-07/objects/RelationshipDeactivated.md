---
title: RelationshipDeactivated - Partner API
description: An event that marks that an app was deactivated.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipDeactivated'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipDeactivated.md
api_name: partner
api_type: graphql
type: object
---

# Relationship​Deactivated

object

An event that marks that an app was deactivated.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  A Shopify [app](https://shopify.dev/concepts/apps).

* occurred​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the event took place.

* shop

  [Shop!](https://shopify.dev/docs/api/partner/2026-07/objects/Shop)

  non-null

  A Shopify shop.

* type

  [App​Event​Types!](https://shopify.dev/docs/api/partner/2026-07/enums/AppEventTypes)

  non-null

  The type of app event.

***

## Map

No referencing types

***

## Interfaces

* [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)

  interface

***

## RelationshipDeactivated Implements

### Implements

* [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)
