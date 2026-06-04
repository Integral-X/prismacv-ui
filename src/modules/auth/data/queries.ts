import 'server-only';

import { cookies } from 'next/headers';
import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRead } from '@/shared/auth/execute-authenticated-request';
import {
  parseUserProfileFromJson,
  toUserProfile,
  type UserProfile,
} from './mappers';
import type { UserProfileContract } from './contracts';

/**
 * Returns the current authenticated user's profile from the session cookie,
 * or null if the user is not logged in.
 *
 * Fast (no network). Suitable for display-only use cases such as the app
 * shell, navbar, and dashboard headers. Do NOT use for authorization
 * decisions — the cookie is populated client-side during OAuth and its
 * `role` field is unverified. Use `getVerifiedCurrentUser()` instead.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('user-profile')?.value;

  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return parseUserProfileFromJson(parsed);
  } catch {
    return null;
  }
}

/**
 * Returns true if there is an active session (access token cookie present).
 * Does not validate the token against the backend.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has('access-token');
}

/**
 * Fetches the current user's profile directly from the backend and returns
 * it, or null if unauthenticated or the request fails.
 *
 * Use this wherever the result is used for an authorization decision
 * (e.g. role-gating a route) — the backend validates the JWT and returns
 * the authoritative role, so the response cannot be forged client-side.
 *
 * Avoid calling this on every page render — reserve it for server-side
 * gates where trust matters, not display-only data.
 */
export async function getVerifiedCurrentUser(): Promise<UserProfile | null> {
  try {
    return await executeAuthenticatedRead(async (headers) => {
      const contract = await apiClient.get<UserProfileContract>('users/me', {
        headers,
      });
      return toUserProfile(contract);
    });
  } catch {
    return null;
  }
}
