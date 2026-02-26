/**
 * Backend API Endpoints
 * Constants for external backend service API paths
 * These are the actual backend API routes (not Next.js internal routes)
 */

export const BACKEND_API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
} as const;
