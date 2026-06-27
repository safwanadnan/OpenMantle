---
title: AppUsageRecordEvent - Partner API
description: An app event for an app usage charge.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppUsageRecordEvent'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/interfaces/AppUsageRecordEvent.md
api_name: partner
api_type: graphql
type: interface
---

# App​Usage​Record​Event

interface

An app event for an app usage charge.

## Fields

* charge

  [App​Usage​Record!](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageRecord)

  non-null

  An app charge. This charge varies based on how much the merchant uses the app or a service that the app integrates with.

***

##### Variables

```json
{
	"charge": ""
}
```

##### Schema

```graphql
interface AppUsageRecordEvent {
  charge: AppUsageRecord!
}
```
