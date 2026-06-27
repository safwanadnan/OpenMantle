---
title: Shop - Partner API
description: A Shopify shop.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Shop'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Shop.md'
api_name: partner
api_type: graphql
type: object
---

# Shop

object

A Shopify shop.

## Fields

* avatar​Url

  [Url](https://shopify.dev/docs/api/partner/2026-07/scalars/Url)

  A URL referencing the avatar associated with the actor.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  A globally unique identifier for the actor. Example value: `gid://partners/Shop/1234`.

* myshopify​Domain

  [Url!](https://shopify.dev/docs/api/partner/2026-07/scalars/Url)

  non-null

  The shop's `.myshopify.com` domain name.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The name of the actor. This might be a Partner organization or shop name.

***

## Map

### Fields with this object

* [AppEvent.shop](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent#fields-shop)
* [AppOneTimeSale.shop](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.shop)
* [AppSaleAdjustment.shop](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.shop)
* [AppSaleCredit.shop](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.shop)
* [AppSubscriptionSale.shop](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.shop)
* [AppUsageSale.shop](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.shop)
* [CreditApplied.shop](https://shopify.dev/docs/api/partner/2026-07/objects/CreditApplied#field-CreditApplied.fields.shop)
* [CreditFailed.shop](https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed#field-CreditFailed.fields.shop)
* [CreditPending.shop](https://shopify.dev/docs/api/partner/2026-07/objects/CreditPending#field-CreditPending.fields.shop)
* [LegacyTransaction.shop](https://shopify.dev/docs/api/partner/2026-07/objects/LegacyTransaction#field-LegacyTransaction.fields.shop)
* [OneTimeChargeAccepted.shop](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeAccepted#field-OneTimeChargeAccepted.fields.shop)
* [OneTimeChargeActivated.shop](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeActivated#field-OneTimeChargeActivated.fields.shop)
* [OneTimeChargeDeclined.shop](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeDeclined#field-OneTimeChargeDeclined.fields.shop)
* [OneTimeChargeExpired.shop](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired#field-OneTimeChargeExpired.fields.shop)
* [ReferralAdjustment.shop](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralAdjustment#field-ReferralAdjustment.fields.shop)
* [ReferralTransaction.shop](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralTransaction#field-ReferralTransaction.fields.shop)
* [RelationshipDeactivated.shop](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipDeactivated#field-RelationshipDeactivated.fields.shop)
* [RelationshipInstalled.shop](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipInstalled#field-RelationshipInstalled.fields.shop)
* [RelationshipReactivated.shop](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipReactivated#field-RelationshipReactivated.fields.shop)
* [RelationshipUninstalled.shop](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled#field-RelationshipUninstalled.fields.shop)
* [ServiceSale.shop](https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSale#field-ServiceSale.fields.shop)
* [ServiceSaleAdjustment.shop](https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSaleAdjustment#field-ServiceSaleAdjustment.fields.shop)
* [SubscriptionApproachingCappedAmount.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionApproachingCappedAmount#field-SubscriptionApproachingCappedAmount.fields.shop)
* [SubscriptionCappedAmountUpdated.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionCappedAmountUpdated#field-SubscriptionCappedAmountUpdated.fields.shop)
* [SubscriptionChargeAccepted.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeAccepted#field-SubscriptionChargeAccepted.fields.shop)
* [SubscriptionChargeActivated.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeActivated#field-SubscriptionChargeActivated.fields.shop)
* [SubscriptionChargeCanceled.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeCanceled#field-SubscriptionChargeCanceled.fields.shop)
* [SubscriptionChargeDeclined.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeDeclined#field-SubscriptionChargeDeclined.fields.shop)
* [SubscriptionChargeExpired.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeExpired#field-SubscriptionChargeExpired.fields.shop)
* [SubscriptionChargeFrozen.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeFrozen#field-SubscriptionChargeFrozen.fields.shop)

***

## Interfaces

* * [Actor](https://shopify.dev/docs/api/partner/2026-07/interfaces/Actor)

    interface

  * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

***

## Shop Implements

### Implements

* [Actor](https://shopify.dev/docs/api/partner/2026-07/interfaces/Actor)
* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
