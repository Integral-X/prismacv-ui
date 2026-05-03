'use server';

import { type ActionResult, toFailureResult } from '@/shared/action-result';
import type { OptimizeCvRequest } from './contracts';
import { analyzeCv, optimizeCvForJob } from './mutations';
import type { CvAnalysisResult, CvOptimizationResult } from './mappers';

// ─── AI actions ───────────────────────────────────────────────────────────────

export async function analyzeCvAction(
  cvId: string
): Promise<ActionResult<CvAnalysisResult>> {
  try {
    const result = await analyzeCv(cvId);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Unable to analyze your CV.');
  }
}

export async function optimizeCvAction(
  cvId: string,
  input: OptimizeCvRequest
): Promise<ActionResult<CvOptimizationResult>> {
  try {
    const result = await optimizeCvForJob(cvId, input);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Unable to optimize your CV.');
  }
}
