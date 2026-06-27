---
title: EventType - Partner API
description: The type of historical event.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/enums/EventType'
  md: 'https://shopify.dev/docs/api/partner/2026-07/enums/EventType.md'
api_name: partner
api_type: graphql
type: enum
---

# Event​Type

enum

The type of historical event.

## Valid values

* CHARGE\_​ONE\_​TIME

  The event type is a one-time charge event.

* CHARGE\_​RECURRING

  The event type is a recurring charge event.

* CHARGE\_​USAGE

  The event type is a usage-based charge event.

* CREDIT\_​APPLIED

  The event type is a credit applied event.

* CREDIT\_​FAILED

  The event type is a credit failed event.

* CREDIT\_​PENDING

  The event type is a pending credit event.

* EARNING\_​ADJUSTMENT

  The event type is an adjustment earning event.

* EARNING\_​CHARGE\_​ONE\_​TIME

  The event type is a one-time earning event.

* EARNING\_​CHARGE\_​RECURRING

  The event type is a recurring earning event.

* EARNING\_​CHARGE\_​USAGE

  The event type is a usage-based earning event.

* EARNING\_​CREDIT

  The event type is a credit earning event.

* EARNING\_​REFUND

  The event type is a refund earning event.

* RELATIONSHIP\_​DEACTIVATED

  The event type is a relationship deactivated event.

* RELATIONSHIP\_​INSTALLED

  The event type is a relationship installed event.

* RELATIONSHIP\_​REACTIVATED

  The event type is a relationship reactivated event.

* RELATIONSHIP\_​UNINSTALLED

  The event type is a relationship uninstalled event.

* SUBSCRIPTION\_​CANCELED

  The event type is a subscription canceled event.

* SUBSCRIPTION\_​CANCELLATION\_​SCHEDULED

  The event type is a subscription cancellation scheduled event.

* SUBSCRIPTION\_​CREATED

  The event type is a subscription created event.

* SUBSCRIPTION\_​FROZEN

  The event type is a subscription frozen event.

* SUBSCRIPTION\_​UNFROZEN

  The event type is a subscription unfrozen event.

* SUBSCRIPTION\_​UPDATED

  The event type is a subscription updated event.

***

## Fields

* [Charge.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.eventType)

  OBJECT

  A charge event representing when a merchant was billed.

* [Credit.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.eventType)

  OBJECT

  A credit event.

* [Earning.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.eventType)

  OBJECT

  An earning event representing when a partner receives payment.

* [Event​Filter​Input.eventTypes](https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput#fields-eventTypes)

  INPUT OBJECT

  Filter criteria for historical events.

* [Partner​Event.eventType](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent#fields-eventType)

  INTERFACE

  A historical event for apps and themes.

* [Relationship.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.eventType)

  OBJECT

  A relationship event (install, uninstall, deactivate, reactivate).

* [Subscription​Status.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionStatus#field-SubscriptionStatus.fields.eventType)

  OBJECT

  A subscription status event.

***

## Map

### Fields with this enum

* [Charge.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.eventType)
* [Credit.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.eventType)
* [Earning.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.eventType)
* [Relationship.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.eventType)
* [Subscription​Status.eventType](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionStatus#field-SubscriptionStatus.fields.eventType)

### Inputs with this enum

* [Event​Filter​Input.eventTypes](https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput#fields-eventTypes)
