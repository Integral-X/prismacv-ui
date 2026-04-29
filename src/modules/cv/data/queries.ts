import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type {
  CvResponseContract,
  PaginatedCvListContract,
  TemplateContract,
} from './contracts';
import {
  toCv,
  toPaginatedCvList,
  toTemplate,
  type Cv,
  type CvTemplate,
  type PaginatedCvList,
} from './mappers';

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getUserCvs(
  page?: number,
  limit?: number
): Promise<PaginatedCvList> {
  return executeAuthenticatedRequest(async (headers) => {
    const params: Record<string, string | number | boolean> = {};
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    const contract = await apiClient.get<PaginatedCvListContract>('cv', {
      headers,
      params,
    });

    return toPaginatedCvList(contract);
  });
}

export async function getCvById(id: string): Promise<Cv> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<CvResponseContract>(`cv/${id}`, {
      headers,
    });

    return toCv(contract);
  });
}

export async function getTemplates(): Promise<CvTemplate[]> {
  const contracts = await apiClient.get<TemplateContract[]>('cv/templates');

  return contracts.map(toTemplate);
}
