import type {
  LearningResourceContract,
  RoadmapPhaseContract,
  SkillAssessmentContract,
  SkillCategoryContract,
  SkillGapContract,
  UserSkillProgressContract,
} from './contracts';

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface SkillCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface SkillGap {
  skillName: string;
  category: string;
  importance: number;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
}

export interface SkillAssessment {
  role: string;
  readinessScore: number;
  gaps: SkillGap[];
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
  platform: string | null;
  difficulty: string | null;
  duration: string | null;
  isFree: boolean;
}

export interface RoadmapPhase {
  phase: string;
  skills: Array<{
    skillName: string;
    importance: number;
    currentLevel: number;
    targetLevel: number;
  }>;
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

function toSkillGap(c: SkillGapContract): SkillGap {
  return {
    skillName: c.skillName,
    category: c.category,
    importance: c.importance,
    currentLevel: c.currentLevel,
    requiredLevel: c.requiredLevel,
    gap: c.gap,
  };
}

export function toSkillAssessment(c: SkillAssessmentContract): SkillAssessment {
  return {
    role: c.role,
    readinessScore: c.readinessScore,
    gaps: c.gaps.map(toSkillGap),
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
    platform: c.platform ?? null,
    difficulty: c.difficulty ?? null,
    duration: c.duration ?? null,
    isFree: c.isFree,
  };
}

export function toRoadmapPhase(c: RoadmapPhaseContract): RoadmapPhase {
  return {
    phase: c.phase,
    skills: c.skills,
  };
}
