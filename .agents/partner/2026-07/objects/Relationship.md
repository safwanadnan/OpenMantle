---
title: Relationship - Partner API
description: 'A relationship event (install, uninstall, deactivate, reactivate).'
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Relationship'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Relationship.md'
api_name: partner
api_type: graphql
type: object
---

# Relationship

object

A relationship event (install, uninstall, deactivate, reactivate).

## Fields

* event​Type

  [Event​Type!](https://shopify.dev/docs/api/partner/2026-07/enums/EventType)

  non-null

  The type of event.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  Unique identifier for the event.

* occurred​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the event occurred.

* reason

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Reason for any non-installed state.

* reason​Description

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Description of the reason for any non-installed state.

* shop

  [Shop​Reference](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference)

  The shop associated with the event.

* state

  [Relationship​State!](https://shopify.dev/docs/api/partner/2026-07/enums/RelationshipState)

  non-null

  The state of the relationship.

* subject

  [Subject](https://shopify.dev/docs/api/partner/2026-07/unions/Subject)

  The subject of the event (App or Theme).

***

## Map

No referencing types

***

## Interfaces

* [Partner​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)

  interface

***

## Relationship Implements

### Implements

* [Partner​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)
