---
title: DateTime - Partner API
description: |-
  An [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) encoded UTC date time
  string. Example value: `"2019-07-03T20:47:55.123456Z"`.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime'
  md: 'https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime.md'
api_name: partner
api_type: graphql
type: scalar
---

# Date​Time

scalar

An [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) encoded UTC date time string. Example value: `"2019-07-03T20:47:55.123456Z"`.

## Map

### Fields with this scalar

* [Active​Subscription.trialEndsAt](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.trialEndsAt)
* [App​One​Time​Sale.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.createdAt)
* [App​Sale​Adjustment.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.createdAt)
* [App​Sale​Credit.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.createdAt)
* [App​Subscription.billingOn](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription#field-AppSubscription.fields.billingOn)
* [App​Subscription​Sale.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.createdAt)
* [App​Usage​Sale.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.createdAt)
* [Billing​Cycle.endTime](https://shopify.dev/docs/api/partner/2026-07/objects/BillingCycle#field-BillingCycle.fields.endTime)
* [Billing​Cycle.startTime](https://shopify.dev/docs/api/partner/2026-07/objects/BillingCycle#field-BillingCycle.fields.startTime)
* [Cancelled​Subscription.cancelledAt](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.cancelledAt)
* [Cancelled​Subscription.trialEndsAt](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.trialEndsAt)
* [Charge.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.occurredAt)
* [Credit.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.occurredAt)
* [Credit​Applied.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/CreditApplied#field-CreditApplied.fields.occurredAt)
* [Credit​Failed.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed#field-CreditFailed.fields.occurredAt)
* [Credit​Pending.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/CreditPending#field-CreditPending.fields.occurredAt)
* [Earning.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.occurredAt)
* [Legacy​Transaction.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/LegacyTransaction#field-LegacyTransaction.fields.createdAt)
* [One​Time​Charge​Accepted.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeAccepted#field-OneTimeChargeAccepted.fields.occurredAt)
* [One​Time​Charge​Activated.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeActivated#field-OneTimeChargeActivated.fields.occurredAt)
* [One​Time​Charge​Declined.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeDeclined#field-OneTimeChargeDeclined.fields.occurredAt)
* [One​Time​Charge​Expired.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired#field-OneTimeChargeExpired.fields.occurredAt)
* [Referral​Adjustment.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralAdjustment#field-ReferralAdjustment.fields.createdAt)
* [Referral​Transaction.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralTransaction#field-ReferralTransaction.fields.createdAt)
* [Relationship.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.occurredAt)
* [Relationship​Deactivated.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipDeactivated#field-RelationshipDeactivated.fields.occurredAt)
* [Relationship​Installed.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipInstalled#field-RelationshipInstalled.fields.occurredAt)
* [Relationship​Reactivated.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipReactivated#field-RelationshipReactivated.fields.occurredAt)
* [Relationship​Uninstalled.occurredAt](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled#field-RelationshipUninstalled.fields.occurredAt)
* [Service​Sale.createdAt](https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSale#field-ServiceSale.fields.createdAt)

### Inputs with this scalar

* [Event​Filter​Input.occurredAtMax](https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput#fields-occurredAtMax)
* [Event​Filter​Input.occurredAtMin](https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput#fields-occurredAtMin)

### Arguments with this scalar

* [App.events(occurredAtMax)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.occurredAtMax)
* [App.events(occurredAtMin)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.occurredAtMin)
* [Query​Root.transactions(createdAtMax)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.createdAtMax)
* [Query​Root.transactions(createdAtMin)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.createdAtMin)
* [transactions.createdAtMax](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-createdAtMax)
* [transactions.createdAtMin](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-createdAtMin)
