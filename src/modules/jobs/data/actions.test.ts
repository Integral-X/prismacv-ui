import { HttpError } from "@/shared/http/http-error";
import {
  createJobAction,
  createJobNoteAction,
  deleteJobAction,
  deleteJobNoteAction,
  updateJobAction,
  updateJobStatusAction,
} from "./actions";
import type { Job, JobNote } from "./mappers";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("./mutations", () => ({
  createJob: jest.fn(),
  updateJob: jest.fn(),
  updateJobStatus: jest.fn(),
  deleteJob: jest.fn(),
  createJobNote: jest.fn(),
  deleteJobNote: jest.fn(),
}));

const mutations = jest.requireMock("./mutations") as {
  createJob: jest.Mock;
  updateJob: jest.Mock;
  updateJobStatus: jest.Mock;
  deleteJob: jest.Mock;
  createJobNote: jest.Mock;
  deleteJobNote: jest.Mock;
};

const { revalidatePath } = jest.requireMock("next/cache") as {
  revalidatePath: jest.Mock;
};

const job: Job = {
  id: "job_001",
  title: "Senior Engineer",
  company: "Acme Corp",
  url: null,
  location: null,
  isRemote: false,
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: null,
  status: "saved",
  appliedAt: null,
  notes: null,
  createdAt: new Date("2026-04-01T10:00:00.000Z"),
  updatedAt: new Date("2026-04-01T10:00:00.000Z"),
  jobNotes: [],
};

const note: JobNote = {
  id: "note_001",
  content: "Recruiter call",
  createdAt: new Date("2026-04-11T08:00:00.000Z"),
};

describe("jobs actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createJobAction", () => {
    it("returns the created job and revalidates the jobs list", async () => {
      mutations.createJob.mockResolvedValueOnce(job);

      const result = await createJobAction({
        title: "Senior Engineer",
        company: "Acme Corp",
      });

      expect(result).toEqual({
        ok: true,
        data: job,
        message: "Job added successfully.",
      });
      expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    });

    it("maps a 403 HttpError to forbidden and does not revalidate", async () => {
      mutations.createJob.mockRejectedValueOnce(
        new HttpError(403, "Forbidden", "Not allowed")
      );

      const result = await createJobAction({ title: "t", company: "c" });

      expect(result).toEqual({
        ok: false,
        code: "forbidden",
        message: "Not allowed",
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("maps a generic error to the unknown fallback", async () => {
      mutations.createJob.mockRejectedValueOnce(new Error("boom"));

      const result = await createJobAction({ title: "t", company: "c" });

      expect(result).toEqual({
        ok: false,
        code: "unknown",
        message: "Unable to add the job.",
      });
    });
  });

  describe("updateJobAction", () => {
    it("returns the updated job with a success message", async () => {
      mutations.updateJob.mockResolvedValueOnce(job);

      const result = await updateJobAction("job_001", { title: "Lead" });

      expect(result).toEqual({ ok: true, data: job, message: "Job updated." });
      expect(mutations.updateJob).toHaveBeenCalledWith("job_001", {
        title: "Lead",
      });
      expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    });
  });

  describe("updateJobStatusAction", () => {
    it("returns the job with a status-updated message", async () => {
      mutations.updateJobStatus.mockResolvedValueOnce(job);

      const result = await updateJobStatusAction("job_001", {
        status: "INTERVIEW",
      });

      expect(result).toEqual({
        ok: true,
        data: job,
        message: "Status updated.",
      });
    });

    it("maps a 404 HttpError to not_found", async () => {
      mutations.updateJobStatus.mockRejectedValueOnce(
        new HttpError(404, "Not Found", "Job not found")
      );

      const result = await updateJobStatusAction("missing", {
        status: "OFFER",
      });

      expect(result).toEqual({
        ok: false,
        code: "not_found",
        message: "Job not found",
      });
    });
  });

  describe("deleteJobAction", () => {
    it("returns success and revalidates the jobs list", async () => {
      mutations.deleteJob.mockResolvedValueOnce(undefined);

      const result = await deleteJobAction("job_001");

      expect(result).toEqual({ ok: true, message: "Job deleted." });
      expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    });
  });

  describe("createJobNoteAction", () => {
    it("returns the created note and revalidates the job detail page", async () => {
      mutations.createJobNote.mockResolvedValueOnce(note);

      const result = await createJobNoteAction("job_001", {
        content: "Recruiter call",
      });

      expect(result).toEqual({ ok: true, data: note, message: "Note added." });
      expect(revalidatePath).toHaveBeenCalledWith("/jobs/job_001");
    });
  });

  describe("deleteJobNoteAction", () => {
    it("returns success and revalidates the job detail page", async () => {
      mutations.deleteJobNote.mockResolvedValueOnce(undefined);

      const result = await deleteJobNoteAction("job_001", "note_001");

      expect(result).toEqual({ ok: true, message: "Note deleted." });
      expect(revalidatePath).toHaveBeenCalledWith("/jobs/job_001");
    });
  });
});
