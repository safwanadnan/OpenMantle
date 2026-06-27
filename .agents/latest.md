---
title: App Events API reference
description: >-
  The App Events API lets you send app events for monitoring in the Dev
  Dashboard and for Shopify App Pricing usage-based pricing.
api_version: unstable
source_url:
  html: 'https://shopify.dev/docs/api/app-events/latest'
  md: 'https://shopify.dev/docs/api/app-events/latest.md'
api_name: app-events
---

# App Events API reference

The App Events API lets developers send events that happen in their app to Shopify. All events are shown in the [Dev Dashboard](https://shopify.dev/docs/apps/build/dev-dashboard/monitoring-and-logs) logs section. Events configured as part of [Shopify App Pricing](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing) are also processed for billing.

## Authentication

All App Events API requests require a valid bearer token.

API keys created in the [Dev Dashboard](https://dev.shopify.com/dashboard/) provide a client ID and secret that can be used to generate a JWT token. Permissions to write to App Events are automatically included — no additional scope configuration is required.

POST

## https://api.shopify.com/auth/access\_token

```javascript
const response = await fetch("https://api.shopify.com/auth/access_token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    client_id: "{your_client_id}",
    client_secret: "{your_client_secret}",
    grant_type: "client_credentials",
  }),
});


const data = await response.json();
```

The response will contain:

* `access_token`: A JWT access token that can be used to interact with the App Events API.
* `scope`: The list of access scopes that were granted to your API key.
* `expires_in`: The number of seconds until the access token expires.

## {} Response

```json
{
    "access_token": "f8563253df0bf277ec9ac6f649fc3f17",
    "scope": "write_global_api_app_events",
    "expires_in": 3599
}
```

Include your token as a `Authorization: Bearer {token}` header on all API requests. Access tokens expire after 60 minutes. You can use a JWT decoder tool like [`jwt.io`](https://www.jwt.io/) to investigate more details related to how Shopify issues this token. Request a new token before the current one expires.

POST

## https://api.shopify.com/app/unstable/events

```javascript
const response = await fetch("https://api.shopify.com/app/unstable/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {BEARER_TOKEN}",
  },
  body: JSON.stringify({
    shop_id: "gid://shopify/Shop/23423423",
    event_handle: "sms_sent",
    timestamp: "2026-01-27T14:30:00Z",
    idempotency_key: "evt_55667788",
    attributes: {
      value: 1,
    },
  }),
});


const data = await response.json();
```

***

## Endpoints and requests

The App Events API lets you send events happening in your app to Shopify. All events are visible in the [Dev Dashboard](https://shopify.dev/docs/apps/build/dev-dashboard/monitoring-and-logs). Events sent to this API as part of [Shopify App Pricing](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing) are processed for billing to merchants. Each request sends one event at a time — batch requests aren't supported.

All App Events API endpoints follow this pattern: `https://api.shopify.com/app/{version}/events`.

The App Events API is versioned. To keep your app stable, make sure you specify a supported version in the URL. Learn more about [API versioning](https://shopify.dev/api/usage/versioning).

The App Events API provides the following endpoint:

* **[Create an event](https://shopify.dev/docs/api/app-events/unstable/creating-events):** Send billing events for usage-based pricing meters or custom events for monitoring in the Dev Dashboard.

Learn more about [App Events](https://shopify.dev/docs/apps/build/app-events) and [building a billing event](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/build-billing-event).

***

## Request schema

All events use a single request schema. Every event is logged and visible in the [Dev Dashboard](https://shopify.dev/docs/apps/build/dev-dashboard/monitoring-and-logs). If the `event_handle` matches a handle configured in a pricing plan as part of [Shopify App Pricing](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/setup-usage-charges), the event is also processed as a usage charge.

**Caution:**

Don't include any data that, alone or in combination with other data, could identify an individual. This includes any merchant or buyer information, such as name, email address, phone number, and other identifiable data points. Use anonymized identifiers and aggregated metrics instead.

#### Request body

***

`shop_id`•`string``Required`

The ID of the merchant's shop that the event is associated with. For example, `gid://shopify/Shop/23423423` or `23423423`. Both a Shopify GID and a numeric shop ID (as a string) are accepted.

***

`event_handle`•`string``Required`

The name of the event. If this matches a meter handle in your pricing configuration, the event is processed as a billing event. Otherwise, it's tracked as a custom event for monitoring. The prefix `shopify.` is reserved and can't be used.

***

`timestamp`•`string``Required`

The ISO 8601 timestamp of when the event occurred (for example, `2026-01-27T14:30:00Z`). The timestamp can't be more than 5 minutes in the future. Billing events outside the current cycle currently reject with `RESULT_STATUS_FAILURE` and a `result_details` message with details about the allowable window.

***

`idempotency_key`•`string``Required`

An app-generated unique key to prevent duplicate events. Maximum 64 characters. The API enforces a 24-hour idempotency window — requests with a previously seen key within that window return the original response. For billing events, idempotency is enforced permanently.

***

`attributes`•`object``Required`

A JSON object containing the event data. For billing events, the `value` field is required and must be greater than 0. It specifies the quantity to add to the meter. The attributes object has the following restrictions:

* Maximum 15 keys in the attributes object
* Keys are limited to 64 characters and can only contain alphanumeric ASCII characters, underscores (`_`), periods (`.`), and hyphens (`-`)
* String values are limited to 128 characters (UTF-8)
* Only scalar values are allowed (strings, numbers, booleans). Arrays and nested objects aren't supported.

***

## {} Request body

##### Billing event

```json
{
  "shop_id": "gid://shopify/Shop/23423423",
  "event_handle": "sms_sent",
  "timestamp": "2026-01-27T14:30:00Z",
  "idempotency_key": "evt_55667788",
  "attributes": {
    "value": 1
  }
}
```

##### Custom event

```json
{
  "shop_id": "gid://shopify/Shop/23423423",
  "event_handle": "onboarding_completed",
  "timestamp": "2026-01-27T14:30:00Z",
  "idempotency_key": "onboard_23423423_v3",
  "attributes": {
    "onboarding_version": 3,
    "steps_completed": 5
  }
}
```

***

## Response schema

All successful requests return a `202 Accepted` response with the following JSON body:

***

`success`•`boolean`

Whether the event was received successfully.

***

`error`•`string`

Present when `success` is `false`. A short explanation of what went wrong.

***

## {} Response

```json
{
  "success": true
}
```

***

## Example: Report a billing event

This example shows the full flow of authenticating and sending a billing event.

POST

## https://api.shopify.com/app/unstable/events

```javascript
// Step 1: Get an access token
const authResponse = await fetch("https://api.shopify.com/auth/access_token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    client_id: "{your_client_id}",
    client_secret: "{your_client_secret}",
    grant_type: "client_credentials",
  }),
});
const { access_token } = await authResponse.json();


// Step 2: Send a billing event
const response = await fetch("https://api.shopify.com/app/unstable/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${access_token}`,
  },
  body: JSON.stringify({
    shop_id: "gid://shopify/Shop/23423423",
    event_handle: "sms_sent",
    timestamp: "2026-01-27T14:30:00Z",
    idempotency_key: "evt_55667788",
    attributes: {
      value: 1,
    },
  }),
});


const data = await response.json();
// { "success": true }
```

***

## Status and error codes

All API queries return HTTP status codes that can tell you more about the response.

***

`202 Accepted`

The event was received successfully. A `202` response means Shopify received the request — it doesn't confirm that billing validation passed. Billing errors are processed asynchronously and are only visible in the [Dev Dashboard](https://shopify.dev/docs/apps/build/app-events#view-events-in-the-dev-dashboard) under **Logs** with the **App Billing Event** type filter. There are no synchronous billing error responses and no webhooks for billing validation failures. Replayed requests (same `idempotency_key` within the idempotency window) return the original response with an `Idempotent-Replay: true` header.

***

`400 Bad Request`

The request parameters are invalid. The response includes `{ "success": false, "error": "Invalid request" }`.

***

`401 Unauthorized`

The bearer token is missing or invalid.

***

`403 Forbidden`

The app isn't installed on the shop specified by `shop_id`, or the `shop_id` value is invalid.

***

`409 Conflict`

A request with the same `idempotency_key` is still being processed. Retry after a short delay.

***

`429 Too Many Requests`

Rate limit exceeded. The App Events API has a rate limit of 500 requests per second per app. Wait before retrying.

***

`5xx Errors`

An internal error occurred in Shopify. Check out the [Shopify status page](https://www.shopifystatus.com) for more information.

***

## {} Sample error responses

##### 401

```json
{
  "error": "Unauthorized"
}
```

##### 429

```json
{
  "success": false,
  "error": "Rate limit exceeded"
}
```

***

## Terms

By using the App Events API, you agree to the [App Events API Terms of Service](https://shopify.com/legal/app-events-terms). Don't submit personal information such as names, email addresses, or any data that identifies a natural person.

***
