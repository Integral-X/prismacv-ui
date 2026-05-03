import 'server-only';

import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';

export async function executeAuthenticatedRequest<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new HttpError(401, 'Unauthorized', 'Authentication required');
  }

  try {
    return await operation({ Authorization: `Bearer ${accessToken}` });
  } catch (error) {
    if (!(error instanceof HttpError) || !error.isUnauthorized) {
      throw error;
    }

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearAuthSession();
      throw error;
    }

    try {
      const { refreshUserToken } =
        await import('@/modules/auth/data/mutations');
      const refreshedSession = await refreshUserToken({ refreshToken });

      await persistAuthSession(refreshedSession, await shouldPersistSession());

      return await operation({
        Authorization: `Bearer ${refreshedSession.accessToken}`,
      });
    } catch (refreshError) {
      await clearAuthSession();
      throw refreshError;
    }
  }
}
