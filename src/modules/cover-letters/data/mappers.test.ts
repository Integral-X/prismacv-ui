import type { CoverLetterResponseContract } from "./contracts";
import { toCoverLetter } from "./mappers";

describe("toCoverLetter", () => {
  it("maps the contract and parses timestamps into Dates", () => {
    const contract = {
      id: "cl_001",
      userId: "user_001",
      cvId: "cv_001",
      title: "Application for Acme",
      content: "Dear hiring manager...",
      jobTitle: "Senior Engineer",
      company: "Acme Corp",
      tone: "professional",
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-02T11:00:00.000Z",
    } satisfies CoverLetterResponseContract;

    const result = toCoverLetter(contract);

    expect(result.createdAt).toEqual(new Date("2026-04-01T10:00:00.000Z"));
    expect(result.updatedAt).toEqual(new Date("2026-04-02T11:00:00.000Z"));
    expect(result.title).toBe("Application for Acme");
    expect(result.company).toBe("Acme Corp");
  });

  it("preserves null cv, job title, and company values", () => {
    const contract = {
      id: "cl_002",
      userId: "user_001",
      cvId: null,
      title: "Generic letter",
      content: "Body",
      jobTitle: null,
      company: null,
      tone: "casual",
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-01T10:00:00.000Z",
    } satisfies CoverLetterResponseContract;

    const result = toCoverLetter(contract);

    expect(result.cvId).toBeNull();
    expect(result.jobTitle).toBeNull();
    expect(result.company).toBeNull();
  });
});
