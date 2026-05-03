import type {
  JobNoteResponseContract,
  JobResponseContract,
  JobStatsResponseContract,
  JobStatusContract,
} from './contracts';

// ─── Domain types ─────────────────────────────────────────────────────────────

export type JobStatus =
  | 'saved'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface JobNote {
  id: string;
  content: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  url: string | null;
  location: string | null;
  isRemote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  status: JobStatus;
  appliedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  jobNotes: JobNote[];
}

export interface JobStats {
  total: number;
  byStatus: Record<string, number>;
  appliedThisWeek: number;
  pendingInterviews: number;
  activeOffers: number;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<JobStatusContract, JobStatus> = {
  SAVED: 'saved',
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
};

export function toJobNote(contract: JobNoteResponseContract): JobNote {
  return {
    id: contract.id,
    content: contract.content,
    createdAt: new Date(contract.createdAt),
  };
}

export function toJob(contract: JobResponseContract): Job {
  return {
    id: contract.id,
    title: contract.title,
    company: contract.company,
    url: contract.url ?? null,
    location: contract.location ?? null,
    isRemote: contract.isRemote,
    salaryMin: contract.salaryMin ?? null,
    salaryMax: contract.salaryMax ?? null,
    salaryCurrency: contract.salaryCurrency ?? null,
    status: STATUS_MAP[contract.status] ?? 'saved',
    appliedAt: contract.appliedAt ? new Date(contract.appliedAt) : null,
    notes: contract.notes ?? null,
    createdAt: new Date(contract.createdAt),
    updatedAt: new Date(contract.updatedAt),
    jobNotes: (contract.jobNotes ?? []).map(toJobNote),
  };
}

export function toJobStats(contract: JobStatsResponseContract): JobStats {
  return {
    total: contract.total,
    byStatus: contract.byStatus,
    appliedThisWeek: contract.appliedThisWeek,
    pendingInterviews: contract.pendingInterviews,
    activeOffers: contract.activeOffers,
  };
}
