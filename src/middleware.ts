import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected route prefixes
const PROTECTED_PREFIXES = [
  '/onboarding',
  '/dashboard',
  '/cv',
  '/settings',
  '/ats-scorer',
  '/jobs',
  '/skills',
  '/interview',
  '/cover-letters',
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) return NextResponse.next();

  // Check for access-token cookie
  const accessToken = request.cookies.get('access-token')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    const redirectPath = pathname + request.nextUrl.search;
    loginUrl.searchParams.set('redirect', redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, api, and _next
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
