---
title: AppPurchaseOneTime - Partner API
description: >-
  A one-time app charge for services and features purchased once by a store.

  For example, a one-time migration of a merchant's data from one platform to
  another.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppPurchaseOneTime'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppPurchaseOneTime.md'
api_name: partner
api_type: graphql
type: object
---

# App​Purchase​One​Time

object

A one-time app charge for services and features purchased once by a store. For example, a one-time migration of a merchant's data from one platform to another.

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

* [AppPurchaseOneTimeEvent.charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppPurchaseOneTimeEvent#fields-charge)
* [OneTimeChargeAccepted.charge](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeAccepted#field-OneTimeChargeAccepted.fields.charge)
* [OneTimeChargeActivated.charge](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeActivated#field-OneTimeChargeActivated.fields.charge)
* [OneTimeChargeDeclined.charge](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeDeclined#field-OneTimeChargeDeclined.fields.charge)
* [OneTimeChargeExpired.charge](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired#field-OneTimeChargeExpired.fields.charge)

***

## Interfaces

* * [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)

    interface

  * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

***

## AppPurchaseOneTime Implements

### Implements

* [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)
* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
