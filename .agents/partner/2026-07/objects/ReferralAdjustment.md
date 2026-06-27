---
title: ReferralAdjustment - Partner API
description: A transaction corresponding to a shop referral adjustment.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/ReferralAdjustment'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/ReferralAdjustment.md'
api_name: partner
api_type: graphql
type: object
---

# Referral​Adjustment

object

A transaction corresponding to a shop referral adjustment.

## Fields

* amount

  [Money!](https://shopify.dev/docs/api/partner/2026-07/objects/Money)

  non-null

  The net amount that is added to or deducted from your payout.

* category

  [Referral​Category!](https://shopify.dev/docs/api/partner/2026-07/enums/ReferralCategory)

  non-null

  The referral type.

* created​At

  [Date​Time!](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  non-null

  The date and time when the transaction was recorded.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  The transaction ID.

* shop

  [Shop](https://shopify.dev/docs/api/partner/2026-07/objects/Shop)

  The referred shop.

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

## ReferralAdjustment Implements

### Implements

* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
* [Transaction](https://shopify.dev/docs/api/partner/2026-07/interfaces/Transaction)
