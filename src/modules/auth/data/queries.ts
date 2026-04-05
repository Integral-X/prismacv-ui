import { cookies } from 'next/headers';
import type { UserProfile } from './mappers';

/**
 * Returns the current authenticated user's profile from the session cookie,
 * or null if the user is not logged in.
 *
 * This reads from the httpOnly cookie set by the login Server Action.
 * No network call is made — the profile is stored alongside the token
 * on successful authentication.
 *
 * When the backend exposes a /auth/user/me endpoint, replace this with
 * a direct apiClient call using readAuthHeader().
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('user-profile')?.value;

  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
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
