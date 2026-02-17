/**
 * Next.js 16 Proxy Layer
 * Replaces middleware.ts - handles security headers, CSP with nonces, and request routing
 *
 * Security Headers:
 * - Content-Security-Policy (CSP) with nonce-based script execution
 * - Strict-Transport-Security (HSTS)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 * - X-XSS-Protection (legacy, but still useful)
 */

import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure nonce for CSP
 */
function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Build Content-Security-Policy header with nonce
 */
function buildCSP(nonce: string, isDev: boolean): string {
  const apiUrl = process.env.NEXT_PUBLIC_MAIN_API_URL || '';
  const scriptSrc = `'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}`;
  const connectSrc = `'self'${apiUrl ? ` ${apiUrl}` : ''}`;

  const baseDirectives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`, // unsafe-eval needed for React dev tools in development
    "style-src 'self' 'unsafe-inline'", // Next.js requires unsafe-inline for styles
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'", // Prevents clickjacking (replaces X-Frame-Options)
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests', // Force HTTPS
  ];

  return baseDirectives.join('; ');
}

/**
 * Proxy function - intercepts all requests to apply security headers
 */
export function proxy() {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  // Build CSP with nonce
  const csp = buildCSP(nonce, isDev);

  // Create response (or pass through if needed)
  const response = NextResponse.next();

  // Set security headers
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()', // Disable FLoC
    ].join(', ')
  );

  // Legacy XSS protection (still useful for older browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // HSTS - only in production with HTTPS
  if (isProduction) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Pass nonce to the application via a custom header
  // This allows layout.tsx to read it and pass to Script components if needed
  response.headers.set('x-nonce', nonce);

  return response;
}

/**
 * Configure which routes the proxy should run on
 * By default, runs on all routes except static files and API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (metadata files)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
