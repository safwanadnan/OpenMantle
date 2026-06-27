---
title: TransactionType - Partner API
description: The type of transaction.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/enums/TransactionType'
  md: 'https://shopify.dev/docs/api/partner/2026-07/enums/TransactionType.md'
api_name: partner
api_type: graphql
type: enum
---

# Transaction​Type

enum

The type of transaction.

## Valid values

* APP\_​ONE\_​TIME\_​SALE

  A transaction corresponding to a one-time app charge.

* APP\_​SALE\_​ADJUSTMENT

  A transaction corresponding to a refund, downgrade, or adjustment of an app charge.

* APP\_​SALE\_​CREDIT

  A transaction corresponding to an [app credit](https://shopify.dev/docs/admin-api/rest/reference/billing/applicationcredit).

* APP\_​SUBSCRIPTION\_​SALE

  A transaction corresponding to an app subscription charge.

* APP\_​USAGE\_​SALE

  A transaction corresponding to an app usage charge.

* LEGACY

  A transaction of a type that is no longer supported.

* REFERRAL

  A transaction corresponding to a shop referral.

* REFERRAL\_​ADJUSTMENT

  A transaction corresponding to a shop referral adjustment.

* SERVICE\_​SALE

  A transaction corresponding to a paid invoice for a service.

* SERVICE\_​SALE\_​ADJUSTMENT

  A transaction corresponding to a refund, downgrade, or adjustment of a service sale.

* TAX

  Tax transactions are not computed for pending transactions. Instead, they're rolled up as one transaction per payout. The type of tax and the way it's computed is dependent on the type of transaction.

  For sale transactions, such as app subscriptions or theme purchases, Shopify charges the Partner tax on the fee collected for brokering the transaction. The amount is a negative number in this scenario.

  For referral transactions, such as a development store transfer, Shopify pays the Partner a commission. The tax represents any taxes on the referral commission that are payable to the Partner. The amount is a positive number in this scenario.

* THEME\_​SALE

  A transaction corresponding to a theme purchase.

* THEME\_​SALE\_​ADJUSTMENT

  A transaction corresponding to a refund, downgrade, or adjustment of a theme sale.

***

## Fields

* [Query​Root.transactions(types)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.types)

  ARGUMENT

  The schema's entry-point for queries. This acts as the public, top-level API from which all queries must start.

* [transactions.types](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-types)

  ARGUMENT

***

## Map

### Arguments with this enum

* [Query​Root.transactions(types)](https://shopify.dev/docs/api/partner/2026-07/objects/QueryRoot#field-QueryRoot.fields.transactions.arguments.types)
* [transactions.types](https://shopify.dev/docs/api/partner/2026-07/queries/transactions#arguments-types)
