---
title: SubscriptionStatus - Partner API
description: A subscription status event.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionStatus'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionStatus.md'
api_name: partner
api_type: graphql
type: object
---

# Subscription​Status

object

A subscription status event.

## Fields

* cancel​Effective​On

  [Date](https://shopify.dev/docs/api/partner/2026-07/scalars/Date)

  Date when the subscription will actually end, if cancelled.

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

* plan

  [Plan](https://shopify.dev/docs/api/partner/2026-07/objects/Plan)

  The subscription plan details.

* shop

  [Shop​Reference](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference)

  The shop associated with the event.

* state

  [Subscription​Status​State!](https://shopify.dev/docs/api/partner/2026-07/enums/SubscriptionStatusState)

  non-null

  The state of the subscription.

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

## SubscriptionStatus Implements

### Implements

* [Partner​Event](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent)
