import "server-only";

import { apiClient } from "@/shared/http/api-client";
import { executeAuthenticatedRequest } from "@/shared/auth/execute-authenticated-request";
import type { AtsScoreRequest, AtsScoreResponseContract } from "./contracts";
import { toAtsScoreResult, type AtsScoreResult } from "./mappers";

export async function scoreAts(body: AtsScoreRequest): Promise<AtsScoreResult> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      AtsScoreResponseContract,
      AtsScoreRequest
    >("ats/score", body, { headers });

    return toAtsScoreResult(contract);
  });
}
