---
title: UserError - Partner API
description: Represents an error in a mutation.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/UserError'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/UserError.md'
api_name: partner
api_type: graphql
type: object
---

# User​Error

object

Represents an error in a mutation.

## Fields

* field

  [\[String!\]](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  The path to the input field that caused the error.

* message

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The error message.

***

## Map

No referencing types

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

* [app​Subscription​Cancel](https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel)

  mutation

  Cancels an app subscription.

  * app​Id

    [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    required

    ### Arguments

    The id of the app. Example value: `gid://shopify/App/123`.

  * defer​Cancellation

    [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

    required

    Whether to defer cancellation until the end of the current billing cycle.

  * prorate

    [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

    required

    Whether to issue prorated credits for the unused portion of the subscription. Cannot be used together with `skipFinalUsageCharge`.

  * shop​Id

    [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    required

    The id of the shop. Example value: `gid://shopify/Shop/456`.

  * skip​Final​Usage​Charge

    [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

    required

    Whether to skip the final usage charge when cancelling. Only applicable to usage-billed subscriptions. Cannot be used together with `prorate`.

  ***

***

## UserError Mutations

### Mutated by

* [app​Credit​Create](https://shopify.dev/docs/api/partner/2026-07/mutations/appCreditCreate)
* [app​Subscription​Cancel](https://shopify.dev/docs/api/partner/2026-07/mutations/appSubscriptionCancel)
