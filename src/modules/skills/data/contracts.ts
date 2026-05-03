// ─── Response contracts ─────────────────────────────────────────────────────

export interface SkillCategoryContract {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface RoleSkillMapContract {
  role: string;
  skillName: string;
  category: SkillCategoryContract;
  importance: number;
}

export interface SkillGapContract {
  skillName: string;
  category: string;
  importance: number;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
}

export interface SkillAssessmentContract {
  role: string;
  readinessScore: number;
  gaps: SkillGapContract[];
}

export interface UserSkillProgressContract {
  id: string;
  skillName: string;
  level: number;
  status: string;
  startedAt?: string;
  completedAt?: string;
}

export interface LearningResourceContract {
  id: string;
  skillName: string;
  title: string;
  url: string;
  platform?: string;
  difficulty?: string;
  duration?: string;
  isFree: boolean;
}

export interface RoadmapPhaseContract {
  phase: string;
  skills: Array<{
    skillName: string;
    importance: number;
    currentLevel: number;
    targetLevel: number;
  }>;
}

// ─── Request contracts ──────────────────────────────────────────────────────

export interface AssessSkillsRequest {
  role: string;
  skills: Array<{
    name: string;
    level: number;
  }>;
}

export interface UpdateProgressRequest {
  skillName: string;
  level: number;
  status?: string;
}
