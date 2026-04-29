import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type { UserProfileResponseContract } from './contracts';
import { toUserProfile, type UserProfile } from './mappers';

export async function getCurrentUser(): Promise<UserProfile> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<UserProfileResponseContract>(
      'users/me',
      { headers }
    );

    return toUserProfile(contract);
  });
}
