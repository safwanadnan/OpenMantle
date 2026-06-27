---
title: TaxTransaction - Partner API
description: >-
  Tax transactions are not computed for pending transactions. Instead, they're
  rolled

  up as one transaction per payout. The type of tax and the way it's

  computed is dependent on the type of transaction.


  For sale transactions, such as app subscriptions or theme purchases, Shopify
  charges

  the Partner tax on the fee collected for brokering the transaction. The amount
  is

  a negative number in this scenario.


  For referral transactions, such as a development store transfer, Shopify pays
  the Partner

  a commission. The tax represents any taxes on the referral commission that are
  payable to

  the Partner. The amount is a positive number in this scenario.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/TaxTransaction'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/TaxTransaction.md'
api_name: partner
api_type: graphql
type: object
---

# Tax​Transaction

object

Tax transactions are not computed for pending transactions. Instead, they're rolled up as one transaction per payout. The type of tax and the way it's computed is dependent on the type of transaction.

For sale transactions, such as app subscriptions or theme purchases, Shopify charges the Partner tax on the fee collected for brokering the transaction. The amount is a negative number in this scenario.

For referral transactions, such as a development store transfer, Shopify pays the Partner a commission. The tax represents any taxes on the referral commission that are payable to the Partner. The amount is a positive number in this scenario.

## Fields

* amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The net amount that is added to or deducted from your payout.

* created​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the transaction was recorded.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  The transaction ID.

* type

  [Tax​Transaction​Type!](https://shopify.dev/docs/api/partner/2026-07/enums/TaxTransactionType)

  non-nullDeprecated

***

## Map

No referencing types

***

## Interfaces

* * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

  * [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)

    interface

***

## TaxTransaction Implements

### Implements

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
* [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)
