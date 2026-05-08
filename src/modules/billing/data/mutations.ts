import 'server-only';

import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import { apiClient } from '@/shared/http/api-client';
import type {
  CheckoutSessionContract,
  CreateCheckoutSessionRequestContract,
  PortalSessionContract,
} from './contracts';

export async function createCheckoutSession(
  input: CreateCheckoutSessionRequestContract
): Promise<CheckoutSessionContract> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.post<
      CheckoutSessionContract,
      CreateCheckoutSessionRequestContract
    >('billing/checkout-session', input, { headers });
  });
}

export async function createPortalSession(): Promise<PortalSessionContract> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.post<PortalSessionContract, Record<string, never>>(
      'billing/portal-session',
      {},
      {
        headers,
      }
    );
  });
}
