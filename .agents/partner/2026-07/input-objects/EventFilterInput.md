---
title: EventFilterInput - Partner API
description: Filter criteria for historical events.
api_version: 2026-07
source_url:
  html: 'https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput'
  md: >-
    https://shopify.dev/docs/api/partner/2026-07/input-objects/EventFilterInput.md
api_name: partner
api_type: graphql
type: input-object
---

# Event​Filter​Input

input\_object

Filter criteria for historical events.

## Fields

* event​Types

  [\[Event​Type!\]](https://shopify.dev/docs/api/partner/2026-07/enums/EventType)

  Filter events by one or more event types.

* occurred​At​Max

  [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  Filter events that occurred on or before this date. If only this is provided, occurred\_at\_min defaults to this date - 30 days. Defaults to now if neither date is provided. Maximum range between occurred\_at\_min and occurred\_at\_max is 365 days.

* occurred​At​Min

  [Date​Time](https://shopify.dev/docs/api/partner/2026-07/scalars/DateTime)

  Filter events that occurred on or after this date. If only this is provided, occurred\_at\_max defaults to the earlier of this date + 30 days or now. Defaults to 30 days ago if neither date is provided. Maximum range between occurred\_at\_min and occurred\_at\_max is 365 days.

* shop​Id

  [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  Filter events by shop ID. Example value: `gid://shopify/Shop/1234`.

* subject​Id

  [ID](https://shopify.dev/docs/api/partner/2026-07/scalars/ID)

  Filter events by subject ID. Example value: `gid://shopify/App/1234`.

* subject​Type

  [Subject​Type](https://shopify.dev/docs/api/partner/2026-07/enums/SubjectType)

  Filter events by subject type (APP or THEME).

***

## Map

No referencing types
