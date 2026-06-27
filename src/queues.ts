import { createHash } from "node:crypto";
import { Queue } from "bullmq";
import type { Config } from "./config.js";

export const PARTNER_POLL_QUEUE = "partner-api-poll";
export const HISTORICAL_SYNC_QUEUE = "historical-events-sync";

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
  };
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
