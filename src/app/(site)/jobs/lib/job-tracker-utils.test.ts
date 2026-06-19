import type { Job } from "@/modules/jobs/data/mappers";

import { DEFAULT_JOB_TRACKER_FILTERS } from "./job-tracker-types";
import { detectJobSource, filterAndSortJobs } from "./job-tracker-utils";

function createJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc",
    url: "https://www.linkedin.com/jobs/view/123",
    location: "San Francisco, CA",
    isRemote: true,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    status: "saved",
    appliedAt: new Date("2026-05-01"),
    notes: null,
    createdAt: new Date("2026-05-01"),
    updatedAt: new Date("2026-05-20"),
    jobNotes: [],
    ...overrides,
  };
}

describe("job-tracker-utils", () => {
  it("detects LinkedIn source from job URL", () => {
    expect(detectJobSource("https://linkedin.com/jobs/123")).toBe("linkedin");
  });

  it("filters jobs by search keyword", () => {
    const jobs = [
      createJob(),
      createJob({
        id: "job-2",
        title: "Product Designer",
        company: "Linear",
        url: null,
      }),
    ];

    const result = filterAndSortJobs(jobs, {
      ...DEFAULT_JOB_TRACKER_FILTERS,
      search: "designer",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Product Designer");
  });

  it("sorts jobs by due date ascending", () => {
    const jobs = [
      createJob({ id: "late", appliedAt: new Date("2026-05-20") }),
      createJob({ id: "early", appliedAt: new Date("2026-05-01") }),
    ];

    const result = filterAndSortJobs(jobs, {
      ...DEFAULT_JOB_TRACKER_FILTERS,
      sort: "dueDateAsc",
    });

    expect(result.map((job) => job.id)).toEqual(["early", "late"]);
  });
});
