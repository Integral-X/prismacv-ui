import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type { PaginatedResponse } from '@/shared/http/paginated-response';
import type {
  JobResponseContract,
  JobStatsResponseContract,
} from './contracts';
import { toJob, toJobStats, type Job, type JobStats } from './mappers';

export async function getJobs(status?: string): Promise<Job[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const params: Record<string, string | number> = { limit: 200 };
    if (status) params.status = status;

    const response = await apiClient.get<
      PaginatedResponse<JobResponseContract>
    >('jobs', {
      headers,
      params,
    });

    return response.data.map(toJob);
  });
}

export async function getJobById(id: string): Promise<Job> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<JobResponseContract>(`jobs/${id}`, {
      headers,
    });

    return toJob(contract);
  });
}

export async function getJobStats(): Promise<JobStats> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<JobStatsResponseContract>(
      'jobs/stats',
      { headers }
    );

    return toJobStats(contract);
  });
}
