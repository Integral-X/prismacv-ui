import type {
  CvAnalysisResultContract,
  CvOptimizationResultContract,
} from "./contracts";
import { toCvAnalysis, toCvOptimization } from "./mappers";

describe("toCvAnalysis", () => {
  it("maps scores, issues, and suggestions into the domain shape", () => {
    const contract = {
      overallScore: 78,
      grammarScore: 90,
      readabilityScore: 70,
      atsScore: 65,
      issues: [
        {
          section: "summary",
          type: "grammar",
          severity: "high",
          message: "Passive voice detected.",
          suggestion: "Use active voice.",
        },
      ],
      suggestions: [
        {
          section: "experience",
          type: "improvement",
          message: "Quantify achievements.",
          originalText: "Led a team",
          suggestedText: "Led a team of 6 engineers",
        },
      ],
    } satisfies CvAnalysisResultContract;

    const result = toCvAnalysis(contract);

    expect(result.overallScore).toBe(78);
    expect(result.grammarScore).toBe(90);
    expect(result.readabilityScore).toBe(70);
    expect(result.atsScore).toBe(65);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toEqual({
      section: "summary",
      type: "grammar",
      severity: "high",
      message: "Passive voice detected.",
      suggestion: "Use active voice.",
    });
    expect(result.suggestions[0].originalText).toBe("Led a team");
    expect(result.suggestions[0].suggestedText).toBe(
      "Led a team of 6 engineers"
    );
  });

  it("coalesces missing optional issue and suggestion fields to null", () => {
    const contract = {
      overallScore: 50,
      grammarScore: 50,
      readabilityScore: 50,
      atsScore: 50,
      issues: [
        {
          section: "skills",
          type: "ats",
          severity: "low",
          message: "Add more keywords.",
        },
      ],
      suggestions: [
        {
          section: "skills",
          type: "addition",
          message: "Add a cloud section.",
        },
      ],
    } satisfies CvAnalysisResultContract;

    const result = toCvAnalysis(contract);

    expect(result.issues[0].suggestion).toBeNull();
    expect(result.suggestions[0].originalText).toBeNull();
    expect(result.suggestions[0].suggestedText).toBeNull();
  });
});

describe("toCvOptimization", () => {
  it("maps match score, keywords, suggestions, and recommendations", () => {
    const contract = {
      matchScore: 82,
      missingKeywords: ["Kubernetes", "Terraform"],
      suggestions: [
        {
          section: "summary",
          type: "improvement",
          message: "Mention cloud experience.",
          originalText: "Backend developer",
          suggestedText: "Cloud-native backend developer",
        },
      ],
      sectionRecommendations: [
        {
          section: "skills",
          action: "add",
          message: "Add a DevOps section.",
          priority: "high",
        },
      ],
    } satisfies CvOptimizationResultContract;

    const result = toCvOptimization(contract);

    expect(result.matchScore).toBe(82);
    expect(result.missingKeywords).toEqual(["Kubernetes", "Terraform"]);
    expect(result.suggestions[0].suggestedText).toBe(
      "Cloud-native backend developer"
    );
    expect(result.sectionRecommendations[0]).toEqual({
      section: "skills",
      action: "add",
      message: "Add a DevOps section.",
      priority: "high",
    });
  });

  it("maps empty suggestion and recommendation collections to empty arrays", () => {
    const contract = {
      matchScore: 40,
      missingKeywords: ["Go"],
      suggestions: [],
      sectionRecommendations: [],
    } satisfies CvOptimizationResultContract;

    const result = toCvOptimization(contract);

    expect(result.missingKeywords).toEqual(["Go"]);
    expect(result.suggestions).toEqual([]);
    expect(result.sectionRecommendations).toEqual([]);
  });
});
