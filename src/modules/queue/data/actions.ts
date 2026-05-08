'use server';

import { type ActionResult, toFailureResult } from '@/shared/action-result';
import type {
  QueueAiAnalyzeRequestContract,
  QueueAiOptimizeRequestContract,
  QueueJobAcceptedContract,
  QueueJobStatusContract,
  QueuePdfExportRequestContract,
} from './contracts';
import {
  getQueueJobStatus,
  queueAiAnalyze,
  queueAiOptimize,
  queuePdfExport,
} from './mutations';

export async function queuePdfExportAction(
  input: QueuePdfExportRequestContract
): Promise<ActionResult<QueueJobAcceptedContract>> {
  try {
    const result = await queuePdfExport(input);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Unable to queue PDF export.');
  }
}

export async function queueAiAnalyzeAction(
  input: QueueAiAnalyzeRequestContract
): Promise<ActionResult<QueueJobAcceptedContract>> {
  try {
    const result = await queueAiAnalyze(input);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Unable to queue CV analysis.');
  }
}

export async function queueAiOptimizeAction(
  input: QueueAiOptimizeRequestContract
): Promise<ActionResult<QueueJobAcceptedContract>> {
  try {
    const result = await queueAiOptimize(input);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Unable to queue CV optimization.');
  }
}

export async function getQueueJobStatusAction(
  jobId: string
): Promise<ActionResult<QueueJobStatusContract>> {
  try {
    const result = await getQueueJobStatus(jobId);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Unable to fetch queue job status.');
  }
}
