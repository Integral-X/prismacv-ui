// ─── Shared ──────────────────────────────────────────────────────────────────

export type JobStatusContract =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED';

// ─── Response contracts ─────────────────────────────────────────────────────

export interface JobNoteResponseContract {
  id: string;
  content: string;
  createdAt: string;
}

export interface JobResponseContract {
  id: string;
  title: string;
  company: string;
  url?: string;
  location?: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  status: JobStatusContract;
  appliedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  jobNotes?: JobNoteResponseContract[];
}

export interface JobStatsResponseContract {
  total: number;
  byStatus: Record<string, number>;
  appliedThisWeek: number;
  pendingInterviews: number;
  activeOffers: number;
}

// ─── Request contracts ──────────────────────────────────────────────────────

export interface CreateJobRequest {
  title: string;
  company: string;
  url?: string;
  location?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  status?: JobStatusContract;
  notes?: string;
}

export interface UpdateJobRequest {
  title?: string;
  company?: string;
  url?: string;
  location?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  notes?: string;
}

export interface UpdateJobStatusRequest {
  status: JobStatusContract;
}

export interface CreateJobNoteRequest {
  content: string;
}
