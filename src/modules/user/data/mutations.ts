import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { env } from '@/shared/config/env';
import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';
import { refreshUserToken } from '@/modules/auth/data/mutations';
import type {
  AvatarUploadResponseContract,
  UpdateProfileRequest,
  UserProfileResponseContract,
} from './contracts';
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

export async function updateProfile(
  body: UpdateProfileRequest
): Promise<UserProfile> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.patch<
      UserProfileResponseContract,
      UpdateProfileRequest
    >('users/me', body, { headers });

    return toUserProfile(contract);
  });
}

export async function uploadAvatar(file: File): Promise<string> {
  return executeAuthenticatedRequest(async (headers) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const url = `${env.apiBaseUrl}users/me/avatar`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: headers.Authorization,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = (await response.json()) as {
        error?: string;
        message?: string;
      };
      throw new HttpError(
        response.status,
        errorBody.error ?? response.statusText,
        errorBody.message
      );
    }

    const json = (await response.json()) as {
      data: AvatarUploadResponseContract;
    };
    return json.data.avatarUrl;
  });
}

export async function deleteAccount(): Promise<void> {
  return executeAuthenticatedRequest(async (headers) => {
    await apiClient.delete<void>('users/me', { headers });
  });
}
