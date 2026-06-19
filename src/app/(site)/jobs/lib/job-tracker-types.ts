import type { JobStatus } from "@/modules/jobs/data/mappers";

export type JobSortOption = "dueDateAsc" | "dueDateDesc" | "none";

export type JobDateFilter = "7" | "14" | "30";

export type JobTypeFilter = "remote" | "onsite" | "hybrid";

export type JobSourceFilter = "linkedin" | "facebook" | "other";

export interface JobTrackerFilters {
  search: string;
  sort: JobSortOption;
  dateApplied: JobDateFilter[];
  jobTypes: JobTypeFilter[];
  sources: JobSourceFilter[];
}

export const DEFAULT_JOB_TRACKER_FILTERS: JobTrackerFilters = {
  search: "",
  sort: "none",
  dateApplied: [],
  jobTypes: [],
  sources: [],
};

export const JOB_TRACKER_COLUMNS: JobStatus[] = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
];
