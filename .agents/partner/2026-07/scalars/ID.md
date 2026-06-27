---
title: ID - Partner API
description: >-
  The `ID` scalar type represents a unique identifier, often used to refetch an
  object or as key for a cache. The ID type appears in a JSON response as a
  String; however, it is not intended to be human-readable. When expected as an
  input type, any string (such as `"4"`) or integer (such as `4`) input value
  will be accepted as an ID.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/scalars/ID'
  md: 'https://shopify.dev/docs/api/partner/2026-07/scalars/ID.md'
api_name: partner
api_type: graphql
type: scalar
---

# ID

scalar

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

## Map

### Fields with this scalar

* [Active​Subscription.legacySubscriptionId](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.legacySubscriptionId)
* [App.id](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.id)
* [App​Credit.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit#field-AppCredit.fields.id)
* [App​One​Time​Sale.chargeId](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.chargeId)
* [App​One​Time​Sale.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.id)
* [App​Purchase​One​Time.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppPurchaseOneTime#field-AppPurchaseOneTime.fields.id)
* [App​Reference.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppReference#field-AppReference.fields.id)
* [App​Sale​Adjustment.chargeId](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.chargeId)
* [App​Sale​Adjustment.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.id)
* [App​Sale​Credit.chargeId](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.chargeId)
* [App​Sale​Credit.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.id)
* [App​Subscription.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription#field-AppSubscription.fields.id)
* [App​Subscription​Sale.chargeId](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.chargeId)
* [App​Subscription​Sale.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.id)
* [App​Usage​Record.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageRecord#field-AppUsageRecord.fields.id)
* [App​Usage​Sale.chargeId](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.chargeId)
* [App​Usage​Sale.id](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.id)
* [Cancelled​Subscription.legacySubscriptionId](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.legacySubscriptionId)
* [Charge.chargeId](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.chargeId)
* [Charge.id](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.id)
* [Credit.id](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.id)
* [Earning.chargeId](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.chargeId)
* [Earning.id](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.id)
* [Event​Metadata.legacyChargeId](https://shopify.dev/docs/api/partner/2026-07/objects/EventMetadata#field-EventMetadata.fields.legacyChargeId)
* [Legacy​Transaction.id](https://shopify.dev/docs/api/partner/2026-07/objects/LegacyTransaction#field-LegacyTransaction.fields.id)
* [Organization.id](https://shopify.dev/docs/api/partner/2026-07/objects/Organization#field-Organization.fields.id)
* [Pending​Update.legacySubscriptionId](https://shopify.dev/docs/api/partner/2026-07/objects/PendingUpdate#field-PendingUpdate.fields.legacySubscriptionId)
* [Referral​Adjustment.id](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralAdjustment#field-ReferralAdjustment.fields.id)
* [Referral​Transaction.id](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralTransaction#field-ReferralTransaction.fields.id)
* [Relationship.id](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.id)

### Inputs with this scalar

* [Event​Filter​Input.shopId](https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput#fields-shopId)
* [Event​Filter​Input.subjectId](https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput#fields-subjectId)

### Arguments with this scalar

* [App.events(chargeId)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.chargeId)
* [App.events(shopId)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.shopId)
* [Query​Root.activeSubscription(appId)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.activeSubscription.arguments.appId)
* [Query​Root.activeSubscription(shopId)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.activeSubscription.arguments.shopId)
* [Query​Root.app(id)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.app.arguments.id)
* [Query​Root.transaction(id)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transaction.arguments.id)
* [Query​Root.transactions(appId)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.appId)
* [Query​Root.transactions(shopId)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.shopId)
* [app​Credit​Create.appId](https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate#arguments-appId)
* [app​Credit​Create.shopId](https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate#arguments-shopId)
* [app​Subscription​Cancel.appId](https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel#arguments-appId)
* [app​Subscription​Cancel.shopId](https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel#arguments-shopId)
* [active​Subscription.appId](https://shopify.dev/docs/api/partner/2026-07/queries/activeSubscription#arguments-appId)
* [active​Subscription.shopId](https://shopify.dev/docs/api/partner/2026-07/queries/activeSubscription#arguments-shopId)
* [app.id](https://shopify.dev/docs/api/partner/2026-07/queries/app#arguments-id)
* [transaction.id](https://shopify.dev/docs/api/partner/2026-07/queries/transaction#arguments-id)
* [transactions.appId](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-appId)
* [transactions.shopId](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-shopId)
