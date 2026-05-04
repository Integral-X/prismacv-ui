'use server';

import { revalidatePath } from 'next/cache';
import { type ActionResult, toFailureResult } from '@/shared/action-result';
import type { AssessSkillsRequest, UpdateProgressRequest } from './contracts';
import { assessSkills, updateSkillProgress } from './mutations';
import type { SkillGapResult, UserSkillProgress } from './mappers';

// ─── Skills actions ─────────────────────────────────────────────────────────

export async function assessSkillsAction(
  input: AssessSkillsRequest
): Promise<ActionResult<SkillGapResult>> {
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
