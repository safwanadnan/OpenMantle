---
title: Earning - Partner API
description: An earning event representing when a partner receives payment.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Earning'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Earning.md'
api_name: partner
api_type: graphql
type: object
---

# Earning

object

An earning event representing when a partner receives payment.

## Fields

* charge​Id

  [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  References the charge ID from the related charge event.

* description

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Description of the earning.

* earning​Type

  [Earning​Type!](https://shopify.dev/docs/api/partner/2026-07/enums/EarningType)

  non-null

  The type of earning.

* event​Type

  [Event​Type!](https://shopify.dev/docs/api/partner/2026-07/enums/EventType)

  non-null

  The type of event.

* gross​Amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The amount the merchant was charged.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  Unique identifier for the event.

* metadata

  [Event​Metadata](https://shopify.dev/docs/api/partner/2026-07/objects/EventMetadata)

  Additional metadata for backfilled earnings.

* net​Amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The amount the partner receives after commission.

* occurred​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the event occurred.

* settlement​Date

  [Date](https://shopify.dev/docs/api/partner/2026-07/scalars/Date)

  The date when the earning was settled.

* shop

  [Shop​Reference](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference)

  The shop associated with the event.

* shopify​Fee

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  Shopify's commission.

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

## Earning Implements

### Implements

* [Partner​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)
