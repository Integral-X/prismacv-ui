import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import type { InterviewQuestionContract } from './contracts';
import { toInterviewQuestion, type InterviewQuestion } from './mappers';

export async function getInterviewQuestions(params?: {
  role?: string;
  category?: string;
  difficulty?: string;
  random?: boolean;
  limit?: number;
}): Promise<InterviewQuestion[]> {
  const queryParams: Record<string, string | number | boolean> = {};
  if (params?.role) queryParams.role = params.role;
  if (params?.category) queryParams.category = params.category;
  if (params?.difficulty) queryParams.difficulty = params.difficulty;
  if (params?.random) queryParams.random = true;
  if (params?.limit) queryParams.limit = params.limit;

  const contracts = await apiClient.get<InterviewQuestionContract[]>(
    'interview/questions',
    { params: queryParams }
  );

  return contracts.map(toInterviewQuestion);
}

export async function getInterviewRoles(): Promise<string[]> {
  return apiClient.get<string[]>('interview/roles');
}

export async function getInterviewCategories(): Promise<string[]> {
  return apiClient.get<string[]>('interview/categories');
}
