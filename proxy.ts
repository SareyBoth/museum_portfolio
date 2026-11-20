import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guard /dashboard/* - optimistic cookie presence check
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Do NOT redirect /login to /dashboard based on cookie presence.
  // Session validity is checked inside app/login/page.tsx to prevent
  // infinite redirect loops with expired/revoked sessions.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
