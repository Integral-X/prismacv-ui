// ─── Response contracts ─────────────────────────────────────────────────────

export interface CvIssueContract {
  section: string;
  type: 'grammar' | 'readability' | 'ats' | 'content';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
}

export interface CvSuggestionContract {
  section: string;
  type: 'improvement' | 'addition' | 'removal';
  message: string;
  originalText?: string;
  suggestedText?: string;
}

export interface SectionRecommendationContract {
  section: string;
  action: 'add' | 'improve' | 'remove';
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CvAnalysisResultContract {
  overallScore: number;
  grammarScore: number;
  readabilityScore: number;
  atsScore: number;
  issues: CvIssueContract[];
  suggestions: CvSuggestionContract[];
}

export interface CvOptimizationResultContract {
  matchScore: number;
  missingKeywords: string[];
  suggestions: CvSuggestionContract[];
  sectionRecommendations: SectionRecommendationContract[];
}

// ─── Request contracts ──────────────────────────────────────────────────────

export interface OptimizeCvRequest {
  jobDescription: string;
}
