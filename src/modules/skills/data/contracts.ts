// ─── Response contracts ─────────────────────────────────────────────────────

export interface SkillCategoryContract {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface SkillAssessmentItemContract {
  skillName: string;
  category: string;
  importance: number;
  hasSkill: boolean;
  userLevel?: number;
}

export interface SkillGapResponseContract {
  targetRole: string;
  overallReadiness: number;
  requiredSkills: SkillAssessmentItemContract[];
  strengths: string[];
  gaps: string[];
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
  platform: string;
  difficulty: string;
  duration?: string;
  isFree: boolean;
}

export interface RoadmapSkillContract {
  skillName: string;
  importance: number;
  status: string;
  level: number;
  resources: LearningResourceContract[];
}

export interface RoadmapMilestoneContract {
  phase: string;
  skills: RoadmapSkillContract[];
  description: string;
}

export interface LearningRoadmapContract {
  targetRole: string;
  totalSkills: number;
  completedSkills: number;
  milestones: RoadmapMilestoneContract[];
}

// ─── Request contracts ──────────────────────────────────────────────────────

export interface AssessSkillInputRequest {
  name: string;
  level?: number;
}

export interface AssessSkillsRequest {
  targetRole: string;
  currentSkills?: AssessSkillInputRequest[];
}

export interface UpdateProgressRequest {
  skillName: string;
  level?: number;
  status?: string;
}
