/**
 * Simple in-memory rate limiter
 * Uses sliding window algorithm to track requests per IP
 *
 * Note: This is a single-instance rate limiter. For multi-instance deployments,
 * consider using Redis-based rate limiting (e.g., @upstash/ratelimit)
 */

import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries every 5 minutes
 */
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

/**
 * Get client IP from request
 */
function getClientIP(request: Request): string {
  // Try to get IP from various headers (for proxy/load balancer scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a default key (not ideal, but better than nothing)
  return 'unknown';
}

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number;
  /**
   * Time window in milliseconds
   */
  windowMs: number;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;
  /**
   * Number of requests remaining in the current window
   */
  remaining: number;
  /**
   * Time when the rate limit resets (milliseconds since epoch)
   */
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param request - The incoming request
 * @param options - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  request: Request,
  options: RateLimitOptions
): RateLimitResult {
  const { maxRequests, windowMs } = options;
  const clientIP = getClientIP(request);
  const now = Date.now();
  const key = clientIP;

  const entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Increment count
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Create a rate limit middleware function for API routes
 */
export function createRateLimitMiddleware(options: RateLimitOptions) {
  return (request: Request): RateLimitResult => {
    return rateLimit(request, options);
  };
}

/**
 * Rate limit configuration options
 */
export interface RateLimitConfig extends RateLimitOptions {
  /**
   * Custom error message when rate limit is exceeded
   * @default 'Too many requests. Please try again later.'
   */
  errorMessage?: string;
}

/**
 * Check rate limit and return NextResponse if exceeded, null if allowed
 * This is a convenience function for Next.js API routes
 *
 * @param request - The incoming NextRequest
 * @param config - Rate limit configuration
 * @returns NextResponse with 429 status if rate limited, null if allowed
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): NextResponse | null {
  const {
    errorMessage = 'Too many requests. Please try again later.',
    ...options
  } = config;

  const result = rateLimit(request, options);

  if (!result.allowed) {
    const resetSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);

    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: errorMessage,
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': resetSeconds.toString(),
          'X-RateLimit-Limit': options.maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        },
      }
    );
  }

  return null;
}
