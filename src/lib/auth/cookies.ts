/**
 * Auth Cookie Utilities
 * Centralized cookie handling for authentication tokens
 */

import { cookies } from 'next/headers';

const AUTH_TOKEN_COOKIE_NAME = 'auth-token';

/**
 * Get the auth token from cookies
 * @returns The JWT token string, or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value ?? null;
}

/**
 * Set the auth token in cookies
 * @param token - The JWT token to store
 */
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Delete the auth token from cookies
 */
export async function deleteAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
}
