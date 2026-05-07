// ─── Request contracts ────────────────────────────────────────────────────────

export interface CreateCoverLetterRequest {
  title: string;
  cvId?: string;
  jobTitle?: string;
  company?: string;
  tone?: string;
  content?: string;
}

export interface UpdateCoverLetterRequest {
  title?: string;
  cvId?: string;
  jobTitle?: string;
  company?: string;
  tone?: string;
  content?: string;
}

export interface GenerateCoverLetterRequest {
  cvId: string;
  jobTitle?: string;
  company?: string;
  jobDescription?: string;
  tone?: string;
}

// ─── Response contracts ───────────────────────────────────────────────────────

export interface CoverLetterResponseContract {
  id: string;
  userId: string;
  cvId: string | null;
  title: string;
  content: string;
  jobTitle: string | null;
  company: string | null;
  tone: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedCoverLetterResponseContract {
  content: string;
  highlights?: string[];
}

// ─── Paginated response ───────────────────────────────────────────────────────

export interface PaginatedCoverLettersContract {
  data: CoverLetterResponseContract[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
