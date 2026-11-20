import 'server-only';
import { connection } from 'next/server';
import { randomBytes, createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { adminUsers, adminSessions } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { CACHE_KEYS, CACHE_TTL } from './cache';
import { redis } from './redis';
import { hashPassword, verifyPassword } from './password';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Create a new session for an admin user.
 * Stores the SHA-256 hash of the token in the DB and Redis; sets the raw token in an httpOnly cookie.
 */
export async function createSession(
  userId: number,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const token = randomBytes(32).toString('hex');
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(adminSessions).values({
    userId,
    tokenHash,
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
    expiresAt,
  });

  // Cache session in Redis
  try {
    await redis.set(
      CACHE_KEYS.session(tokenHash),
      JSON.stringify({ userId, expiresAt: expiresAt.toISOString() }),
      'EX',
      CACHE_TTL.session
    );
  } catch {
    // non-fatal
  }

  const cookieStore = await cookies();
  const isHttps = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL?.startsWith('http://');
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

interface AdminInfo {
  id: number;
  email: string;
  name: string;
}

/**
 * Get the current admin from the session cookie.
 * Returns null if no valid session exists.
 */
export async function getCurrentAdmin(): Promise<AdminInfo | null> {
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = sha256(token);

  // Check Redis cache first
  try {
    const cached = await redis.get(CACHE_KEYS.session(tokenHash));
    if (cached) {
      const { userId, expiresAt } = JSON.parse(cached);
      if (new Date(expiresAt) > new Date()) {
        const [user] = await db
          .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name })
          .from(adminUsers)
          .where(eq(adminUsers.id, userId))
          .limit(1);
        if (user) return user;
      }
    }
  } catch {
    // Fall through to DB
  }

  // Check DB
  const [session] = await db
    .select()
    .from(adminSessions)
    .where(
      and(
        eq(adminSessions.tokenHash, tokenHash),
        gt(adminSessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!session) return null;

  // Update lastActiveAt
  await db
    .update(adminSessions)
    .set({ lastActiveAt: new Date() })
    .where(eq(adminSessions.id, session.id));

  // Refresh Redis cache
  try {
    await redis.set(
      CACHE_KEYS.session(tokenHash),
      JSON.stringify({
        userId: session.userId,
        expiresAt: session.expiresAt.toISOString(),
      }),
      'EX',
      CACHE_TTL.session
    );
  } catch {
    // non-fatal
  }

  const [user] = await db
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.userId))
    .limit(1);

  return user || null;
}

/**
 * Require an authenticated admin. Throws if not authenticated.
 */
export async function requireAdmin(): Promise<AdminInfo> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Unauthorized');
  }
  return admin;
}

/**
 * Revoke the current session (logout).
 */
export async function revokeSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return;

  const tokenHash = sha256(token);

  // Delete from DB
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash));

  // Delete from Redis
  try {
    await redis.del(CACHE_KEYS.session(tokenHash));
  } catch {
    // non-fatal
  }

  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Revoke all sessions except the current one.
 */
export async function revokeOtherSessions(): Promise<number> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return 0;

  const tokenHash = sha256(token);
  const admin = await getCurrentAdmin();
  if (!admin) return 0;

  // Get all other sessions
  const otherSessions = await db
    .select({ id: adminSessions.id, tokenHash: adminSessions.tokenHash })
    .from(adminSessions)
    .where(eq(adminSessions.userId, admin.id));

  let revoked = 0;
  for (const session of otherSessions) {
    if (session.tokenHash !== tokenHash) {
      await db.delete(adminSessions).where(eq(adminSessions.id, session.id));
      try {
        await redis.del(CACHE_KEYS.session(session.tokenHash));
      } catch {
        // non-fatal
      }
      revoked++;
    }
  }

  return revoked;
}

/**
 * Change admin password. Verifies old password first.
 */
export async function changeAdminPassword(
  adminId: number,
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, adminId))
    .limit(1);

  if (!user) return false;

  const valid = await verifyPassword(oldPassword, user.passwordHash);
  if (!valid) return false;

  const newHash = await hashPassword(newPassword);
  await db
    .update(adminUsers)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(adminUsers.id, adminId));

  return true;
}
