import type {
  AtsScoreResponseContract,
  KeywordImportanceContract,
  KeywordMatchContract,
} from './contracts';

export type KeywordImportance = 'required' | 'preferred' | 'bonus';

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: KeywordImportance;
}

export interface AtsSectionScore {
  name: string;
  score: number;
  feedback: string;
}

export interface AtsScoreResult {
  overallScore: number;
  keywordMatches: KeywordMatch[];
  sectionScores: AtsSectionScore[];
  suggestions: string[];
  missingKeywords: string[];
  keywordMatchRate: number;
}

function toKeywordImportance(
  value: KeywordImportanceContract
): KeywordImportance {
  return value;
}

function toKeywordMatch(contract: KeywordMatchContract): KeywordMatch {
  return {
    keyword: contract.keyword,
    found: contract.found,
    importance: toKeywordImportance(contract.importance),
  };
}

export function toAtsScoreResult(
  contract: AtsScoreResponseContract
): AtsScoreResult {
  return {
    overallScore: contract.overallScore,
    keywordMatches: contract.keywordMatches.map(toKeywordMatch),
    sectionScores: contract.sectionScores.map((s) => ({
      name: s.name,
      score: s.score,
      feedback: s.feedback,
    })),
    suggestions: [...contract.suggestions],
    missingKeywords: [...contract.missingKeywords],
    keywordMatchRate: contract.keywordMatchRate,
  };
}
