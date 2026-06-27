---
title: AppSubscription - Partner API
description: 'A recurring charge for use of an app, such as a monthly subscription charge.'
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription.md'
api_name: partner
api_type: graphql
type: object
---

# App​Subscription

object

A recurring charge for use of an app, such as a monthly subscription charge.

## Fields

* amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The amount of the app charge.

* billing​On

  [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  The date when the merchant will next be billed.

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

* [AppSubscriptionEvent.charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppSubscriptionEvent#fields-charge)
* [SubscriptionApproachingCappedAmount.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionApproachingCappedAmount#field-SubscriptionApproachingCappedAmount.fields.charge)
* [SubscriptionCappedAmountUpdated.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionCappedAmountUpdated#field-SubscriptionCappedAmountUpdated.fields.charge)
* [SubscriptionChargeAccepted.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeAccepted#field-SubscriptionChargeAccepted.fields.charge)
* [SubscriptionChargeActivated.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeActivated#field-SubscriptionChargeActivated.fields.charge)
* [SubscriptionChargeCanceled.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeCanceled#field-SubscriptionChargeCanceled.fields.charge)
* [SubscriptionChargeDeclined.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeDeclined#field-SubscriptionChargeDeclined.fields.charge)
* [SubscriptionChargeExpired.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeExpired#field-SubscriptionChargeExpired.fields.charge)
* [SubscriptionChargeFrozen.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeFrozen#field-SubscriptionChargeFrozen.fields.charge)
* [SubscriptionChargeUnfrozen.charge](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeUnfrozen#field-SubscriptionChargeUnfrozen.fields.charge)

***

## Interfaces

* * [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)

    interface

  * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

***

## AppSubscription Implements

### Implements

* [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)
* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
