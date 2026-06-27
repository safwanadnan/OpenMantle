---
title: AppCredit - Partner API
description: >-
  A [credit](/docs/admin-api/rest/reference/billing/applicationcredit) issued

  to a merchant for an app. Merchants are entitled to app credits under certain
  circumstances,

  such as when a paid app subscription is downgraded partway through its billing
  cycle.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit.md'
api_name: partner
api_type: graphql
type: object
---

# App​Credit

object

A [credit](https://shopify.dev/docs/admin-api/rest/reference/billing/applicationcredit) issued to a merchant for an app. Merchants are entitled to app credits under certain circumstances, such as when a paid app subscription is downgraded partway through its billing cycle.

## Fields

* amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The amount that can be used towards future app purchases in Shopify.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  A globally unique identifier.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The description of the app credit.

* test

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether the app credit was a test transaction.

***

## Map

### Fields with this object

* [AppCreditEvent.appCredit](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCreditEvent#fields-appCredit)
* [CreditApplied.appCredit](https://shopify.dev/docs/api/partner/2026-07/objects/CreditApplied#field-CreditApplied.fields.appCredit)
* [CreditFailed.appCredit](https://shopify.dev/docs/api/partner/2026-07/objects/CreditFailed#field-CreditFailed.fields.appCredit)
* [CreditPending.appCredit](https://shopify.dev/docs/api/partner/2026-07/objects/CreditPending#field-CreditPending.fields.appCredit)

***

## Mutations

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

## AppCredit Mutations

### Mutated by

* [app​Credit​Create](https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate)

***

## Interfaces

* * [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)

    interface

  * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

***

## AppCredit Implements

### Implements

* [App​Charge](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge)
* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
