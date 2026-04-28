import { apiClient } from '@/shared/http/api-client';
import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';
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

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function executeAuthenticatedQuery<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new HttpError(401, 'Unauthorized', 'Authentication required');
  }

  try {
    return await operation({ Authorization: `Bearer ${accessToken}` });
  } catch (error) {
    if (!(error instanceof HttpError) || !error.isUnauthorized) {
      throw error;
    }

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearAuthSession();
      throw error;
    }

    try {
      const { refreshUserToken } =
        await import('@/modules/auth/data/mutations');
      const refreshedSession = await refreshUserToken({ refreshToken });

      await persistAuthSession(refreshedSession, await shouldPersistSession());

      return await operation({
        Authorization: `Bearer ${refreshedSession.accessToken}`,
      });
    } catch (refreshError) {
      await clearAuthSession();
      throw refreshError;
    }
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getUserCvs(
  page?: number,
  limit?: number
): Promise<PaginatedCvList> {
  return executeAuthenticatedQuery(async (headers) => {
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
  return executeAuthenticatedQuery(async (headers) => {
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
