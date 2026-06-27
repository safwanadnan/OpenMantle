---
title: Subject - Partner API
description: Represents the subject of an event (App or Theme).
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/unions/Subject'
  md: 'https://shopify.dev/docs/api/partner/2026-07/unions/Subject.md'
api_name: partner
api_type: graphql
type: union
---

# Subject

union

Represents the subject of an event (App or Theme).

## Fields with this union

* [Charge.subject](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.subject)

  OBJECT

  A charge event representing when a merchant was billed.

* [Credit.subject](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.subject)

  OBJECT

  A credit event.

* [Earning.subject](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.subject)

  OBJECT

  An earning event representing when a partner receives payment.

* [Partner​Event.subject](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent#fields-subject)

  INTERFACE

  A historical event for apps and themes.

* [Relationship.subject](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.subject)

  OBJECT

  A relationship event (install, uninstall, deactivate, reactivate).

* [Subscription​Status.subject](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionStatus#field-SubscriptionStatus.fields.subject)

  OBJECT

  A subscription status event.

***

```graphql
union Subject = AppReference | ThemeReference
```
