import type {
  LearningResourceContract,
  RoadmapMilestoneContract,
  LearningRoadmapContract,
  SkillAssessmentItemContract,
  SkillGapResponseContract,
  SkillCategoryContract,
  UserSkillProgressContract,
} from './contracts';

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface SkillCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface SkillAssessmentItem {
  skillName: string;
  category: string;
  importance: number;
  hasSkill: boolean;
  userLevel: number | null;
}

export interface SkillGapResult {
  targetRole: string;
  overallReadiness: number;
  requiredSkills: SkillAssessmentItem[];
  strengths: string[];
  gaps: string[];
}

export interface UserSkillProgress {
  id: string;
  skillName: string;
  level: number;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface LearningResource {
  id: string;
  skillName: string;
  title: string;
  url: string;
  platform: string;
  difficulty: string;
  duration: string | null;
  isFree: boolean;
}

export interface RoadmapMilestone {
  phase: string;
  description: string;
  skills: Array<{
    skillName: string;
    importance: number;
    status: string;
    level: number;
    resources: LearningResource[];
  }>;
}

export interface LearningRoadmap {
  targetRole: string;
  totalSkills: number;
  completedSkills: number;
  milestones: RoadmapMilestone[];
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function toSkillCategory(c: SkillCategoryContract): SkillCategory {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? null,
    icon: c.icon ?? null,
  };
}

function toSkillAssessmentItem(
  c: SkillAssessmentItemContract
): SkillAssessmentItem {
  return {
    skillName: c.skillName,
    category: c.category,
    importance: c.importance,
    hasSkill: c.hasSkill,
    userLevel: c.userLevel ?? null,
  };
}

export function toSkillGapResult(c: SkillGapResponseContract): SkillGapResult {
  return {
    targetRole: c.targetRole,
    overallReadiness: c.overallReadiness,
    requiredSkills: c.requiredSkills.map(toSkillAssessmentItem),
    strengths: c.strengths,
    gaps: c.gaps,
  };
}

export function toUserSkillProgress(
  c: UserSkillProgressContract
): UserSkillProgress {
  return {
    id: c.id,
    skillName: c.skillName,
    level: c.level,
    status: c.status,
    startedAt: c.startedAt ? new Date(c.startedAt) : null,
    completedAt: c.completedAt ? new Date(c.completedAt) : null,
  };
}

export function toLearningResource(
  c: LearningResourceContract
): LearningResource {
  return {
    id: c.id,
    skillName: c.skillName,
    title: c.title,
    url: c.url,
    platform: c.platform,
    difficulty: c.difficulty,
    duration: c.duration ?? null,
    isFree: c.isFree,
  };
}

export function toRoadmapMilestone(
  c: RoadmapMilestoneContract
): RoadmapMilestone {
  return {
    phase: c.phase,
    description: c.description,
    skills: c.skills.map((s) => ({
      skillName: s.skillName,
      importance: s.importance,
      status: s.status,
      level: s.level,
      resources: s.resources.map(toLearningResource),
    })),
  };
}

export function toLearningRoadmap(c: LearningRoadmapContract): LearningRoadmap {
  return {
    targetRole: c.targetRole,
    totalSkills: c.totalSkills,
    completedSkills: c.completedSkills,
    milestones: c.milestones.map(toRoadmapMilestone),
  };
}
