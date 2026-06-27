import { createHash } from "node:crypto";
import { Queue } from "bullmq";
import type { Config } from "./config.js";

export const PARTNER_POLL_QUEUE = "partner-api-poll";
export const HISTORICAL_SYNC_QUEUE = "historical-events-sync";
export const USAGE_FORWARD_QUEUE = "usage-forward";
export const WEBHOOK_DELIVERY_QUEUE = "webhook-delivery";

export interface SubscriptionPollJob {
  organizationId: string;
  credentialId: string;
  appId: string;
  shopId: string;
}

export interface HistoricalSyncJob {
  organizationId: string;
  credentialId: string;
}

export interface UsageForwardJob {
  organizationId: string;
  shopId: string;
  meterId: string;
}

export interface WebhookDeliveryJob {
  organizationId: string;
}

export function redisConnection(urlValue: string) {
  const url = new URL(urlValue);
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    tls: url.protocol === "rediss:" ? {} : undefined,
  };
}

export function createQueues(config: Config) {
  const connection = redisConnection(config.REDIS_URL);
  return {
    partnerPoll: new Queue<SubscriptionPollJob>(PARTNER_POLL_QUEUE, { connection }),
    historicalSync: new Queue<HistoricalSyncJob>(HISTORICAL_SYNC_QUEUE, { connection }),
    usageForward: new Queue<UsageForwardJob>(USAGE_FORWARD_QUEUE, { connection }),
    webhookDelivery: new Queue<WebhookDeliveryJob>(WEBHOOK_DELIVERY_QUEUE, { connection }),
  };
}

export async function scheduleWebhookDispatch(
  queues: Pick<OpenMantleQueues, "webhookDelivery">,
  config: Config,
  organizationId: string,
): Promise<void> {
  await queues.webhookDelivery.upsertJobScheduler(
    `webhooks:${organizationId}`,
    { every: config.WEBHOOK_DISPATCH_INTERVAL_MS, offset: stableOffset(organizationId, config.WEBHOOK_DISPATCH_INTERVAL_MS) },
    { name: "dispatch", data: { organizationId }, opts: standardJobOptions() },
  );
  await queues.webhookDelivery.add("dispatch", { organizationId }, {
    ...standardJobOptions(),
    jobId: `webhooks-${organizationId}-${Date.now()}`,
  });
}

export async function scheduleUsageForward(
  queues: OpenMantleQueues,
  config: Config,
  data: UsageForwardJob,
): Promise<void> {
  const bucket = Math.floor(Date.now() / Math.max(config.USAGE_FORWARD_DELAY_MS, 1));
  await queues.usageForward.add("forward", data, {
    ...standardJobOptions(),
    delay: config.USAGE_FORWARD_DELAY_MS,
    jobId: `usage-${data.shopId}-${data.meterId}-${bucket}`,
  });
}

export type OpenMantleQueues = ReturnType<typeof createQueues>;

export async function scheduleSubscriptionPoll(
  queues: OpenMantleQueues,
  config: Config,
  data: SubscriptionPollJob,
): Promise<void> {
  const schedulerId = `subscription:${data.shopId}`;
  await queues.partnerPoll.upsertJobScheduler(
    schedulerId,
    { every: config.SUBSCRIPTION_POLL_INTERVAL_MS, offset: stableOffset(data.shopId, config.SUBSCRIPTION_POLL_INTERVAL_MS) },
    { name: "poll", data, opts: standardJobOptions() },
  );
  await queues.partnerPoll.add("poll", data, { ...standardJobOptions(), jobId: `initial-${data.shopId}-${Date.now()}` });
}

export async function scheduleHistoricalSync(
  queues: OpenMantleQueues,
  config: Config,
  data: HistoricalSyncJob,
): Promise<void> {
  await queues.historicalSync.upsertJobScheduler(
    `historical:${data.credentialId}`,
    { every: config.HISTORICAL_SYNC_INTERVAL_MS, offset: stableOffset(data.credentialId, config.HISTORICAL_SYNC_INTERVAL_MS) },
    { name: "sync", data, opts: standardJobOptions() },
  );
  await queues.historicalSync.add("sync", data, { ...standardJobOptions(), jobId: `initial-${data.credentialId}-${Date.now()}` });
}

function standardJobOptions() {
  return {
    attempts: 6,
    backoff: { type: "exponential" as const, delay: 1_000 },
    removeOnComplete: { age: 86_400, count: 1_000 },
    removeOnFail: false,
  };
}

function stableOffset(value: string, interval: number): number {
  const hash = createHash("sha256").update(value).digest().readUInt32BE(0);
  return hash % interval;
}
