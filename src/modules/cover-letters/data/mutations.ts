import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type {
  CoverLetterResponseContract,
  CreateCoverLetterRequest,
  UpdateCoverLetterRequest,
  GenerateCoverLetterRequest,
  GeneratedCoverLetterResponseContract,
  PaginatedCoverLettersContract,
} from './contracts';
import { toCoverLetter, type CoverLetter } from './mappers';

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function fetchCoverLetters(
  page = 1,
  limit = 20
): Promise<{ data: CoverLetter[]; total: number; totalPages: number }> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<PaginatedCoverLettersContract>(
      `cover-letters?page=${page}&limit=${limit}`,
      { headers }
    );

    return {
      data: contract.data.map(toCoverLetter),
      total: contract.total,
      totalPages: contract.totalPages,
    };
  });
}

export async function fetchCoverLetter(id: string): Promise<CoverLetter> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<CoverLetterResponseContract>(
      `cover-letters/${id}`,
      { headers }
    );

    return toCoverLetter(contract);
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createCoverLetter(
  body: CreateCoverLetterRequest
): Promise<CoverLetter> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      CoverLetterResponseContract,
      CreateCoverLetterRequest
    >('cover-letters', body, { headers });

    return toCoverLetter(contract);
  });
}

export async function updateCoverLetter(
  id: string,
  body: UpdateCoverLetterRequest
): Promise<CoverLetter> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.put<
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
    >('cover-letters/generate', body, { headers });
  });
}
