# @openmantle/sdk

```ts
import { OpenMantle } from "@openmantle/sdk";

const mantle = new OpenMantle({
  apiKey: process.env.OPENMANTLE_API_KEY!,
  baseUrl: "https://billing.example.com",
});

await mantle.trackUsage({
  shopId: "openmantle-shop-uuid",
  meterKey: "sms_sent",
  quantity: 1,
  idempotencyKey: "sms-123",
});
```

`onPlanChange()` provides a polling helper for client applications. For server-to-server notification, configure OpenMantle's signed outbound webhooks instead.
