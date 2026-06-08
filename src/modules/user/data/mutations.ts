import 'server-only';

import { apiClient } from '@/shared/http/api-client';
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
    const contract = await apiClient.postFormData<AvatarUploadResponseContract>(
      'users/me/avatar',
      formData,
      { headers }
    );
    return contract.avatarUrl;
  });
}

export async function deleteAccount(): Promise<void> {
  return executeAuthenticatedRequest(async (headers) => {
    await apiClient.delete<void>('users/me', { headers });
  });
}
