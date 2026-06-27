import { Worker } from "bullmq";
import { loadConfig } from "./config.js";

const config = loadConfig();
const redisUrl = new URL(config.REDIS_URL);
const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  tls: redisUrl.protocol === "rediss:" ? {} : undefined,
};
const worker = new Worker(
  "openmantle-system",
  async (job) => {
    if (job.name === "heartbeat") return { processedAt: new Date().toISOString() };
    throw new Error(`Unknown system job: ${job.name}`);
  },
  { connection },
);

worker.on("completed", (job) => console.log(JSON.stringify({ event: "job.completed", jobId: job.id })));
worker.on("failed", (job, error) => console.error(JSON.stringify({ event: "job.failed", jobId: job?.id, error: error.message })));

async function shutdown() {
  await worker.close();
  process.exit(0);
}
process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());
