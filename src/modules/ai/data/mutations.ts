import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type {
  CvAnalysisResultContract,
  CvOptimizationResultContract,
  OptimizeCvRequest,
} from './contracts';
import {
  toCvAnalysis,
  toCvOptimization,
  type CvAnalysisResult,
  type CvOptimizationResult,
} from './mappers';

export async function analyzeCv(cvId: string): Promise<CvAnalysisResult> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      CvAnalysisResultContract,
      Record<string, never>
    >(`ai/cv/${cvId}/analyze`, {}, { headers });

    return toCvAnalysis(contract);
  });
}

export async function optimizeCvForJob(
  cvId: string,
  body: OptimizeCvRequest
): Promise<CvOptimizationResult> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      CvOptimizationResultContract,
      OptimizeCvRequest
    >(`ai/cv/${cvId}/optimize`, body, { headers });

    return toCvOptimization(contract);
  });
}
