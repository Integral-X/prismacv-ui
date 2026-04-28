import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';
import { refreshUserToken } from '@/modules/auth/data/mutations';
import type { UserProfileResponseContract } from './contracts';
import { toUserProfile, type UserProfile } from './mappers';

async function executeAuthenticatedRequest<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new HttpError(401, 'Unauthorized', 'Authentication required');
  }

  try {
    return await operation({
      Authorization: `Bearer ${accessToken}`,
    });
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
      const refreshedSession = await refreshUserToken({
        refreshToken,
      });

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

export async function getCurrentUser(): Promise<UserProfile> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<UserProfileResponseContract>(
      'users/me',
      { headers }
    );

    return toUserProfile(contract);
  });
}
