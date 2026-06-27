---
title: Credit - Partner API
description: A credit event.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Credit'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Credit.md'
api_name: partner
api_type: graphql
type: object
---

# Credit

object

A credit event.

## Fields

* description

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  Description of the credit.

* event​Type

  [Event​Type!](https://shopify.dev/docs/api/partner/2026-07/enums/EventType)

  non-null

  The type of event.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  Unique identifier for the event.

* money

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The credit amount.

* occurred​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the event occurred.

* shop

  [Shop​Reference](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference)

  The shop associated with the event.

* status

  [Credit​Status!](https://shopify.dev/docs/api/partner/2026-07/enums/CreditStatus)

  non-null

  The status of the credit.

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

## Credit Implements

### Implements

* [Partner​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)
