export type KeywordImportanceContract = "required" | "preferred" | "bonus";

export interface KeywordMatchContract {
  keyword: string;
  found: boolean;
  importance: KeywordImportanceContract;
}

export interface AtsSectionScoreContract {
  name: string;
  score: number;
  feedback: string;
}

export interface AtsScoreResponseContract {
  overallScore: number;
  keywordMatches: KeywordMatchContract[];
  sectionScores: AtsSectionScoreContract[];
  suggestions: string[];
  missingKeywords: string[];
  keywordMatchRate: number;
}

export interface AtsScoreRequest {
  cvText: string;
  jobDescription: string;
  skills?: string[];
}
