import "server-only";

import { apiClient } from "@/shared/http/api-client";
import { executeAuthenticatedRequest } from "@/shared/auth/execute-authenticated-request";

export interface RefreshUnleashFeaturesPayload {
  success: boolean;
  message: string;
  timestamp: string;
}

export async function refreshUnleashFeaturesFromServer(): Promise<RefreshUnleashFeaturesPayload> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.get<RefreshUnleashFeaturesPayload>("features/refresh", {
      headers,
    });
  });
}
