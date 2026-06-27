---
title: AppSubscriptionEvent - Partner API
description: >-
  An event related to an [app subscription
  charge](/docs/admin-api/rest/reference/billing/recurringapplicationcharge).
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppSubscriptionEvent'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/interfaces/AppSubscriptionEvent.md
api_name: partner
api_type: graphql
type: interface
---

# App​Subscription​Event

interface

An event related to an [app subscription charge](https://shopify.dev/docs/admin-api/rest/reference/billing/recurringapplicationcharge).

## Fields

* charge

  [App​Subscription!](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription)

  non-null

  A recurring charge for use of an app, such as a monthly subscription charge.

***

##### Variables

```json
{
	"charge": ""
}
```

##### Schema

```graphql
interface AppSubscriptionEvent {
  charge: AppSubscription!
}
```
