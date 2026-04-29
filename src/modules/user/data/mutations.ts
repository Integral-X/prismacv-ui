import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { env } from '@/shared/config/env';
import { HttpError } from '@/shared/http/http-error';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type {
  AvatarUploadResponseContract,
  UpdateProfileRequest,
  UserProfileResponseContract,
} from './contracts';
import { toUserProfile, type UserProfile } from './mappers';

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
