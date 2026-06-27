---
title: publicApiVersions - Partner API
description: >-
  The list of public Partner API versions, including supported, release
  candidate and unstable versions.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/queries/publicApiVersions'
  md: 'https://shopify.dev/docs/api/partner/2026-07/queries/publicApiVersions.md'
api_name: partner
api_type: graphql
type: query
---

# public​Api​Versions

query

The list of public Partner API versions, including supported, release candidate and unstable versions.

## Possible returns

* Api​Version

  [\[Api​Version!\]!](https://shopify.dev/docs/api/partner/2026-07/objects/ApiVersion)

  A version of the API.

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

## Examples

* ### publicApiVersions reference
