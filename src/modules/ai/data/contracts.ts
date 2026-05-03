// ─── Response contracts ─────────────────────────────────────────────────────

export interface CvIssueContract {
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

export interface CvSuggestionContract {
  section: string;
  current?: string;
  suggested: string;
  reason: string;
}

export interface SectionRecommendationContract {
  section: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CvAnalysisResultContract {
  overallScore: number;
  grammarScore: number;
  readabilityScore: number;
  atsScore: number;
  issues: CvIssueContract[];
  suggestions: CvSuggestionContract[];
  sectionRecommendations: SectionRecommendationContract[];
}

export interface CvOptimizationResultContract {
  matchScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: CvSuggestionContract[];
  sectionRecommendations: SectionRecommendationContract[];
}

// ─── Request contracts ──────────────────────────────────────────────────────

export interface OptimizeCvRequest {
  jobDescription: string;
}
