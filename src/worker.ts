import { Queue, Worker, type Job } from "bullmq";
import { Redis } from "ioredis";
import { loadConfig } from "./config.js";
import { createPool } from "./db/client.js";
import {
  HISTORICAL_SYNC_QUEUE,
  PARTNER_POLL_QUEUE,
  USAGE_FORWARD_QUEUE,
  WEBHOOK_DELIVERY_QUEUE,
  redisConnection,
  type HistoricalSyncJob,
  type SubscriptionPollJob,
  type UsageForwardJob,
  type WebhookDeliveryJob,
} from "./queues.js";
import { pollActiveSubscription, syncHistoricalEvents } from "./partner/service.js";
import { deadLetterUsageGroup, forwardUsageBatch } from "./app-events/service.js";
import { dispatchWebhookBatch } from "./webhooks/service.js";

const config = loadConfig();
const pool = createPool(config.DATABASE_URL);
const redis = new Redis(config.REDIS_URL, { maxRetriesPerRequest: null });
const connection = redisConnection(config.REDIS_URL);
const usageQueue = new Queue<UsageForwardJob>(USAGE_FORWARD_QUEUE, { connection });
const webhookQueue = new Queue<WebhookDeliveryJob>(WEBHOOK_DELIVERY_QUEUE, { connection });

const pollWorker = new Worker<SubscriptionPollJob>(
  PARTNER_POLL_QUEUE,
  async (job: Job<SubscriptionPollJob>) => {
    const subscription = await pollActiveSubscription(pool, redis, config, job.data, { webhookDelivery: webhookQueue });
    return { status: subscription ? "active" : "none", observedAt: new Date().toISOString() };
  },
  { connection, concurrency: 20 },
);

const historicalWorker = new Worker<HistoricalSyncJob>(
  HISTORICAL_SYNC_QUEUE,
  async (job: Job<HistoricalSyncJob>) => {
    const inserted = await syncHistoricalEvents(pool, redis, config, job.data);
    return { inserted, syncedAt: new Date().toISOString() };
  },
  { connection, concurrency: 5 },
);

const usageWorker = new Worker<UsageForwardJob>(
  USAGE_FORWARD_QUEUE,
  async (job: Job<UsageForwardJob>) => {
    const result = await forwardUsageBatch(pool, redis, config, job.data);
    if (result.hasMore) {
      await usageQueue.add("forward", job.data, {
        attempts: 6,
        backoff: { type: "exponential", delay: 1_000 },
        removeOnComplete: { age: 86_400, count: 1_000 },
        removeOnFail: false,
      });
    }
    return { ...result, forwardedAt: new Date().toISOString() };
  },
  { connection, concurrency: 20 },
);

const webhookWorker = new Worker<WebhookDeliveryJob>(
  WEBHOOK_DELIVERY_QUEUE,
  async (job: Job<WebhookDeliveryJob>) => ({
    ...await dispatchWebhookBatch(pool, config, job.data.organizationId),
    dispatchedAt: new Date().toISOString(),
  }),
  { connection, concurrency: 10 },
);

for (const worker of [pollWorker, historicalWorker, usageWorker, webhookWorker]) {
  worker.on("completed", (job) => console.log(JSON.stringify({ event: "job.completed", queue: worker.name, jobId: job.id })));
  worker.on("failed", (job, error) => console.error(JSON.stringify({
    event: "job.failed",
    queue: worker.name,
    jobId: job?.id,
    attempt: job?.attemptsMade,
    error: error.message,
  })));
}

usageWorker.on("failed", (job, error) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
    void deadLetterUsageGroup(pool, job.data, job.id, error, job.attemptsMade).catch((failure) => {
      console.error(JSON.stringify({ event: "dead-letter.failed", jobId: job.id, error: failure.message }));
    });
  }
});

async function shutdown(signal: string) {
  console.log(JSON.stringify({ event: "worker.shutdown", signal }));
  await Promise.all([
    pollWorker.close(), historicalWorker.close(), usageWorker.close(), webhookWorker.close(), usageQueue.close(), webhookQueue.close(),
  ]);
  await Promise.all([pool.end(), redis.quit()]);
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
