import "server-only";

import { apiClient } from "@/shared/http/api-client";
import { executeAuthenticatedRequest } from "@/shared/auth/execute-authenticated-request";
import type {
  CoverLetterResponseContract,
  CreateCoverLetterRequest,
  UpdateCoverLetterRequest,
  GenerateCoverLetterRequest,
  GeneratedCoverLetterResponseContract,
} from "./contracts";
import { toCoverLetter, type CoverLetter } from "./mappers";

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createCoverLetter(
  body: CreateCoverLetterRequest
): Promise<CoverLetter> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      CoverLetterResponseContract,
      CreateCoverLetterRequest
    >("cover-letters", body, { headers });

    return toCoverLetter(contract);
  });
}

export async function updateCoverLetter(
  id: string,
  body: UpdateCoverLetterRequest
): Promise<CoverLetter> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.patch<
      CoverLetterResponseContract,
      UpdateCoverLetterRequest
    >(`cover-letters/${id}`, body, { headers });

    return toCoverLetter(contract);
  });
}

export async function deleteCoverLetter(id: string): Promise<void> {
  return executeAuthenticatedRequest(async (headers) => {
    await apiClient.delete<void>(`cover-letters/${id}`, { headers });
  });
}

export async function generateCoverLetter(
  body: GenerateCoverLetterRequest
): Promise<GeneratedCoverLetterResponseContract> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.post<
      GeneratedCoverLetterResponseContract,
      GenerateCoverLetterRequest
    >("cover-letters/generate", body, { headers });
  });
}
