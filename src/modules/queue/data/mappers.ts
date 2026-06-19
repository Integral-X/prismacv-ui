import type {
  CvAnalysisResultContract,
  CvIssueContract,
  CvOptimizationResultContract,
  CvSuggestionContract,
  SectionRecommendationContract,
} from "@/modules/ai/data/contracts";
import {
  toCvAnalysis,
  toCvOptimization,
  type CvAnalysisResult,
  type CvOptimizationResult,
} from "@/modules/ai/data/mappers";
import type { QueueJobStatusContract } from "./contracts";

export type QueueJobState = QueueJobStatusContract["state"];
export type QueueJobType = "pdf_export" | "ai_analyze" | "ai_optimize";

export interface QueueJobStatus<TResult = unknown> {
  id: string;
  state: QueueJobState;
  type: QueueJobType | string;
  result: TResult | null;
  error: string | null;
  processedOn: string | null;
  finishedOn: string | null;
}

export interface QueuePdfExportResult {
  filename: string;
  contentType: "application/pdf" | string;
  base64: string;
}

const ISSUE_TYPES = new Set(["grammar", "readability", "ats", "content"]);
const ISSUE_SEVERITIES = new Set(["low", "medium", "high"]);
const SUGGESTION_TYPES = new Set(["improvement", "addition", "removal"]);
const RECOMMENDATION_ACTIONS = new Set(["add", "improve", "remove"]);
const RECOMMENDATION_PRIORITIES = new Set(["low", "medium", "high"]);

export function toQueueJobStatus(
  contract: QueueJobStatusContract
): QueueJobStatus {
  return {
    id: contract.id,
    state: contract.state,
    type: contract.type,
    result: contract.result ?? null,
    error: contract.error ?? null,
    processedOn: contract.processedOn,
    finishedOn: contract.finishedOn,
  };
}

export function toQueuePdfExportResult(
  value: unknown
): QueuePdfExportResult | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.filename !== "string" ||
    typeof value.contentType !== "string" ||
    typeof value.base64 !== "string"
  ) {
    return null;
  }

  return {
    filename: value.filename,
    contentType: value.contentType,
    base64: value.base64,
  };
}

export function toQueueCvAnalysisResult(
  value: unknown
): CvAnalysisResult | null {
  if (!isCvAnalysisResultContract(value)) {
    return null;
  }

  return toCvAnalysis(value);
}

export function toQueueCvOptimizationResult(
  value: unknown
): CvOptimizationResult | null {
  if (!isCvOptimizationResultContract(value)) {
    return null;
  }

  return toCvOptimization(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isCvIssueContract(value: unknown): value is CvIssueContract {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.section === "string" &&
    typeof value.type === "string" &&
    ISSUE_TYPES.has(value.type) &&
    typeof value.severity === "string" &&
    ISSUE_SEVERITIES.has(value.severity) &&
    typeof value.message === "string" &&
    (value.suggestion === undefined || typeof value.suggestion === "string")
  );
}

function isCvSuggestionContract(value: unknown): value is CvSuggestionContract {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.section === "string" &&
    typeof value.type === "string" &&
    SUGGESTION_TYPES.has(value.type) &&
    typeof value.message === "string" &&
    (value.originalText === undefined ||
      typeof value.originalText === "string") &&
    (value.suggestedText === undefined ||
      typeof value.suggestedText === "string")
  );
}

function isSectionRecommendationContract(
  value: unknown
): value is SectionRecommendationContract {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.section === "string" &&
    typeof value.action === "string" &&
    RECOMMENDATION_ACTIONS.has(value.action) &&
    typeof value.message === "string" &&
    typeof value.priority === "string" &&
    RECOMMENDATION_PRIORITIES.has(value.priority)
  );
}

function isCvAnalysisResultContract(
  value: unknown
): value is CvAnalysisResultContract {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.overallScore === "number" &&
    typeof value.grammarScore === "number" &&
    typeof value.readabilityScore === "number" &&
    typeof value.atsScore === "number" &&
    Array.isArray(value.issues) &&
    value.issues.every(isCvIssueContract) &&
    Array.isArray(value.suggestions) &&
    value.suggestions.every(isCvSuggestionContract)
  );
}

function isCvOptimizationResultContract(
  value: unknown
): value is CvOptimizationResultContract {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.matchScore === "number" &&
    isStringArray(value.missingKeywords) &&
    Array.isArray(value.suggestions) &&
    value.suggestions.every(isCvSuggestionContract) &&
    Array.isArray(value.sectionRecommendations) &&
    value.sectionRecommendations.every(isSectionRecommendationContract)
  );
}
