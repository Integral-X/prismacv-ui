'use server';

import { HttpError } from '@/shared/http/http-error';
import type { OptimizeCvRequest } from './contracts';
import { analyzeCv, optimizeCvForJob } from './mutations';
import type { CvAnalysisResult, CvOptimizationResult } from './mappers';

// ─── Action types ─────────────────────────────────────────────────────────────

export type AiActionCode =
  | 'not_found'
  | 'forbidden'
  | 'unauthorized'
  | 'unknown';

export interface ActionSuccessResult<T = undefined> {
  ok: true;
  data?: T;
}

export interface ActionFailureResult {
  ok: false;
  code: AiActionCode;
  message: string;
}

export type ActionResult<T = undefined> =
  | ActionSuccessResult<T>
  | ActionFailureResult;

function toFailureResult(
  error: unknown,
  fallbackMessage: string
): ActionFailureResult {
  if (error instanceof HttpError) {
    const message = error.serverMessage ?? error.message ?? fallbackMessage;
    if (error.isNotFound) return { ok: false, code: 'not_found', message };
    if (error.isForbidden) return { ok: false, code: 'forbidden', message };
    if (error.isUnauthorized)
      return { ok: false, code: 'unauthorized', message };
  }
  return { ok: false, code: 'unknown', message: fallbackMessage };
}

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
