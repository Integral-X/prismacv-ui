import {
  toQueueCvAnalysisResult,
  toQueueCvOptimizationResult,
  toQueueJobStatus,
  toQueuePdfExportResult,
} from "./mappers";
import type { QueueJobStatusContract } from "./contracts";

describe("queue mappers", () => {
  it("maps a queue job status and normalizes missing result/error to null", () => {
    const contract: QueueJobStatusContract = {
      id: "job_001",
      state: "active",
      type: "pdf_export",
      processedOn: "2026-06-01T10:00:00.000Z",
      finishedOn: null,
    };

    expect(toQueueJobStatus(contract)).toEqual({
      id: "job_001",
      state: "active",
      type: "pdf_export",
      result: null,
      error: null,
      processedOn: "2026-06-01T10:00:00.000Z",
      finishedOn: null,
    });
  });

  it("accepts a completed PDF export result", () => {
    expect(
      toQueuePdfExportResult({
        filename: "cv.pdf",
        contentType: "application/pdf",
        base64: "JVBERi0=",
      })
    ).toEqual({
      filename: "cv.pdf",
      contentType: "application/pdf",
      base64: "JVBERi0=",
    });
  });

  it("rejects malformed PDF export results", () => {
    expect(toQueuePdfExportResult({ filename: "cv.pdf" })).toBeNull();
    expect(toQueuePdfExportResult(null)).toBeNull();
  });

  it("maps a completed AI analysis result", () => {
    const result = toQueueCvAnalysisResult({
      overallScore: 90,
      grammarScore: 88,
      readabilityScore: 82,
      atsScore: 79,
      issues: [
        {
          section: "Experience",
          type: "content",
          severity: "medium",
          message: "Add impact.",
          suggestion: "Include metrics.",
        },
      ],
      suggestions: [
        {
          section: "Summary",
          type: "improvement",
          message: "Tighten the opening.",
          suggestedText: "Senior engineer with measurable outcomes.",
        },
      ],
    });

    expect(result).toEqual({
      overallScore: 90,
      grammarScore: 88,
      readabilityScore: 82,
      atsScore: 79,
      issues: [
        {
          section: "Experience",
          type: "content",
          severity: "medium",
          message: "Add impact.",
          suggestion: "Include metrics.",
        },
      ],
      suggestions: [
        {
          section: "Summary",
          type: "improvement",
          message: "Tighten the opening.",
          originalText: null,
          suggestedText: "Senior engineer with measurable outcomes.",
        },
      ],
    });
  });

  it("maps a completed AI optimization result", () => {
    const result = toQueueCvOptimizationResult({
      matchScore: 86,
      missingKeywords: ["TypeScript"],
      suggestions: [],
      sectionRecommendations: [
        {
          section: "Skills",
          action: "add",
          message: "Add TypeScript.",
          priority: "high",
        },
      ],
    });

    expect(result).toEqual({
      matchScore: 86,
      missingKeywords: ["TypeScript"],
      suggestions: [],
      sectionRecommendations: [
        {
          section: "Skills",
          action: "add",
          message: "Add TypeScript.",
          priority: "high",
        },
      ],
    });
  });

  it("rejects malformed AI results", () => {
    expect(toQueueCvAnalysisResult({ overallScore: 90 })).toBeNull();
    expect(toQueueCvOptimizationResult({ matchScore: 86 })).toBeNull();
  });
});
