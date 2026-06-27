---
title: AppEventTypes - Partner API
description: The type of app event.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/enums/AppEventTypes'
  md: 'https://shopify.dev/docs/api/partner/2026-07/enums/AppEventTypes.md'
api_name: partner
api_type: graphql
type: enum
---

# App​Event​Types

enum

The type of app event.

## Valid values

* CREDIT\_​APPLIED

  Credit applied

* CREDIT\_​FAILED

  Credit failed

* CREDIT\_​PENDING

  Credit pending

* ONE\_​TIME\_​CHARGE\_​ACCEPTED

  One time charge accepted

* ONE\_​TIME\_​CHARGE\_​ACTIVATED

  One time charge activated

* ONE\_​TIME\_​CHARGE\_​DECLINED

  One time charge declined

* ONE\_​TIME\_​CHARGE\_​EXPIRED

  One time charge expired

* RELATIONSHIP\_​DEACTIVATED

  Relationship deactivated

* RELATIONSHIP\_​INSTALLED

  Relationship installed

* RELATIONSHIP\_​REACTIVATED

  Relationship reactivated

* RELATIONSHIP\_​UNINSTALLED

  Relationship uninstalled

* SUBSCRIPTION\_​APPROACHING\_​CAPPED\_​AMOUNT

  Subscription is approaching capped amount.

* SUBSCRIPTION\_​CAPPED\_​AMOUNT\_​UPDATED

  Subscription capped amount was updated.

* SUBSCRIPTION\_​CHARGE\_​ACCEPTED

  Subscription charge accepted

* SUBSCRIPTION\_​CHARGE\_​ACTIVATED

  Subscription charge activated

* SUBSCRIPTION\_​CHARGE\_​CANCELED

  Subscription charge canceled

* SUBSCRIPTION\_​CHARGE\_​DECLINED

  Subscription charge declined

* SUBSCRIPTION\_​CHARGE\_​EXPIRED

  Subscription charge expired

* SUBSCRIPTION\_​CHARGE\_​FROZEN

  Subscription charge frozen

* SUBSCRIPTION\_​CHARGE\_​UNFROZEN

  Subscription charge unfrozen

* USAGE\_​CHARGE\_​APPLIED

  Usage charge applied

***

## Fields

* [App.events(types)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.types)

  ARGUMENT

  A Shopify [app](https://shopify.dev/concepts/apps).

* [App​Event.type](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppEvent#fields-type)

  INTERFACE

  An event related to a Shopify app.

* [Credit​Applied.type](https://shopify.dev/docs/api/partner/2026-07/objects/CreditApplied#field-CreditApplied.fields.type)

  OBJECT

  An event that marks that an app credit was applied.

* [Credit​Failed.type](https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed#field-CreditFailed.fields.type)

  OBJECT

  An event that marks that an app credit failed to apply.

* [Credit​Pending.type](https://shopify.dev/docs/api/partner/2026-07/objects/CreditPending#field-CreditPending.fields.type)

  OBJECT

  An event that marks that an app credit is pending.

* [One​Time​Charge​Accepted.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeAccepted#field-OneTimeChargeAccepted.fields.type)

  OBJECT

  An event that marks that a one-time app charge was accepted by the merchant.

* [One​Time​Charge​Activated.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeActivated#field-OneTimeChargeActivated.fields.type)

  OBJECT

  An event that marks that a one-time app charge was activated.

* [One​Time​Charge​Declined.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeDeclined#field-OneTimeChargeDeclined.fields.type)

  OBJECT

  An event that marks that a one-time app charge was declined by the merchant.

* [One​Time​Charge​Expired.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired#field-OneTimeChargeExpired.fields.type)

  OBJECT

  An event that marks that a one-time app charge expired before the merchant could accept it.

* [Relationship​Deactivated.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipDeactivated#field-RelationshipDeactivated.fields.type)

  OBJECT

  An event that marks that an app was deactivated.

* [Relationship​Installed.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipInstalled#field-RelationshipInstalled.fields.type)

  OBJECT

  An event that marks that an app was installed.

* [Relationship​Reactivated.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipReactivated#field-RelationshipReactivated.fields.type)

  OBJECT

  An event that marks that an app was reactivated.

* [Relationship​Uninstalled.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled#field-RelationshipUninstalled.fields.type)

  OBJECT

  An event that marks that an app was uninstalled.

* [Subscription​Approaching​Capped​Amount.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionApproachingCappedAmount#field-SubscriptionApproachingCappedAmount.fields.type)

  OBJECT

  An event that marks that a subscription is approaching its capped amount.

* [Subscription​Capped​Amount​Updated.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionCappedAmountUpdated#field-SubscriptionCappedAmountUpdated.fields.type)

  OBJECT

  An event that marks that a subscription had its capped amount updated.

* [Subscription​Charge​Accepted.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeAccepted#field-SubscriptionChargeAccepted.fields.type)

  OBJECT

  An event that marks that a recurring app charge was accepted.

* [Subscription​Charge​Activated.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeActivated#field-SubscriptionChargeActivated.fields.type)

  OBJECT

  An event that marks that a recurring app charge was activated.

* [Subscription​Charge​Canceled.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeCanceled#field-SubscriptionChargeCanceled.fields.type)

  OBJECT

  An event that marks that a recurring app charge was cancelled.

* [Subscription​Charge​Declined.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeDeclined#field-SubscriptionChargeDeclined.fields.type)

  OBJECT

  An event that marks that a recurring app charge was declined.

* [Subscription​Charge​Expired.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeExpired#field-SubscriptionChargeExpired.fields.type)

  OBJECT

  An event that marks that a recurring app charge has expired.

* [Subscription​Charge​Frozen.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeFrozen#field-SubscriptionChargeFrozen.fields.type)

  OBJECT

  An event that marks that a recurring app charge has been suspended. For example, if a merchant stops paying their bills, or closes their store, then Shopify suspends the recurring app charge.

* [Subscription​Charge​Unfrozen.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeUnfrozen#field-SubscriptionChargeUnfrozen.fields.type)

  OBJECT

  An event that marks that a recurring app charge was unfrozen.

* [Usage​Charge​Applied.type](https://shopify.dev/docs/api/partner/2026-07/objects/UsageChargeApplied#field-UsageChargeApplied.fields.type)

  OBJECT

  An event that marks that an app usage charge was applied.

***

## Map

### Fields with this enum

* [Credit​Applied.type](https://shopify.dev/docs/api/partner/2026-07/objects/CreditApplied#field-CreditApplied.fields.type)
* [Credit​Failed.type](https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed#field-CreditFailed.fields.type)
* [Credit​Pending.type](https://shopify.dev/docs/api/partner/2026-07/objects/CreditPending#field-CreditPending.fields.type)
* [One​Time​Charge​Accepted.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeAccepted#field-OneTimeChargeAccepted.fields.type)
* [One​Time​Charge​Activated.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeActivated#field-OneTimeChargeActivated.fields.type)
* [One​Time​Charge​Declined.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeDeclined#field-OneTimeChargeDeclined.fields.type)
* [One​Time​Charge​Expired.type](https://shopify.dev/docs/api/partner/2026-07/objects/OneTimeChargeExpired#field-OneTimeChargeExpired.fields.type)
* [Relationship​Deactivated.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipDeactivated#field-RelationshipDeactivated.fields.type)
* [Relationship​Installed.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipInstalled#field-RelationshipInstalled.fields.type)
* [Relationship​Reactivated.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipReactivated#field-RelationshipReactivated.fields.type)
* [Relationship​Uninstalled.type](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled#field-RelationshipUninstalled.fields.type)
* [Subscription​Approaching​Capped​Amount.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionApproachingCappedAmount#field-SubscriptionApproachingCappedAmount.fields.type)
* [Subscription​Capped​Amount​Updated.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionCappedAmountUpdated#field-SubscriptionCappedAmountUpdated.fields.type)
* [Subscription​Charge​Accepted.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeAccepted#field-SubscriptionChargeAccepted.fields.type)
* [Subscription​Charge​Activated.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeActivated#field-SubscriptionChargeActivated.fields.type)
* [Subscription​Charge​Canceled.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeCanceled#field-SubscriptionChargeCanceled.fields.type)
* [Subscription​Charge​Declined.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeDeclined#field-SubscriptionChargeDeclined.fields.type)
* [Subscription​Charge​Expired.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeExpired#field-SubscriptionChargeExpired.fields.type)
* [Subscription​Charge​Frozen.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeFrozen#field-SubscriptionChargeFrozen.fields.type)
* [Subscription​Charge​Unfrozen.type](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionChargeUnfrozen#field-SubscriptionChargeUnfrozen.fields.type)
* [Usage​Charge​Applied.type](https://shopify.dev/docs/api/partner/2026-07/objects/UsageChargeApplied#field-UsageChargeApplied.fields.type)

### Arguments with this enum

* [App.events(types)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.types)
