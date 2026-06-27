import { Worker, type Job } from "bullmq";
import { Redis } from "ioredis";
import { loadConfig } from "./config.js";
import { createPool } from "./db/client.js";
import {
  HISTORICAL_SYNC_QUEUE,
  PARTNER_POLL_QUEUE,
  redisConnection,
  type HistoricalSyncJob,
  type SubscriptionPollJob,
} from "./queues.js";
import { pollActiveSubscription, syncHistoricalEvents } from "./partner/service.js";

const config = loadConfig();
const pool = createPool(config.DATABASE_URL);
const redis = new Redis(config.REDIS_URL, { maxRetriesPerRequest: null });
const connection = redisConnection(config.REDIS_URL);

const pollWorker = new Worker<SubscriptionPollJob>(
  PARTNER_POLL_QUEUE,
  async (job: Job<SubscriptionPollJob>) => {
    const subscription = await pollActiveSubscription(pool, redis, config, job.data);
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

for (const worker of [pollWorker, historicalWorker]) {
  worker.on("completed", (job) => console.log(JSON.stringify({ event: "job.completed", queue: worker.name, jobId: job.id })));
  worker.on("failed", (job, error) => console.error(JSON.stringify({
    event: "job.failed",
    queue: worker.name,
    jobId: job?.id,
    attempt: job?.attemptsMade,
    error: error.message,
  })));
}

async function shutdown(signal: string) {
  console.log(JSON.stringify({ event: "worker.shutdown", signal }));
  await Promise.all([pollWorker.close(), historicalWorker.close()]);
  await Promise.all([pool.end(), redis.quit()]);
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
