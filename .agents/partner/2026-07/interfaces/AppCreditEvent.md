---
title: AppCreditEvent - Partner API
description: An event involving an app credit.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCreditEvent'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCreditEvent.md'
api_name: partner
api_type: graphql
type: interface
---

# App​Credit​Event

interface

An event involving an app credit.

## Fields

* app​Credit

  [App​Credit!](https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit)

  non-null

  A [credit](https://shopify.dev/docs/admin-api/rest/reference/billing/applicationcredit) issued to a merchant for an app. Merchants are entitled to app credits under certain circumstances, such as when a paid app subscription is downgraded partway through its billing cycle.

***

##### Variables

```json
{
	"appCredit": ""
}
```

##### Schema

```graphql
interface AppCreditEvent {
  appCredit: AppCredit!
}
```
