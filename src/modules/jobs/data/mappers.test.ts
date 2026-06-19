import type {
  JobResponseContract,
  JobStatsResponseContract,
} from "./contracts";
import { toJob, toJobNote, toJobStats } from "./mappers";

describe("toJob", () => {
  it("maps a fully populated job contract into the domain shape", () => {
    const contract = {
      id: "job_001",
      title: "Senior Engineer",
      company: "Acme Corp",
      url: "https://acme.example/jobs/1",
      location: "Berlin",
      isRemote: true,
      salaryMin: 80000,
      salaryMax: 120000,
      salaryCurrency: "EUR",
      status: "APPLIED",
      appliedAt: "2026-04-10T09:00:00.000Z",
      notes: "Referred by a friend",
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-12T14:00:00.000Z",
      jobNotes: [
        {
          id: "note_001",
          content: "Phone screen scheduled",
          createdAt: "2026-04-11T08:00:00.000Z",
        },
      ],
    } satisfies JobResponseContract;

    const result = toJob(contract);

    expect(result.status).toBe("applied");
    expect(result.url).toBe("https://acme.example/jobs/1");
    expect(result.salaryMin).toBe(80000);
    expect(result.appliedAt).toEqual(new Date("2026-04-10T09:00:00.000Z"));
    expect(result.createdAt).toEqual(new Date("2026-04-01T10:00:00.000Z"));
    expect(result.updatedAt).toEqual(new Date("2026-04-12T14:00:00.000Z"));
    expect(result.jobNotes).toHaveLength(1);
    expect(result.jobNotes[0].content).toBe("Phone screen scheduled");
  });

  it("coalesces absent optional fields to null and notes to an empty array", () => {
    const contract = {
      id: "job_002",
      title: "Junior Developer",
      company: "Startup Inc",
      isRemote: false,
      status: "SAVED",
      createdAt: "2026-05-01T00:00:00.000Z",
      updatedAt: "2026-05-01T00:00:00.000Z",
    } satisfies JobResponseContract;

    const result = toJob(contract);

    expect(result.url).toBeNull();
    expect(result.location).toBeNull();
    expect(result.salaryMin).toBeNull();
    expect(result.salaryMax).toBeNull();
    expect(result.salaryCurrency).toBeNull();
    expect(result.appliedAt).toBeNull();
    expect(result.notes).toBeNull();
    expect(result.jobNotes).toEqual([]);
  });

  it("lowercases each backend status value", () => {
    const statuses = [
      ["SAVED", "saved"],
      ["APPLIED", "applied"],
      ["INTERVIEW", "interview"],
      ["OFFER", "offer"],
      ["REJECTED", "rejected"],
    ] as const;

    for (const [wire, domain] of statuses) {
      const result = toJob({
        id: "job",
        title: "t",
        company: "c",
        isRemote: false,
        status: wire,
        createdAt: "2026-05-01T00:00:00.000Z",
        updatedAt: "2026-05-01T00:00:00.000Z",
      } satisfies JobResponseContract);

      expect(result.status).toBe(domain);
    }
  });
});

describe("toJobNote", () => {
  it("parses the createdAt string into a Date", () => {
    const result = toJobNote({
      id: "note_001",
      content: "Followed up via email",
      createdAt: "2026-04-15T12:30:00.000Z",
    });

    expect(result).toEqual({
      id: "note_001",
      content: "Followed up via email",
      createdAt: new Date("2026-04-15T12:30:00.000Z"),
    });
  });
});

describe("toJobStats", () => {
  it("passes through the aggregate counters", () => {
    const contract = {
      total: 12,
      byStatus: { saved: 4, applied: 5, interview: 3 },
      appliedThisWeek: 2,
      pendingInterviews: 3,
      activeOffers: 1,
    } satisfies JobStatsResponseContract;

    const result = toJobStats(contract);

    expect(result).toEqual(contract);
  });
});
