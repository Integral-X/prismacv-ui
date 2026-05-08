export type GrammarIssueTypeContract = 'grammar' | 'style' | 'impact';

export type GrammarIssueSeverityContract = 'error' | 'warning' | 'info';

export type GrammarContextContract =
  | 'summary'
  | 'experience'
  | 'education'
  | 'cover_letter'
  | 'project';

export interface GrammarIssueContract {
  type: GrammarIssueTypeContract;
  message: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
  severity: GrammarIssueSeverityContract;
}

export interface CheckGrammarResponseContract {
  issues: GrammarIssueContract[];
  score: number;
  summary: string;
}

export interface CheckGrammarRequest {
  text: string;
  context?: GrammarContextContract;
}
