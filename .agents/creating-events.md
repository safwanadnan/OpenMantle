---
title: 'App Events API: Create an event'
description: Create billing events or custom events in Shopify using the App Events API.
api_version: unstable
source_url:
  html: 'https://shopify.dev/docs/api/app-events/latest/creating-events'
  md: 'https://shopify.dev/docs/api/app-events/latest/creating-events.md'
api_name: app-events
---

# Create an event

Send billing events or custom events to Shopify.

Use this endpoint to report usage for billing meters or track custom events for monitoring in the Dev Dashboard.

***

## POSTCreate an event

This endpoint lets you send events happening in your app to Shopify. All events are visible in the [Dev Dashboard](https://shopify.dev/docs/apps/build/dev-dashboard/monitoring-and-logs). Events sent to this API as part of [Shopify App Pricing](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing) are processed for billing to merchants.

#### Parameters

***

`shop_id`•`string``Required`

The ID of the merchant's shop that the event is associated with. For example, `gid://shopify/Shop/23423423` or `23423423`. Both a Shopify GID and a numeric shop ID (as a string) are accepted.

***

`event_handle`•`string``Required`

The name of the event. For billing events, this must match a meter handle defined in your pricing configuration. For custom events, use a descriptive name (for example, `onboarding_completed`, `sync_failed`).

***

`timestamp`•`string``Required`

The ISO 8601 timestamp of when the event occurred in your app. The timestamp can't be more than 5 minutes in the future. Billing events outside the current cycle reject with `RESULT_STATUS_FAILURE` and a `result_details` message with details about the allowable window.

***

`idempotency_key`•`string``Required`

An app-generated unique key to prevent duplicate events. Maximum 64 characters. The API enforces a 24-hour idempotency window — requests with a previously seen key within that window return the original response. For billing events, idempotency is enforced permanently.

***

`attributes`•`object``Required`

A JSON object of key/value pairs containing the event data. For billing events, the `value` field is required and must be greater than 0. It specifies the quantity to add to the meter. Don't include any data that, alone or in combination with other data, could identify an individual. The attributes object has the following restrictions:

* Maximum 15 keys in the attributes object
* Keys are limited to 64 characters and can only contain alphanumeric ASCII characters, underscores (`_`), periods (`.`), and hyphens (`-`)
* String values are limited to 128 characters (UTF-8)
* Only scalar values are allowed (strings, numbers, booleans). Arrays and nested objects aren't supported.

***

POST

## https://api.shopify.com/app/unstable/events

##### Tracking a custom event

```javascript
// Send an event to track feature usage.
// Because "onboarding_completed" isn't a meter handle
// in this app's pricing config, Shopify logs it
// as a custom event for monitoring.
const response = await fetch("https://api.shopify.com/app/unstable/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {BEARER_TOKEN}",
  },
  body: JSON.stringify({
    shop_id: "gid://shopify/Shop/23423423",
    event_handle: "onboarding_completed",
    timestamp: "2026-01-27T14:30:00Z",
    idempotency_key: "onboard_23423423_v3",
    attributes: {
      onboarding_version: 3,
      steps_completed: 5,
    },
  }),
});

const data = await response.json();
```

##### Sending a billing event

```javascript
// Send an event using the same endpoint and format.
// Because "sms_sent" matches a meter handle defined in
// this app's pricing config, Shopify processes this as
// a billing event and increments the meter.
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

## {} Response

```json
{
  "success": true
}
```

**Info:**

The only difference between a custom event and a billing event is whether the `event_handle` matches a meter handle in your [pricing configuration](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/setup-usage-charges). The API call is identical — Shopify determines how to process the event based on your app's pricing setup.

**Info:**

The App Events API always returns a `202` response when it receives your request, even if the event fails billing validation. There is no synchronous billing error response and no webhooks for billing validation failures. To verify that your billing events are being processed correctly, go to the [Dev Dashboard](https://shopify.dev/docs/apps/build/app-events), navigate to **Logs**, and select **App Billing Event** filter under **Type**.

**Info:**

After a merchant uninstalls your app, you have 24 hours to submit any remaining billing events for usage that occurred before the uninstall. After 24 hours, the billing period for that merchant is closed and new events reject with `RESULT_STATUS_FAILURE` and a `result_details` message with details about the allowable window.

#### Examples

##### Send a billing event to increment a pricing meter.

Billing events require an `event_handle` that matches a meter handle in your pricing configuration. The `attributes.value` field specifies the quantity to add to the meter and must be greater than 0.

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

## {} Response

```json
{
  "success": true
}
```

##### Send custom events to monitor app behavior in the Dev Dashboard.

Custom Events let you track feature usage, error patterns, and merchant onboarding. Include any relevant data in the `attributes` field.

POST

## https://api.shopify.com/app/unstable/events

##### Onboarding

```javascript
const response = await fetch("https://api.shopify.com/app/unstable/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {BEARER_TOKEN}",
  },
  body: JSON.stringify({
    shop_id: "gid://shopify/Shop/23423423",
    event_handle: "onboarding_completed",
    timestamp: "2026-01-27T14:30:00Z",
    idempotency_key: "onboard_23423423_v3",
    attributes: {
      onboarding_version: 3,
      steps_completed: 5,
    },
  }),
});

const data = await response.json();
```

##### Feature usage

```javascript
const response = await fetch("https://api.shopify.com/app/unstable/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {BEARER_TOKEN}",
  },
  body: JSON.stringify({
    shop_id: "gid://shopify/Shop/23423423",
    event_handle: "feature_used",
    timestamp: "2026-01-27T15:45:00Z",
    idempotency_key: "feat_bulk_edit_abc123",
    attributes: {
      feature_name: "bulk_product_editor",
      action: "update",
      items_count: 47,
    },
  }),
});

const data = await response.json();
```

##### Error tracking

```javascript
const response = await fetch("https://api.shopify.com/app/unstable/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {BEARER_TOKEN}",
  },
  body: JSON.stringify({
    shop_id: "gid://shopify/Shop/23423423",
    event_handle: "sync_failed",
    timestamp: "2026-01-27T16:00:00Z",
    idempotency_key: "sync_fail_inventory_xyz789",
    attributes: {
      sync_type: "inventory",
      error_message: "Connection timeout after 30s",
      retry_count: 3,
      source_system: "erp_integration",
    },
  }),
});

const data = await response.json();
```

## {} Response

```json
{
  "success": true
}
```

***

## Event object schema

The Create an event endpoint accepts a single event per request — batch requests aren't supported. To report multiple events, send a separate request for each one.

### The Event resource

Represents an event sent to Shopify, used for either billing or monitoring purposes.

#### Properties

***

`shop_id`•`string``Required`

The ID of the merchant's shop that the event is associated with. For example, `gid://shopify/Shop/23423423` or `23423423`. Both a Shopify GID and a numeric shop ID (as a string) are accepted.

***

`event_handle`•`string``Required`

The name of the event. For billing events, this must match a meter handle defined in your pricing configuration. For custom events, use a descriptive name (for example, `onboarding_completed`, `sync_failed`).

***

`timestamp`•`string``Required`

The ISO 8601 timestamp of when the event occurred in your app. The timestamp can't be more than 5 minutes in the future. Billing events outside the current cycle reject with `RESULT_STATUS_FAILURE` and a `result_details` message with details about the allowable window.

***

`idempotency_key`•`string``Required`

An app-generated unique key to prevent duplicate events. Maximum 64 characters. The API enforces a 24-hour idempotency window — requests with a previously seen key within that window return the original response. For billing events, idempotency is enforced permanently.

***

`attributes`•`object``Required`

A JSON object of key/value pairs containing the event data. For billing events, the `value` field is required and must be greater than 0. It specifies the quantity to add to the meter. Don't include any data that, alone or in combination with other data, could identify an individual. The attributes object has the following restrictions:

* Maximum 15 keys in the attributes object
* Keys are limited to 64 characters and can only contain alphanumeric ASCII characters, underscores (`_`), periods (`.`), and hyphens (`-`)
* String values are limited to 128 characters (UTF-8)
* Only scalar values are allowed (strings, numbers, booleans). Arrays and nested objects aren't supported.

***

## {} Event

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

***

## Error responses

When a request is rejected, the API returns a non-`2xx` status code with a JSON body containing `success: false`, a top-level `error` message, and an `errors` array with field-level detail:

```json
{
  "success": false,
  "error": "Invalid request",
  "errors": [
    {
      "field": "shop_id",
      "code": "missing",
      "message": "is missing"
    }
  ]
}
```

Each entry in `errors` includes:

| Field | Description |
| - | - |
| `field` | The request field that failed validation, or `null` for request-level errors. |
| `code` | A machine-readable error code such as `missing`, `invalid`, `invalid_type`, or `not_installed`. |
| `message` | A human-readable description of the error. |

***

## Rate limits

The App Events API has a rate limit of 500 requests per second per app. After the limit is exceeded, all requests are throttled.

## {} Response

```json
HTTP/1.1 429 Too Many Requests
{
  "success": false,
  "error": "Rate limit exceeded"
}
```

***
