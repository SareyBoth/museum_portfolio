import 'server-only';
import { redis } from './redis';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Atomic Redis INCR + EXPIRE rate limiter.
 * Falls through (allows) if Redis is unreachable.
 */
async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);
    const retryAfterSeconds = ttl > 0 ? ttl : windowSeconds;

    if (current > maxAttempts) {
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    return {
      allowed: true,
      remaining: maxAttempts - current,
      retryAfterSeconds: 0,
    };
  } catch {
    // Redis unreachable - allow the request
    return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
  }
}

/**
 * Login rate limiter: max 5 failed attempts per 15 minutes per IP+email.
 * Reset on successful login by calling resetLoginLimit.
 */
export async function checkLoginLimit(
  ip: string,
  email: string
): Promise<RateLimitResult> {
  const key = `rl:login:${ip}:${email.toLowerCase()}`;
  return checkRateLimit(key, 5, 15 * 60);
}

export async function resetLoginLimit(ip: string, email: string): Promise<void> {
  try {
    const key = `rl:login:${ip}:${email.toLowerCase()}`;
    await redis.del(key);
  } catch {
    // non-fatal
  }
}

/**
 * Contact form rate limiter: max 5 submissions per hour per IP.
 */
export async function checkContactLimit(ip: string): Promise<RateLimitResult> {
  const key = `rl:contact:${ip}`;
  return checkRateLimit(key, 5, 60 * 60);
}

/**
 * Extract the real client IP from trusted proxy headers.
 * Prefers cf-connecting-ip (Cloudflare), then falls back to x-forwarded-for first hop.
 */
export function getClientIp(headers: Headers): string {
  // Cloudflare sets this header to the actual client IP
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  // x-forwarded-for: client, proxy1, proxy2
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const firstIp = xff.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  return '127.0.0.1';
}
