---
title: AppPurchaseOneTimeEvent - Partner API
description: An app event for a one-time app charge.
api_version: 2026-07
source_url:
  html: >-
    https://shopify.dev/docs/api/partner/2026-07/interfaces/AppPurchaseOneTimeEvent
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/interfaces/AppPurchaseOneTimeEvent.md
api_name: partner
api_type: graphql
type: interface
---

# App​Purchase​One​Time​Event

interface

An app event for a one-time app charge.

## Fields

* charge

  [App​Purchase​One​Time!](https://shopify.dev/docs/api/partner/2026-07/objects/AppPurchaseOneTime)

  non-null

  A one-time app charge for services and features purchased once by a store. For example, a one-time migration of a merchant's data from one platform to another.

***

##### Variables

```json
{
	"charge": ""
}
```

##### Schema

```graphql
interface AppPurchaseOneTimeEvent {
  charge: AppPurchaseOneTime!
}
```
