---
title: app - Partner API
description: 'A Shopify [app](/concepts/apps).'
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/queries/app'
  md: 'https://shopify.dev/docs/api/partner/2026-07/queries/app.md'
api_name: partner
api_type: graphql
type: query
---

# app

query

A Shopify [app](https://shopify.dev/concepts/apps).

## Arguments

* id

  [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  required

  The app ID. Example value: `gid://partners/App/1234`.

***

## Possible returns

* App

  [App](https://shopify.dev/docs/api/partner/2026-07/objects/App)

  A Shopify [app](https://shopify.dev/concepts/apps).

  * api​Key

    [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

    non-null

    A unique application API identifier.

  * events

    [App​Event​Connection!](https://shopify.dev/docs/api/partner/2026-07/connections/AppEventConnection)

    non-null

    A list of app events.

    * after

      [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

      ### Arguments

      Returns the elements in the list that come after the specified cursor.

    * before

      [String](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

      Returns the elements in the list that come before the specified cursor.

    * charge​Id

      [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

      Returns app events associated with the specified [app charge](https://shopify.dev/tutorials/bill-for-your-app-using-graphql-admin-api). Example value: `gid://shopify/AppUsageRecord/1234`.

    * first

      [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

      Returns the first *n* elements from the list.

    * last

      [Int](https://shopify.dev/docs/api/partner/2026-07/scalars/Int)

      Returns the last *n* elements from the list.

    * occurred​At​Max

      [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

      Returns app events that occurred on or before the specified date and time.

    * occurred​At​Min

      [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

      Returns app events that occurred on or after the specified date and time.

    * shop​Id

      [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

      Returns app events associated with the specified shop ID. Example value: `gid://partners/Shop/1234`.

    * types

      [\[App​Event​Types!\]](https://shopify.dev/docs/api/partner/2026-07/enums/AppEventTypes)

      Returns app events of the specified types.

    ***

  * id

    [ID!](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

    non-null

    The ID of the app. Example value: `gid://partners/App/1234`.

  * name

    [String!](https://shopify.dev/docs/api/partner/2026-07/scalars/String)

    non-null

    The name of the app.

***

## Examples

* ### app reference
