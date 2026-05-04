import type {
  CvAnalysisResultContract,
  CvIssueContract,
  CvOptimizationResultContract,
  CvSuggestionContract,
  SectionRecommendationContract,
} from './contracts';

// ─── Domain types ─────────────────────────────────────────────────────────────

export type IssueSeverity = 'low' | 'medium' | 'high';
export type IssueType = 'grammar' | 'readability' | 'ats' | 'content';
export type SuggestionType = 'improvement' | 'addition' | 'removal';
export type RecommendationAction = 'add' | 'improve' | 'remove';
export type RecommendationPriority = 'low' | 'medium' | 'high';

export interface CvIssue {
  section: string;
  type: IssueType;
  severity: IssueSeverity;
  message: string;
  suggestion: string | null;
}

export interface CvSuggestion {
  section: string;
  type: SuggestionType;
  message: string;
  originalText: string | null;
  suggestedText: string | null;
}

export interface SectionRecommendation {
  section: string;
  action: RecommendationAction;
  message: string;
  priority: RecommendationPriority;
}

export interface CvAnalysisResult {
  overallScore: number;
  grammarScore: number;
  readabilityScore: number;
  atsScore: number;
  issues: CvIssue[];
  suggestions: CvSuggestion[];
}

export interface CvOptimizationResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: CvSuggestion[];
  sectionRecommendations: SectionRecommendation[];
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toIssue(c: CvIssueContract): CvIssue {
  return {
    section: c.section,
    type: c.type,
    severity: c.severity,
    message: c.message,
    suggestion: c.suggestion ?? null,
  };
}

function toSuggestion(c: CvSuggestionContract): CvSuggestion {
  return {
    section: c.section,
    type: c.type,
    message: c.message,
    originalText: c.originalText ?? null,
    suggestedText: c.suggestedText ?? null,
  };
}

function toRecommendation(
  c: SectionRecommendationContract
): SectionRecommendation {
  return {
    section: c.section,
    action: c.action,
    message: c.message,
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
  };
}

export function toCvOptimization(
  c: CvOptimizationResultContract
): CvOptimizationResult {
  return {
    matchScore: c.matchScore,
    missingKeywords: c.missingKeywords,
    suggestions: c.suggestions.map(toSuggestion),
    sectionRecommendations: c.sectionRecommendations.map(toRecommendation),
  };
}
