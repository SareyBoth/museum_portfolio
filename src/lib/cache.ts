import 'server-only';
import { redis } from './redis';

/**
 * Read-through JSON cache helper.
 * Falls through to the fetcher if Redis is unreachable.
 */
export async function cachedJson<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // Redis unreachable - fall through to fetcher
  }

  const data = await fetcher();

  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch {
    // Redis write failed - non-fatal
  }

  return data;
}

/** Cache keys used across the app */
export const CACHE_KEYS = {
  portfolio: 'portfolio:v1:full',
  session: (tokenHash: string) => `session:v1:${tokenHash}`,
} as const;

export const CACHE_TTL = {
  portfolio: 3600, // 1 hour
  session: 900, // 15 minutes
} as const;

/**
 * Invalidate the portfolio cache in Redis.
 * Next.js tag revalidation should be called separately at the call site.
 */
export async function invalidatePortfolioCache(): Promise<void> {
  try {
    await redis.del(CACHE_KEYS.portfolio);
  } catch {
    // Redis unreachable - non-fatal
  }
}
