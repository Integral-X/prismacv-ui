import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type {
  AssessSkillsRequest,
  SkillAssessmentContract,
  UpdateProgressRequest,
  UserSkillProgressContract,
} from './contracts';
import {
  toSkillAssessment,
  toUserSkillProgress,
  type SkillAssessment,
  type UserSkillProgress,
} from './mappers';

export async function assessSkills(
  body: AssessSkillsRequest
): Promise<SkillAssessment> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      SkillAssessmentContract,
      AssessSkillsRequest
    >('skills/assess', body, { headers });
    return toSkillAssessment(contract);
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
