---
title: RelationshipState - Partner API
description: The state of an app or theme relationship with a shop.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/enums/RelationshipState'
  md: 'https://shopify.dev/docs/api/partner/2026-07/enums/RelationshipState.md'
api_name: partner
api_type: graphql
type: enum
---

# Relationship​State

enum

The state of an app or theme relationship with a shop.

## Valid values

* DEACTIVATED

  Shop's billing account was deactivated.

* INSTALLED

  App or theme was installed.

* REACTIVATED

  Shop's billing account was reactivated.

* UNINSTALLED

  App or theme was uninstalled.

***

## Fields

* [Relationship.state](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.state)

  OBJECT

  A relationship event (install, uninstall, deactivate, reactivate).

***

## Map

### Fields with this enum

* [Relationship.state](https://shopify.dev/docs/api/partner/2026-07/objects/Relationship#field-Relationship.fields.state)
