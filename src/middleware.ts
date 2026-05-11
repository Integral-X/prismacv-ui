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

// Guest-only routes — redirect authenticated users away from these
const GUEST_ONLY_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access-token')?.value;
  const refreshToken = request.cookies.get('refresh-token')?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  // Redirect authenticated users away from guest-only pages
  if (isAuthenticated && GUEST_ONLY_ROUTES.some((r) => pathname === r)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if the route is protected
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) return NextResponse.next();

  // A valid session can be recovered from refresh-token when access-token is absent.
  if (!accessToken && !refreshToken) {
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
