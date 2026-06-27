---
title: App - Partner API
description: 'A Shopify [app](/concepts/apps).'
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/App'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/App.md'
api_name: partner
api_type: graphql
type: object
---

# App

object

A Shopify [app](https://shopify.dev/concepts/apps).

## Fields

* api​Key

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  A unique application API identifier.

* events

  [App​Event​Connection!](https://shopify.dev/docs/api/partner/2026-07/connections/AppEventConnection)

  non-null

  A list of app events.

  * after

    [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

    ### Arguments

    Returns the elements in the list that come after the specified cursor.

  * before

    [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

    Returns the elements in the list that come before the specified cursor.

  * charge​Id

    [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    Returns app events associated with the specified [app charge](https://shopify.dev/tutorials/bill-for-your-app-using-graphql-admin-api). Example value: `gid://shopify/AppUsageRecord/1234`.

  * first

    [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

    Returns the first *n* elements from the list.

  * last

    [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

    Returns the last *n* elements from the list.

  * occurred​At​Max

    [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

    Returns app events that occurred on or before the specified date and time.

  * occurred​At​Min

    [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

    Returns app events that occurred on or after the specified date and time.

  * shop​Id

    [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    Returns app events associated with the specified shop ID. Example value: `gid://partners/Shop/1234`.

  * types

    [\[App​Event​Types!\]](https://shopify.dev/docs/api/partner/2026-07/enums/AppEventTypes)

    Returns app events of the specified types.

  ***

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  The ID of the app. Example value: `gid://partners/App/1234`.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The name of the app.

***

## Map

### Fields with this object

* [AppEvent.app](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent#fields-app)
* [AppOneTimeSale.app](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.app)
* [AppSaleAdjustment.app](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.app)
* [AppSaleCredit.app](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.app)
* [AppSubscriptionSale.app](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.app)
* [AppUsageSale.app](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.app)
* [CreditApplied.app](https://shopify.dev/docs/api/partner/2026-07/objects/CreditApplied#field-CreditApplied.fields.app)
* [CreditFailed.app](https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed#field-CreditFailed.fields.app)
* [CreditPending.app](https://shopify.dev/docs/api/partner/2026-07/objects/CreditPending#field-CreditPending.fields.app)
* [OneTimeChargeAccepted.app](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeAccepted#field-OneTimeChargeAccepted.fields.app)
* [OneTimeChargeActivated.app](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeActivated#field-OneTimeChargeActivated.fields.app)
* [OneTimeChargeDeclined.app](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeDeclined#field-OneTimeChargeDeclined.fields.app)
* [OneTimeChargeExpired.app](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired#field-OneTimeChargeExpired.fields.app)
* [RelationshipDeactivated.app](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipDeactivated#field-RelationshipDeactivated.fields.app)
* [RelationshipInstalled.app](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipInstalled#field-RelationshipInstalled.fields.app)
* [RelationshipReactivated.app](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipReactivated#field-RelationshipReactivated.fields.app)
* [RelationshipUninstalled.app](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled#field-RelationshipUninstalled.fields.app)
* [SubscriptionApproachingCappedAmount.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionApproachingCappedAmount#field-SubscriptionApproachingCappedAmount.fields.app)
* [SubscriptionCappedAmountUpdated.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionCappedAmountUpdated#field-SubscriptionCappedAmountUpdated.fields.app)
* [SubscriptionChargeAccepted.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeAccepted#field-SubscriptionChargeAccepted.fields.app)
* [SubscriptionChargeActivated.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeActivated#field-SubscriptionChargeActivated.fields.app)
* [SubscriptionChargeCanceled.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeCanceled#field-SubscriptionChargeCanceled.fields.app)
* [SubscriptionChargeDeclined.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeDeclined#field-SubscriptionChargeDeclined.fields.app)
* [SubscriptionChargeExpired.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeExpired#field-SubscriptionChargeExpired.fields.app)
* [SubscriptionChargeFrozen.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeFrozen#field-SubscriptionChargeFrozen.fields.app)
* [SubscriptionChargeUnfrozen.app](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeUnfrozen#field-SubscriptionChargeUnfrozen.fields.app)
* [UsageChargeApplied.app](https://shopify.dev/docs/api/partner/2026-07/objects/UsageChargeApplied#field-UsageChargeApplied.fields.app)

***

## Queries

* [app](https://shopify.dev/docs/api/partner/2026-07/queries/app)

  query

  A Shopify [app](https://shopify.dev/concepts/apps).

  * id

    [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    required

    ### Arguments

    The app ID. Example value: `gid://partners/App/1234`.

  ***

***

## App Queries

### Queried by

* [app](https://shopify.dev/docs/api/partner/2026-07/queries/app)

***

## Interfaces

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

  interface

***

## App Implements

### Implements

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
