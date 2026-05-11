import 'server-only';

import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';

async function refreshSessionAndGetAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthSession();
    throw new HttpError(401, 'Unauthorized', 'Authentication required');
  }

  try {
    const { refreshUserToken } = await import('@/modules/auth/data/mutations');
    const refreshedSession = await refreshUserToken({ refreshToken });

    await persistAuthSession(refreshedSession, await shouldPersistSession());

    return refreshedSession.accessToken;
  } catch (error) {
    await clearAuthSession();
    throw error;
  }
}

export async function executeAuthenticatedRequest<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  let accessToken = await getAccessToken();

  if (!accessToken) {
    accessToken = await refreshSessionAndGetAccessToken();
  }

  try {
    return await operation({ Authorization: `Bearer ${accessToken}` });
  } catch (error) {
    if (!(error instanceof HttpError) || !error.isUnauthorized) {
      throw error;
    }

    const refreshedAccessToken = await refreshSessionAndGetAccessToken();

    return await operation({
      Authorization: `Bearer ${refreshedAccessToken}`,
    });
  }
}
