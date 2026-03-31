/**
 * Auth Constants
 * Centralized constants for authentication configuration
 */

// Cookie expiration time (in seconds)
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Max wait for backend auth calls from BFF route handlers (ms) */
export const AUTH_BACKEND_FETCH_TIMEOUT_MS = 10_000;
