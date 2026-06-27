---
title: AppEvent - Partner API
description: An event related to a Shopify app.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent.md'
api_name: partner
api_type: graphql
type: interface
---

# App​Event

interface

An event related to a Shopify app.

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

##### Variables

```json
{
	"app": "",
	"occurredAt": "",
	"shop": "",
	"type": ""
}
```

##### Schema

```graphql
interface AppEvent {
  app: App!
  occurredAt: DateTime!
  shop: Shop!
  type: AppEventTypes!
}
```
