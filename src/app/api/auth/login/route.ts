import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/auth';
import { checkLoginLimit, resetLoginLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // CSRF / Origin validation
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }
  }

  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const { email, password } = body as { email: string; password: string };
  const ip = getClientIp(request.headers);

  // Rate limit check
  const limit = await checkLoginLimit(ip, email);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many login attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      }
    );
  }

  // Find user
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Verify password
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Reset rate limit on success
  await resetLoginLimit(ip, email);

  // Create session
  const userAgent = request.headers.get('user-agent') || undefined;
  await createSession(user.id, ip, userAgent);

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
}
