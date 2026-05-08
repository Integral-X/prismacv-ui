import type {
  CheckGrammarResponseContract,
  GrammarIssueContract,
  GrammarIssueSeverityContract,
  GrammarIssueTypeContract,
} from './contracts';

export type GrammarIssueType = 'grammar' | 'style' | 'impact';
export type GrammarIssueSeverity = 'error' | 'warning' | 'info';

export interface GrammarIssue {
  type: GrammarIssueType;
  message: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
  severity: GrammarIssueSeverity;
}

export interface GrammarCheckResult {
  issues: GrammarIssue[];
  score: number;
  summary: string;
}

function toIssueType(t: GrammarIssueTypeContract): GrammarIssueType {
  return t;
}

function toSeverity(s: GrammarIssueSeverityContract): GrammarIssueSeverity {
  return s;
}

function toIssue(contract: GrammarIssueContract): GrammarIssue {
  return {
    type: toIssueType(contract.type),
    message: contract.message,
    suggestion: contract.suggestion,
    startIndex: contract.startIndex,
    endIndex: contract.endIndex,
    severity: toSeverity(contract.severity),
  };
}

export function toGrammarCheckResult(
  contract: CheckGrammarResponseContract
): GrammarCheckResult {
  return {
    issues: contract.issues.map(toIssue),
    score: contract.score,
    summary: contract.summary,
  };
}
