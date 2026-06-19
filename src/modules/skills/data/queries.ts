import "server-only";

import { apiClient } from "@/shared/http/api-client";
import { executeAuthenticatedRead } from "@/shared/auth/execute-authenticated-request";
import type {
  LearningResourceContract,
  LearningRoadmapContract,
  SkillCategoryContract,
  UserSkillProgressContract,
} from "./contracts";
import {
  toLearningResource,
  toLearningRoadmap,
  toSkillCategory,
  toUserSkillProgress,
  type LearningResource,
  type LearningRoadmap,
  type SkillCategory,
  type UserSkillProgress,
} from "./mappers";

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const contracts =
    await apiClient.get<SkillCategoryContract[]>("skills/categories");
  return contracts.map(toSkillCategory);
}

export async function getSkillRoles(): Promise<string[]> {
  return apiClient.get<string[]>("skills/roles");
}

export async function getResources(
  skill?: string,
  difficulty?: string
): Promise<LearningResource[]> {
  const params: Record<string, string> = {};
  if (skill) params.skill = skill;
  if (difficulty) params.difficulty = difficulty;

  const contracts = await apiClient.get<LearningResourceContract[]>(
    "skills/resources",
    { params }
  );
  return contracts.map(toLearningResource);
}

export async function getUserProgress(): Promise<UserSkillProgress[]> {
  return executeAuthenticatedRead(async (headers) => {
    const contracts = await apiClient.get<UserSkillProgressContract[]>(
      "skills/progress",
      { headers }
    );
    return contracts.map(toUserSkillProgress);
  });
}

export async function getLearningRoadmap(
  role: string
): Promise<LearningRoadmap> {
  return executeAuthenticatedRead(async (headers) => {
    const contract = await apiClient.get<LearningRoadmapContract>(
      "skills/roadmap",
      { headers, params: { role } }
    );
    return toLearningRoadmap(contract);
  });
}
