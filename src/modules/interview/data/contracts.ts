// ─── Response contracts ─────────────────────────────────────────────────────

export type InterviewDifficultyContract = 'EASY' | 'MEDIUM' | 'HARD';

export interface InterviewQuestionContract {
  id: string;
  question: string;
  sampleAnswer?: string;
  category: string;
  role: string;
  difficulty: InterviewDifficultyContract;
  tips?: string;
}
