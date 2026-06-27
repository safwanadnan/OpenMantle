---
title: RelationshipUninstalled - Partner API
description: An event that marks that an app was uninstalled.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled.md
api_name: partner
api_type: graphql
type: object
---

# Relationship​Uninstalled

object

An event that marks that an app was uninstalled.

## Fields

* app

  [App!](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  non-null

  A Shopify [app](https://shopify.dev/concepts/apps).

* description

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  More details from the merchant about why they uninstalled the app.

* occurred​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the event took place.

* reason

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  A comma separated list of reasons why the merchant uninstalled the app.

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

## RelationshipUninstalled Implements

### Implements

* [App​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent)
