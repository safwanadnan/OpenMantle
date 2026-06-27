---
title: PartnerEvent - Partner API
description: A historical event for apps and themes.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent.md'
api_name: partner
api_type: graphql
type: interface
---

# Partner​Event

interface

A historical event for apps and themes.

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

* shop

  [Shop​Reference](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference)

  The shop associated with the event.

* subject

  [Subject](https://shopify.dev/docs/api/partner/2026-07/unions/Subject)

  The subject of the event (App or Theme).

***

##### Variables

```json
{
	"eventType": "",
	"id": "",
	"occurredAt": "",
	"shop": "",
	"subject": ""
}
```

##### Schema

```graphql
interface PartnerEvent {
  eventType: EventType!
  id: ID!
  occurredAt: DateTime!
  shop: ShopReference
  subject: Subject
}
```
