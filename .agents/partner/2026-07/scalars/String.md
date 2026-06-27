---
title: String - Partner API
description: >-
  The `String` scalar type represents textual data, represented as UTF-8
  character sequences. The String type is most often used by GraphQL to
  represent free-form human-readable text.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/scalars/String'
  md: 'https://shopify.dev/docs/api/partner/2026-07/scalars/String.md'
api_name: partner
api_type: graphql
type: scalar
---

# String

scalar

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## Map

### Fields with this scalar

* [Api​Version.displayName](https://shopify.dev/docs/api/partner/2026-07/objects/ApiVersion#field-ApiVersion.fields.displayName)
* [Api​Version.handle](https://shopify.dev/docs/api/partner/2026-07/objects/ApiVersion#field-ApiVersion.fields.handle)
* [App.apiKey](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.apiKey)
* [App.name](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.name)
* [App​Credit.name](https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit#field-AppCredit.fields.name)
* [App​Event​Edge.cursor](https://shopify.dev/docs/api/partner/2026-07/objects/AppEventEdge#field-AppEventEdge.fields.cursor)
* [App​Purchase​One​Time.name](https://shopify.dev/docs/api/partner/2026-07/objects/AppPurchaseOneTime#field-AppPurchaseOneTime.fields.name)
* [App​Reference.apiKey](https://shopify.dev/docs/api/partner/2026-07/objects/AppReference#field-AppReference.fields.apiKey)
* [App​Reference.name](https://shopify.dev/docs/api/partner/2026-07/objects/AppReference#field-AppReference.fields.name)
* [App​Subscription.name](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription#field-AppSubscription.fields.name)
* [App​Usage​Record.name](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageRecord#field-AppUsageRecord.fields.name)
* [Charge.description](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.description)
* [Charge.planHandle](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.planHandle)
* [Credit.description](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.description)
* [Earning.description](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.description)
* [Historical​Events​Page​Info.endCursor](https://shopify.dev/docs/api/partner/2026-07/objects/HistoricalEventsPageInfo#field-HistoricalEventsPageInfo.fields.endCursor)
* [Historical​Events​Page​Info.startCursor](https://shopify.dev/docs/api/partner/2026-07/objects/HistoricalEventsPageInfo#field-HistoricalEventsPageInfo.fields.startCursor)
* [Organization.name](https://shopify.dev/docs/api/partner/2026-07/objects/Organization#field-Organization.fields.name)
* [Partner​Event​Edge.cursor](https://shopify.dev/docs/api/partner/2026-07/objects/PartnerEventEdge#field-PartnerEventEdge.fields.cursor)
* [Plan.handle](https://shopify.dev/docs/api/partner/2026-07/objects/Plan#field-Plan.fields.handle)
* [Relationship.reason](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.reason)
* [Relationship.reasonDescription](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.reasonDescription)
* [Relationship​Uninstalled.description](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled#field-RelationshipUninstalled.fields.description)
* [Relationship​Uninstalled.reason](https://shopify.dev/docs/api/partner/2026-07/objects/RelationshipUninstalled#field-RelationshipUninstalled.fields.reason)
* [Shop.name](https://shopify.dev/docs/api/partner/2026-07/objects/Shop#field-Shop.fields.name)
* [Shop​Reference.name](https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference#field-ShopReference.fields.name)
* [Subscription​Item.description](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem#field-SubscriptionItem.fields.description)
* [Subscription​Item.handle](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionItem#field-SubscriptionItem.fields.handle)
* [Theme.name](https://shopify.dev/docs/api/partner/2026-07/objects/Theme#field-Theme.fields.name)
* [Theme​Reference.name](https://shopify.dev/docs/api/partner/2026-07/objects/ThemeReference#field-ThemeReference.fields.name)

### Arguments with this scalar

* [App.events(after)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.after)
* [App.events(before)](https://shopify.dev/docs/api/partner/2026-07/objects/App#field-App.fields.events.arguments.before)
* [Query​Root.events(after)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.events.arguments.after)
* [Query​Root.events(before)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.events.arguments.before)
* [Query​Root.transactions(after)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.after)
* [Query​Root.transactions(before)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.before)
* [Query​Root.transactions(myshopifyDomain)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.myshopifyDomain)
* [app​Credit​Create.description](https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate#arguments-description)
* [events.after](https://shopify.dev/docs/api/partner/2026-07/queries/events#arguments-after)
* [events.before](https://shopify.dev/docs/api/partner/2026-07/queries/events#arguments-before)
* [transactions.after](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-after)
* [transactions.before](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-before)
* [transactions.myshopifyDomain](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-myshopifyDomain)
