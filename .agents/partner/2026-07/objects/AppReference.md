---
title: AppReference - Partner API
description: |-
  A reference to a Shopify app, identified by its global ID. Use the
  `gid://shopify/App/<id>` format to look up the app in the Admin API.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppReference'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppReference.md'
api_name: partner
api_type: graphql
type: object
---

# App​Reference

object

A reference to a Shopify app, identified by its global ID. Use the `gid://shopify/App/<id>` format to look up the app in the Admin API.

## Fields

* api​Key

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  A unique application API identifier.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  The app ID. Example value: `gid://shopify/App/1234`.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The name of the app.

***

## Map

### Fields with this object

* [ActiveSubscription.app](https://shopify.dev/docs/api/partner/2026-07/objects/ActiveSubscription#field-ActiveSubscription.fields.app)
* [CancelledSubscription.app](https://shopify.dev/docs/api/partner/2026-07/objects/CancelledSubscription#field-CancelledSubscription.fields.app)

### Possible type in

* [Subject](https://shopify.dev/docs/api/partner/2026-07/unions/Subject)
