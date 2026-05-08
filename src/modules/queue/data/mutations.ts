import 'server-only';

import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import { apiClient } from '@/shared/http/api-client';
import type {
  QueueAiAnalyzeRequestContract,
  QueueAiOptimizeRequestContract,
  QueueJobAcceptedContract,
  QueueJobStatusContract,
  QueuePdfExportRequestContract,
} from './contracts';

export async function queuePdfExport(
  input: QueuePdfExportRequestContract
): Promise<QueueJobAcceptedContract> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.post<
      QueueJobAcceptedContract,
      QueuePdfExportRequestContract
    >('queue/jobs/pdf-export', input, { headers });
  });
}

export async function queueAiAnalyze(
  input: QueueAiAnalyzeRequestContract
): Promise<QueueJobAcceptedContract> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.post<
      QueueJobAcceptedContract,
      QueueAiAnalyzeRequestContract
    >('queue/jobs/ai/analyze', input, { headers });
  });
}

export async function queueAiOptimize(
  input: QueueAiOptimizeRequestContract
): Promise<QueueJobAcceptedContract> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.post<
      QueueJobAcceptedContract,
      QueueAiOptimizeRequestContract
    >('queue/jobs/ai/optimize', input, { headers });
  });
}

export async function getQueueJobStatus(
  jobId: string
): Promise<QueueJobStatusContract> {
  return executeAuthenticatedRequest(async (headers) => {
    return apiClient.get<QueueJobStatusContract>(`queue/jobs/${jobId}`, {
      headers,
    });
  });
}
