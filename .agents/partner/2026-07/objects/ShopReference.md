---
title: ShopReference - Partner API
description: |-
  A reference to a Shopify shop, identified by its global ID. Use the
  `gid://shopify/Shop/<id>` format to look up the shop in the Admin API.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/ShopReference.md'
api_name: partner
api_type: graphql
type: object
---

# Shop​Reference

object

A reference to a Shopify shop, identified by its global ID. Use the `gid://shopify/Shop/<id>` format to look up the shop in the Admin API.

## Fields

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  The shop ID. Example value: `gid://shopify/Shop/1234`.

* myshopify​Domain

  [Url!](https://shopify.dev/docs/api/partner/2026-07/scalars/Url)

  non-null

  The shop's `.myshopify.com` domain name.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The name of the shop.

***

## Map

### Fields with this object

* [ActiveSubscription.shop](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.shop)
* [CancelledSubscription.shop](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.shop)
* [Charge.shop](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.shop)
* [Credit.shop](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.shop)
* [Earning.shop](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.shop)
* [PartnerEvent.shop](https://shopify.dev/docs/api/partner/2026-07/interfaces/PartnerEvent#fields-shop)
* [Relationship.shop](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.shop)
* [SubscriptionStatus.shop](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionStatus#field-SubscriptionStatus.fields.shop)
