---
title: Money - Partner API
description: A monetary value with currency.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Money'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Money.md'
api_name: partner
api_type: graphql
type: object
---

# Money

object

A monetary value with currency.

## Fields

* amount

  [Decimal!](https://shopify.dev/docs/api/partner/2026-07/scalars/Decimal)

  non-null

  The decimal money amount.

* currency​Code

  [Currency!](https://shopify.dev/docs/api/partner/2026-07/enums/Currency)

  non-null

  The currency.

***

## Map

### Fields with this object

* [AppCharge.amount](https://shopify.dev/docs/api/partner/2026-07/interfaces/AppCharge#fields-amount)
* [AppCredit.amount](https://shopify.dev/docs/api/partner/2026-07/objects/AppCredit#field-AppCredit.fields.amount)
* [AppOneTimeSale.grossAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.grossAmount)
* [AppOneTimeSale.netAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.netAmount)
* [AppOneTimeSale.shopifyFee](https://shopify.dev/docs/api/partner/2026-07/objects/AppOneTimeSale#field-AppOneTimeSale.fields.shopifyFee)
* [AppPurchaseOneTime.amount](https://shopify.dev/docs/api/partner/2026-07/objects/AppPurchaseOneTime#field-AppPurchaseOneTime.fields.amount)
* [AppSaleAdjustment.grossAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.grossAmount)
* [AppSaleAdjustment.netAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.netAmount)
* [AppSaleAdjustment.shopifyFee](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleAdjustment#field-AppSaleAdjustment.fields.shopifyFee)
* [AppSaleCredit.grossAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.grossAmount)
* [AppSaleCredit.netAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.netAmount)
* [AppSaleCredit.shopifyFee](https://shopify.dev/docs/api/partner/2026-07/objects/AppSaleCredit#field-AppSaleCredit.fields.shopifyFee)
* [AppSubscription.amount](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscription#field-AppSubscription.fields.amount)
* [AppSubscriptionSale.grossAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.grossAmount)
* [AppSubscriptionSale.netAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.netAmount)
* [AppSubscriptionSale.shopifyFee](https://shopify.dev/docs/api/partner/2026-07/objects/AppSubscriptionSale#field-AppSubscriptionSale.fields.shopifyFee)
* [AppUsageRecord.amount](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageRecord#field-AppUsageRecord.fields.amount)
* [AppUsageSale.grossAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.grossAmount)
* [AppUsageSale.netAmount](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.netAmount)
* [AppUsageSale.shopifyFee](https://shopify.dev/docs/api/partner/2026-07/objects/AppUsageSale#field-AppUsageSale.fields.shopifyFee)
* [Charge.amount](https://shopify.dev/docs/api/partner/2026-07/objects/Charge#field-Charge.fields.amount)
* [Credit.money](https://shopify.dev/docs/api/partner/2026-07/objects/Credit#field-Credit.fields.money)
* [Earning.grossAmount](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.grossAmount)
* [Earning.netAmount](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.netAmount)
* [Earning.shopifyFee](https://shopify.dev/docs/api/partner/2026-07/objects/Earning#field-Earning.fields.shopifyFee)
* [LegacyTransaction.amount](https://shopify.dev/docs/api/partner/2026-07/objects/LegacyTransaction#field-LegacyTransaction.fields.amount)
* [ReferralAdjustment.amount](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralAdjustment#field-ReferralAdjustment.fields.amount)
* [ReferralTransaction.amount](https://shopify.dev/docs/api/partner/2026-07/objects/ReferralTransaction#field-ReferralTransaction.fields.amount)
* [ServiceSale.grossAmount](https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSale#field-ServiceSale.fields.grossAmount)
* [ServiceSale.netAmount](https://shopify.dev/docs/api/partner/2026-07/objects/ServiceSale#field-ServiceSale.fields.netAmount)
