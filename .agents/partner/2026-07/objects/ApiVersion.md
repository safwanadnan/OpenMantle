---
title: ApiVersion - Partner API
description: A version of the API.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/objects/ApiVersion'
  md: 'https://shopify.dev/docs/api/partner/2026-07/objects/ApiVersion.md'
api_name: partner
api_type: graphql
type: object
---

# Api​Version

object

A version of the API.

## Fields

* display​Name

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The human-readable name of the version.

* handle

  [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

  non-null

  The unique identifier of an ApiVersion. All supported API versions have a date-based (YYYY-MM) or `unstable` handle.

* supported

  [Boolean!](https://shopify.dev/docs/api/partner/2026-07/scalars/Boolean)

  non-null

  Whether the version is supported by Shopify.

***

## Map

No referencing types

***

## Queries

* [public​Api​Versions](https://shopify.dev/docs/api/partner/2026-07/queries/publicApiVersions)

  query

  The list of public Partner API versions, including supported, release candidate and unstable versions.

***

## ApiVersion Queries

### Queried by

* [public​Api​Versions](https://shopify.dev/docs/api/partner/2026-07/queries/publicApiVersions)
