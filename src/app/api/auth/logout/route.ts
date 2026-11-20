import { NextResponse } from 'next/server';
import { revokeSession } from '@/lib/auth';

export async function POST() {
  await revokeSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  });
  return res;
}
