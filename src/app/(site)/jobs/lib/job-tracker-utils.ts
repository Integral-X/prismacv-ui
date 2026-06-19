import type { Job } from "@/modules/jobs/data/mappers";

import type {
  JobDateFilter,
  JobSourceFilter,
  JobTrackerFilters,
  JobTypeFilter,
} from "./job-tracker-types";

function jobDueTimestamp(job: Job): number {
  const date = job.appliedAt ?? job.updatedAt;
  return date.getTime();
}

export function detectJobSource(url: string | null): JobSourceFilter | null {
  if (!url) return "other";
  const normalized = url.toLowerCase();
  if (normalized.includes("linkedin")) return "linkedin";
  if (normalized.includes("facebook")) return "facebook";
  return "other";
}

function matchesDateFilter(job: Job, filters: JobDateFilter[]): boolean {
  if (filters.length === 0) return true;

  const reference = job.appliedAt ?? job.createdAt;
  const ageMs = Date.now() - reference.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  return filters.some((filter) => {
    const maxDays = Number(filter);
    return ageDays <= maxDays;
  });
}

function matchesJobTypeFilter(job: Job, filters: JobTypeFilter[]): boolean {
  if (filters.length === 0) return true;

  return filters.some((filter) => {
    if (filter === "remote") return job.isRemote;
    if (filter === "onsite") return !job.isRemote && Boolean(job.location);
    return !job.isRemote;
  });
}

function matchesSourceFilter(job: Job, filters: JobSourceFilter[]): boolean {
  if (filters.length === 0) return true;
  const source = detectJobSource(job.url);
  return source !== null && filters.includes(source);
}

export function filterAndSortJobs(
  jobs: Job[],
  filters: JobTrackerFilters
): Job[] {
  const query = filters.search.trim().toLowerCase();

  let result = jobs.filter((job) => {
    if (query.length > 0) {
      const haystack = [job.title, job.company, job.location ?? ""]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return (
      matchesDateFilter(job, filters.dateApplied) &&
      matchesJobTypeFilter(job, filters.jobTypes) &&
      matchesSourceFilter(job, filters.sources)
    );
  });

  if (filters.sort === "dueDateAsc") {
    result = [...result].sort(
      (a, b) => jobDueTimestamp(a) - jobDueTimestamp(b)
    );
  } else if (filters.sort === "dueDateDesc") {
    result = [...result].sort(
      (a, b) => jobDueTimestamp(b) - jobDueTimestamp(a)
    );
  }

  return result;
}

export function formatTrackerDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatColumnCount(count: number): string {
  return count.toString().padStart(2, "0");
}

export function titleFromJobUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return `Role at ${hostname}`;
  } catch {
    return "Job posting";
  }
}
