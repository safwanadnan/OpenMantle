---
title: Plan - Partner API
description: Subscription plan details.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Plan'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Plan.md'
api_name: partner
api_type: graphql
type: object
---

# Plan

object

Subscription plan details.

## Fields

* billing​Period

  [App​Pricing​Interval](https://shopify.dev/docs/api/partner/2026-07/enums/AppPricingInterval)

  The billing interval for the plan.

* handle

  [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  The plan handle.

* prices

  [\[Plan​Price!\]!](https://shopify.dev/docs/api/partner/2026-07/interfaces/PlanPrice)

  non-null

  The pricing details for the plan.

* trial​Days

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  Number of trial days for the plan.

* trial​Days​Remaining

  [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

  Number of trial days remaining.

***

## Map

### Fields with this object

* [SubscriptionStatus.plan](https://shopify.dev/docs/api/partner/2026-07/objects/SubscriptionStatus#field-SubscriptionStatus.fields.plan)
