/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all backend services
 */

/**
 * Get API base URL from environment variables
 * Falls back to relative URLs in production (same-origin)
 */
function getApiBaseUrl(service: string): string {
  const envKey = `NEXT_PUBLIC_${service.toUpperCase()}_API_URL`;
  const url = process.env[envKey];

  if (!url) {
    // In production, use relative URLs (same-origin)
    if (process.env.NODE_ENV === 'production') {
      return '';
    }
    // In development, throw error if not configured
    throw new Error(
      `Missing environment variable: ${envKey}. Please add it to your .env.local file.`
    );
  }

  return url;
}

/**
 * Backend Service Base URLs
 */
export const API_ENDPOINTS = {
  // Main backend API (your primary service)
  MAIN: getApiBaseUrl('MAIN'),
} as const;

/**
 * Internal Next.js API Routes (BFF Layer)
 * These are the routes your frontend components should call
 */
export const INTERNAL_API_ROUTES = {
  // Auth endpoints
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
  },

  // Health check
  health: '/api/health',
} as const;
