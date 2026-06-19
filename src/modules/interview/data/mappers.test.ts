import type { InterviewQuestionContract } from "./contracts";
import { toInterviewQuestion } from "./mappers";

describe("toInterviewQuestion", () => {
  it("maps a full question and lowercases the difficulty", () => {
    const contract = {
      id: "q_001",
      question: "Explain event loop.",
      sampleAnswer: "The event loop...",
      category: "JavaScript",
      role: "Frontend Engineer",
      difficulty: "HARD",
      tips: "Mention microtasks.",
    } satisfies InterviewQuestionContract;

    const result = toInterviewQuestion(contract);

    expect(result).toEqual({
      id: "q_001",
      question: "Explain event loop.",
      sampleAnswer: "The event loop...",
      category: "JavaScript",
      role: "Frontend Engineer",
      difficulty: "hard",
      tips: "Mention microtasks.",
    });
  });

  it("coalesces absent sample answer and tips to null", () => {
    const contract = {
      id: "q_002",
      question: "What is closure?",
      category: "JavaScript",
      role: "Frontend Engineer",
      difficulty: "EASY",
    } satisfies InterviewQuestionContract;

    const result = toInterviewQuestion(contract);

    expect(result.sampleAnswer).toBeNull();
    expect(result.tips).toBeNull();
    expect(result.difficulty).toBe("easy");
  });

  it("maps each difficulty level to its lowercase domain value", () => {
    const levels = [
      ["EASY", "easy"],
      ["MEDIUM", "medium"],
      ["HARD", "hard"],
    ] as const;

    for (const [wire, domain] of levels) {
      const result = toInterviewQuestion({
        id: "q",
        question: "q?",
        category: "c",
        role: "r",
        difficulty: wire,
      } satisfies InterviewQuestionContract);

      expect(result.difficulty).toBe(domain);
    }
  });
});
