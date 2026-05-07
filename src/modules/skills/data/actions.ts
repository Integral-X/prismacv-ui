'use server';

import { revalidatePath } from 'next/cache';
import { type ActionResult, toFailureResult } from '@/shared/action-result';
import type { AssessSkillsRequest, UpdateProgressRequest } from './contracts';
import { assessSkills, updateSkillProgress } from './mutations';
import type {
  SkillGapResult,
  UserSkillProgress,
  LearningRoadmap,
} from './mappers';
import { getLearningRoadmap } from './queries';

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
    revalidatePath('/skills/roadmap');

    return { ok: true, data: progress, message: 'Progress updated.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to update your progress.');
  }
}

export async function fetchRoadmapAction(
  role: string
): Promise<ActionResult<LearningRoadmap>> {
  try {
    const roadmap = await getLearningRoadmap(role);
    return { ok: true, data: roadmap };
  } catch (error) {
    return toFailureResult(error, 'Unable to load roadmap.');
  }
}
