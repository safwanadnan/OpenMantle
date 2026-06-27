---
title: Organization - Partner API
description: A Partner organization.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/Organization'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/Organization.md'
api_name: partner
api_type: graphql
type: object
---

# Organization

object

A Partner organization.

## Fields

* avatar​Url

  [Url](https://shopify.dev/docs/api/partner/2026-07/scalars/Url)

  A URL referencing the avatar associated with the actor.

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  non-null

  A globally unique identifier for the actor. Example value: `gid://partners/Shop/1234`.

* name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The name of the actor. This might be a Partner organization or shop name.

***

## Map

No referencing types

***

## Interfaces

* * [Actor](https://shopify.dev/docs/api/partner/2026-07/interfaces/Actor)

    interface

  * [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)

    interface

***

## Organization Implements

### Implements

* [Actor](https://shopify.dev/docs/api/partner/2026-07/interfaces/Actor)
* [Node](https://shopify.dev/docs/api/partner/2026-07/interfaces/Node)
