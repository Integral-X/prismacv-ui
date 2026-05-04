import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type {
  AssessSkillsRequest,
  SkillGapResponseContract,
  UpdateProgressRequest,
  UserSkillProgressContract,
} from './contracts';
import {
  toSkillGapResult,
  toUserSkillProgress,
  type SkillGapResult,
  type UserSkillProgress,
} from './mappers';

export async function assessSkills(
  body: AssessSkillsRequest
): Promise<SkillGapResult> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      SkillGapResponseContract,
      AssessSkillsRequest
    >('skills/assess', body, { headers });
    return toSkillGapResult(contract);
  });
}

export async function updateSkillProgress(
  body: UpdateProgressRequest
): Promise<UserSkillProgress> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.patch<
      UserSkillProgressContract,
      UpdateProgressRequest
    >('skills/progress', body, { headers });
    return toUserSkillProgress(contract);
  });
}
