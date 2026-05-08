import 'server-only';

import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import { apiClient } from '@/shared/http/api-client';
import type { BillingProfileContract } from './contracts';
import { toBillingProfile, type BillingProfile } from './mappers';

export async function getBillingProfile(): Promise<BillingProfile> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<BillingProfileContract>('billing/me', {
      headers,
    });
    return toBillingProfile(contract);
  });
}
