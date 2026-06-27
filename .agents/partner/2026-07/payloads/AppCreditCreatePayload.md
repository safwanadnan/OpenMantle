---
title: AppCreditCreatePayload - Partner API
description: The result of an appCreditCreate mutation.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/payloads/AppCreditCreatePayload'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/payloads/AppCreditCreatePayload.md
api_name: partner
api_type: graphql
type: payload
---

# App​Credit​Create​Payload

payload

The result of an appCreditCreate mutation.

## Fields

* app​Credit

  [App​Credit](https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit)

  The app credit that was created.

* user​Errors

  [\[User​Error!\]](https://shopify.dev/docs/api/partner/2026-07/objects/UserError)

  Errors when creating the application credit.

***

## Mutations with this payload

* [app​Credit​Create](https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate)

  mutation

  Allows an app to create a credit for a shop that can be used towards future app purchases. This mutation is only available to Partner API clients that have been granted the `View financials` permission.

  * amount

    [Money​Input!](https://shopify.dev/docs/api/partner/2026-07/input-objects/MoneyInput)

    required

    ### Arguments

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

***

## Map

### Mutations with this payload

* [app​Credit​Create](https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate)
