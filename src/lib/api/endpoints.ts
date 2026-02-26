/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all backend services
 */

/**
 * Get API base URL from environment variables.
 * Required in all environments so BFF route handlers can proxy to the backend.
 * Returning empty string would make fetch() use same-origin URLs and break auth.
 */
function getApiBaseUrl(service: string): string {
  const envKey = `NEXT_PUBLIC_${service.toUpperCase()}_API_URL`;
  const url = process.env[envKey];

  if (!url || url.trim() === '') {
    throw new Error(
      `Missing environment variable: ${envKey}. Required for backend proxy. Add it to .env.local (development) or your production environment.`
    );
  }

  return url.replace(/\/$/, ''); // strip trailing slash for consistent URL building
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
