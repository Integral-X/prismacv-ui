'use server';

import { revalidatePath } from 'next/cache';
import { HttpError } from '@/shared/http/http-error';
import type { AssessSkillsRequest, UpdateProgressRequest } from './contracts';
import { assessSkills, updateSkillProgress } from './mutations';
import type { SkillAssessment, UserSkillProgress } from './mappers';

// ─── Action types ─────────────────────────────────────────────────────────────

export type SkillsActionCode =
  | 'not_found'
  | 'forbidden'
  | 'unauthorized'
  | 'unknown';

export interface ActionSuccessResult<T = undefined> {
  ok: true;
  data?: T;
  message?: string;
}

export interface ActionFailureResult {
  ok: false;
  code: SkillsActionCode;
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

// ─── Skills actions ─────────────────────────────────────────────────────────

export async function assessSkillsAction(
  input: AssessSkillsRequest
): Promise<ActionResult<SkillAssessment>> {
  try {
    const result = await assessSkills(input);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Unable to assess your skills.');
  }
}

export async function updateSkillProgressAction(
  input: UpdateProgressRequest
): Promise<ActionResult<UserSkillProgress>> {
  try {
    const progress = await updateSkillProgress(input);
    revalidatePath('/skills');

    return { ok: true, data: progress, message: 'Progress updated.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to update your progress.');
  }
}
