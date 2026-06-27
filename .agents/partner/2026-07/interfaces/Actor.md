---
title: Actor - Partner API
description: A Partner organization or shop.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/Actor'
  md: 'https://shopify.dev/docs/api/partner/2026-07/interfaces/Actor.md'
api_name: partner
api_type: graphql
type: interface
---

# Actor

interface

A Partner organization or shop.

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

##### Variables

```json
{
	"avatarUrl": "",
	"id": "",
	"name": ""
}
```

##### Schema

```graphql
interface Actor {
  avatarUrl: Url
  id: ID!
  name: String!
}
```
