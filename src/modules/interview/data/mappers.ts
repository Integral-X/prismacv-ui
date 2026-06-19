import type {
  InterviewDifficultyContract,
  InterviewQuestionContract,
} from "./contracts";

// ─── Domain types ─────────────────────────────────────────────────────────────

export type InterviewDifficulty = "easy" | "medium" | "hard";

export interface InterviewQuestion {
  id: string;
  question: string;
  sampleAnswer: string | null;
  category: string;
  role: string;
  difficulty: InterviewDifficulty;
  tips: string | null;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_MAP: Record<InterviewDifficultyContract, InterviewDifficulty> =
  {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
  };

export function toInterviewQuestion(
  c: InterviewQuestionContract
): InterviewQuestion {
  return {
    id: c.id,
    question: c.question,
    sampleAnswer: c.sampleAnswer ?? null,
    category: c.category,
    role: c.role,
    difficulty: DIFFICULTY_MAP[c.difficulty] ?? "medium",
    tips: c.tips ?? null,
  };
}
