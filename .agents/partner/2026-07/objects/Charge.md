---
title: Charge - Partner API
description: A charge event representing when a merchant was billed.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Charge'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Charge.md'
api_name: partner
api_type: graphql
type: object
---

# Charge

object

A charge event representing when a merchant was billed.

## Fields

* amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The amount the merchant was charged.

* balance​Used

  [Decimal](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  The balance used for capped amount charges (legacy charges only).

* capped​Amount

  [Decimal](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  The capped amount limit for usage-based charges (legacy charges only).

* charge​Id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  Stable identifier for this charge.

* charge​Type

  [Charge​Type!](https://shopify.dev/docs/api/partner/2026-07/enums/ChargeType)

  non-null

  The type of charge.

* description

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Description of the charge.

* event​Type

  [Event​Type!](https://shopify.dev/docs/api/partner/2026-07/enums/EventType)

  non-null

  The type of event.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  Unique identifier for the event.

* metadata

  [Event​Metadata](https://shopify.dev/docs/api/partner/2026-07/objects/EventMetadata)

  Additional metadata for backfilled charges.

* occurred​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the event occurred.

* plan​Handle

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  The plan handle associated with this charge.

* shop

  [Shop​Reference](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference)

  The shop associated with the event.

* subject

  [Subject](https://shopify.dev/docs/api/partner/2026-07/unions/Subject)

  The subject of the event (App or Theme).

* usage​Quantity

  [Decimal](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  Quantity for usage charges.

***

## Map

No referencing types

***

## Interfaces

* [Partner​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)

  interface

***

## Charge Implements

### Implements

* [Partner​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)
