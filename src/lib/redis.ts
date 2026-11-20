import 'server-only';
import Redis from 'ioredis';

declare global {
  var _redis: Redis | undefined;
}

function createRedisClient(): Redis {
  if (globalThis._redis) return globalThis._redis;

  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 5) return null; // stop retrying
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  client.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
  });

  if (process.env.NODE_ENV !== 'production') {
    globalThis._redis = client;
  }

  return client;
}

export const redis = createRedisClient();

/** Health check returning ok status and latency in ms */
export async function pingRedis(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = performance.now();
  try {
    await redis.ping();
    return { ok: true, latencyMs: Math.round(performance.now() - start) };
  } catch {
    return { ok: false, latencyMs: Math.round(performance.now() - start) };
  }
}
