---
title: AppUsageRecord - Partner API
description: |-
  An app charge. This charge varies based on how much the merchant uses the app
  or a service that the app integrates with.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageRecord'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageRecord.md'
api_name: partner
api_type: graphql
type: object
---

# App​Usage​Record

object

An app charge. This charge varies based on how much the merchant uses the app or a service that the app integrates with.

## Fields

* amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The amount of the app charge.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  A globally unique identifier.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The name of the app charge.

* test

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether the app purchase was a test transaction.

***

## Map

### Fields with this object

* [AppUsageRecordEvent.charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppUsageRecordEvent#fields-charge)
* [UsageChargeApplied.charge](https://shopify.dev/docs/api/partner/2026-07/objects/UsageChargeApplied#field-UsageChargeApplied.fields.charge)

***

## Interfaces

* * [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)

    interface

  * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

***

## AppUsageRecord Implements

### Implements

* [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)
* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
