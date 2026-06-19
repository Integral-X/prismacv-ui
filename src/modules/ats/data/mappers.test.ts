import { toAtsScoreResult } from "./mappers";

describe("toAtsScoreResult", () => {
  it("maps contract fields into domain shape", () => {
    const result = toAtsScoreResult({
      overallScore: 72,
      keywordMatches: [
        {
          keyword: "TypeScript",
          found: true,
          importance: "required",
        },
      ],
      sectionScores: [
        { name: "Summary", score: 80, feedback: "Solid opening." },
      ],
      suggestions: ["Add metrics"],
      missingKeywords: ["Kubernetes"],
      keywordMatchRate: 65,
    });

    expect(result.overallScore).toBe(72);
    expect(result.keywordMatches[0]?.keyword).toBe("TypeScript");
    expect(result.missingKeywords).toEqual(["Kubernetes"]);
    expect(result.keywordMatchRate).toBe(65);
  });
});
