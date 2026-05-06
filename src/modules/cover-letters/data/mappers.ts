import type { CoverLetterResponseContract } from './contracts';

// ─── Domain model ─────────────────────────────────────────────────────────────

export interface CoverLetter {
  id: string;
  userId: string;
  cvId: string | null;
  title: string;
  content: string;
  jobTitle: string | null;
  company: string | null;
  tone: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

export function toCoverLetter(
  contract: CoverLetterResponseContract
): CoverLetter {
  return {
    id: contract.id,
    userId: contract.userId,
    cvId: contract.cvId,
    title: contract.title,
    content: contract.content,
    jobTitle: contract.jobTitle,
    company: contract.company,
    tone: contract.tone,
    createdAt: new Date(contract.createdAt),
    updatedAt: new Date(contract.updatedAt),
  };
}
