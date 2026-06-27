import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://redis:6379", { lazyConnect: true, maxRetriesPerRequest: 1 });
try {
  await redis.connect();
  await redis.ping();
  await redis.quit();
  process.exit(0);
} catch {
  redis.disconnect();
  process.exit(1);
}
