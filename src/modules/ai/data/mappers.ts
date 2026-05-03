import type {
  CvAnalysisResultContract,
  CvIssueContract,
  CvOptimizationResultContract,
  CvSuggestionContract,
  SectionRecommendationContract,
} from './contracts';

// ─── Domain types ─────────────────────────────────────────────────────────────

export type IssueSeverity = 'error' | 'warning' | 'info';
export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface CvIssue {
  field: string;
  severity: IssueSeverity;
  message: string;
  suggestion: string | null;
}

export interface CvSuggestion {
  section: string;
  current: string | null;
  suggested: string;
  reason: string;
}

export interface SectionRecommendation {
  section: string;
  recommendation: string;
  priority: RecommendationPriority;
}

export interface CvAnalysisResult {
  overallScore: number;
  grammarScore: number;
  readabilityScore: number;
  atsScore: number;
  issues: CvIssue[];
  suggestions: CvSuggestion[];
  sectionRecommendations: SectionRecommendation[];
}

export interface CvOptimizationResult {
  matchScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: CvSuggestion[];
  sectionRecommendations: SectionRecommendation[];
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toIssue(c: CvIssueContract): CvIssue {
  return {
    field: c.field,
    severity: c.severity,
    message: c.message,
    suggestion: c.suggestion ?? null,
  };
}

function toSuggestion(c: CvSuggestionContract): CvSuggestion {
  return {
    section: c.section,
    current: c.current ?? null,
    suggested: c.suggested,
    reason: c.reason,
  };
}

function toRecommendation(
  c: SectionRecommendationContract
): SectionRecommendation {
  return {
    section: c.section,
    recommendation: c.recommendation,
    priority: c.priority,
  };
}

export function toCvAnalysis(c: CvAnalysisResultContract): CvAnalysisResult {
  return {
    overallScore: c.overallScore,
    grammarScore: c.grammarScore,
    readabilityScore: c.readabilityScore,
    atsScore: c.atsScore,
    issues: c.issues.map(toIssue),
    suggestions: c.suggestions.map(toSuggestion),
    sectionRecommendations: c.sectionRecommendations.map(toRecommendation),
  };
}

export function toCvOptimization(
  c: CvOptimizationResultContract
): CvOptimizationResult {
  return {
    matchScore: c.matchScore,
    missingKeywords: c.missingKeywords,
    presentKeywords: c.presentKeywords,
    suggestions: c.suggestions.map(toSuggestion),
    sectionRecommendations: c.sectionRecommendations.map(toRecommendation),
  };
}
