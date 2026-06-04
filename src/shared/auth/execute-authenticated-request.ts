import 'server-only';

import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';

interface ExecuteAuthenticatedRequestOptions {
  /**
   * When true, refresh/clear flows update httpOnly cookies (Server Actions /
   * mutations). When false, tokens are refreshed in-memory only so RSC reads
   * do not violate Next.js cookie mutation rules.
   */
  mutateSession?: boolean;
}

async function refreshSessionAndGetAccessToken(
  mutateSession: boolean
): Promise<string> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    if (mutateSession) {
      await clearAuthSession();
    }
    throw new HttpError(401, 'Unauthorized', 'Authentication required');
  }

  try {
    const { refreshUserToken } = await import('@/modules/auth/data/mutations');
    const refreshedSession = await refreshUserToken({ refreshToken });

    if (mutateSession) {
      await persistAuthSession(refreshedSession, await shouldPersistSession());
    }

    return refreshedSession.accessToken;
  } catch (error) {
    if (mutateSession) {
      await clearAuthSession();
    }
    throw error;
  }
}

async function executeAuthenticatedRequestInternal<T>(
  operation: (headers: Record<string, string>) => Promise<T>,
  options: ExecuteAuthenticatedRequestOptions
): Promise<T> {
  const mutateSession = options.mutateSession ?? false;
  let accessToken = await getAccessToken();

  if (!accessToken) {
    accessToken = await refreshSessionAndGetAccessToken(mutateSession);
  }

  try {
    return await operation({ Authorization: `Bearer ${accessToken}` });
  } catch (error) {
    if (!(error instanceof HttpError) || !error.isUnauthorized) {
      throw error;
    }

    const refreshedAccessToken =
      await refreshSessionAndGetAccessToken(mutateSession);

    return await operation({
      Authorization: `Bearer ${refreshedAccessToken}`,
    });
  }
}

/** Server reads (RSC, queries) — never mutates cookies. */
export async function executeAuthenticatedRead<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  return executeAuthenticatedRequestInternal(operation, {
    mutateSession: false,
  });
}

/** Writes and Server Actions — may refresh or clear the session cookies. */
export async function executeAuthenticatedRequest<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  return executeAuthenticatedRequestInternal(operation, {
    mutateSession: true,
  });
}
