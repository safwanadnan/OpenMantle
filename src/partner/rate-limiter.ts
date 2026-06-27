import type { Redis } from "ioredis";

const SLIDING_WINDOW_SCRIPT = `
local redis_time = redis.call('TIME')
local now = (tonumber(redis_time[1]) * 1000) + math.floor(tonumber(redis_time[2]) / 1000)
local cutoff = now - tonumber(ARGV[2])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', cutoff)
local count = redis.call('ZCARD', KEYS[1])
if count < tonumber(ARGV[1]) then
  redis.call('ZADD', KEYS[1], now, tostring(now) .. ':' .. ARGV[3])
  redis.call('PEXPIRE', KEYS[1], tonumber(ARGV[2]) + 100)
  return {1, 0}
end
local earliest = redis.call('ZRANGE', KEYS[1], 0, 0, 'WITHSCORES')
local wait = tonumber(earliest[2]) + tonumber(ARGV[2]) - now
return {0, math.max(wait, 1)}
`;

export class PartnerRateLimiter {
  constructor(
    private readonly redis: Redis,
    private readonly requestsPerSecond = 3,
  ) {}

  async acquire(credentialId: string): Promise<void> {
    for (;;) {
      const key = `openmantle:partner-rate:${credentialId}`;
      const member = `${process.pid}-${crypto.randomUUID()}`;
      const result = await this.redis.eval(SLIDING_WINDOW_SCRIPT, 1, key, this.requestsPerSecond, 1_000, member) as [number, number];
      if (Number(result[0]) === 1) return;
      const waitMs = Math.max(Number(result[1]), 25) + Math.floor(Math.random() * 25);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}
