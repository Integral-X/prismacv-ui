/**
 * Rate Limit Configuration Constants
 * Centralized rate limit settings for API routes
 */

// Time constants (in milliseconds)
export const RATE_LIMIT_WINDOWS = {
  ONE_MINUTE: 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
} as const;

// Auth endpoint rate limits
export const AUTH_RATE_LIMITS = {
  LOGIN: {
    maxRequests: 5,
    windowMs: RATE_LIMIT_WINDOWS.FIFTEEN_MINUTES,
    errorMessage: 'Too many login attempts. Please try again later.',
  },
  LOGOUT: {
    maxRequests: 10,
    windowMs: RATE_LIMIT_WINDOWS.ONE_MINUTE,
  },
  ME: {
    maxRequests: 30,
    windowMs: RATE_LIMIT_WINDOWS.ONE_MINUTE,
  },
} as const;
