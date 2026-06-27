---
title: appCreditCreate - Partner API
description: |-
  Allows an app to create a credit for a shop that can be used towards future
  app purchases. This mutation is only available to Partner API clients that
  have been granted the `View financials` permission.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate'
  md: 'https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate.md'
api_name: partner
api_type: graphql
type: mutation
---

# app​Credit​Create

mutation

Allows an app to create a credit for a shop that can be used towards future app purchases. This mutation is only available to Partner API clients that have been granted the `View financials` permission.

## Arguments

* amount

  [Money​Input!](https://shopify.dev/docs/api/partner/2026-07/input-objects/MoneyInput)

  required

  The amount that can be used towards future app purchases in Shopify.

* app​Id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  required

  The id of the app to associate the credit with. Example value: `gid://partners/App/123`.

* description

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  required

  The description of the app credit.

* shop​Id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  required

  The id of the shop to be credited. Example value: `gid://partners/Shop/456`.

* test

  [Boolean](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  Default:false

  Specifies whether the app credit is a test transaction.

***

## App​Credit​Create​Payload returns

* app​Credit

  [App​Credit](https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit)

  The app credit that was created.

* user​Errors

  [\[User​Error!\]](https://shopify.dev/docs/api/partner/2026-07/objects/UserError)

  Errors when creating the application credit.

***

## Examples

* ### appCreditCreate reference
