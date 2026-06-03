import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRead } from '@/shared/auth/execute-authenticated-request';
import type {
  CoverLetterResponseContract,
  PaginatedCoverLettersContract,
} from './contracts';
import { toCoverLetter, type CoverLetter } from './mappers';

export async function fetchCoverLetters(
  page = 1,
  limit = 20
): Promise<{ data: CoverLetter[]; total: number; totalPages: number }> {
  return executeAuthenticatedRead(async (headers) => {
    const contract = await apiClient.get<PaginatedCoverLettersContract>(
      'cover-letters',
      { headers, params: { page, limit } }
    );

    return {
      data: contract.data.map(toCoverLetter),
      total: contract.total,
      totalPages: contract.totalPages,
    };
  });
}

export async function fetchCoverLetter(id: string): Promise<CoverLetter> {
  return executeAuthenticatedRead(async (headers) => {
    const contract = await apiClient.get<CoverLetterResponseContract>(
      `cover-letters/${id}`,
      { headers }
    );

    return toCoverLetter(contract);
  });
}
