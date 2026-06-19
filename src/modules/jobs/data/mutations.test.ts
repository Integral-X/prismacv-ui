import { apiClient } from "@/shared/http/api-client";
import {
  createJob,
  createJobNote,
  deleteJob,
  deleteJobNote,
  updateJob,
  updateJobStatus,
} from "./mutations";
import type { JobResponseContract } from "./contracts";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/shared/auth/execute-authenticated-request", () => ({
  executeAuthenticatedRequest: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: "Bearer test-token" })
  ),
}));

const postMock = jest.mocked(apiClient.post);
const patchMock = jest.mocked(apiClient.patch);
const deleteMock = jest.mocked(apiClient.delete);

const authHeaders = { Authorization: "Bearer test-token" };

const jobContract: JobResponseContract = {
  id: "job_001",
  title: "Senior Engineer",
  company: "Acme Corp",
  isRemote: false,
  status: "SAVED",
  createdAt: "2026-04-01T10:00:00.000Z",
  updatedAt: "2026-04-01T10:00:00.000Z",
};

describe("jobs mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("posts the job body and maps the created job", async () => {
      postMock.mockResolvedValueOnce(jobContract);

      const result = await createJob({
        title: "Senior Engineer",
        company: "Acme Corp",
      });

      expect(postMock).toHaveBeenCalledWith(
        "jobs",
        { title: "Senior Engineer", company: "Acme Corp" },
        { headers: authHeaders }
      );
      expect(result.id).toBe("job_001");
      expect(result.status).toBe("saved");
    });
  });

  describe("updateJob", () => {
    it("patches the job by id with the update body", async () => {
      patchMock.mockResolvedValueOnce({
        ...jobContract,
        title: "Lead Engineer",
      });

      const result = await updateJob("job_001", { title: "Lead Engineer" });

      expect(patchMock).toHaveBeenCalledWith(
        "jobs/job_001",
        { title: "Lead Engineer" },
        { headers: authHeaders }
      );
      expect(result.title).toBe("Lead Engineer");
    });
  });

  describe("updateJobStatus", () => {
    it("patches the status sub-resource and maps the result", async () => {
      patchMock.mockResolvedValueOnce({ ...jobContract, status: "INTERVIEW" });

      const result = await updateJobStatus("job_001", { status: "INTERVIEW" });

      expect(patchMock).toHaveBeenCalledWith(
        "jobs/job_001/status",
        { status: "INTERVIEW" },
        { headers: authHeaders }
      );
      expect(result.status).toBe("interview");
    });
  });

  describe("deleteJob", () => {
    it("sends a delete request for the job", async () => {
      deleteMock.mockResolvedValueOnce(undefined);

      await deleteJob("job_001");

      expect(deleteMock).toHaveBeenCalledWith("jobs/job_001", {
        headers: authHeaders,
      });
    });
  });

  describe("createJobNote", () => {
    it("posts a note under the job and maps it", async () => {
      postMock.mockResolvedValueOnce({
        id: "note_001",
        content: "Recruiter call",
        createdAt: "2026-04-11T08:00:00.000Z",
      });

      const result = await createJobNote("job_001", {
        content: "Recruiter call",
      });

      expect(postMock).toHaveBeenCalledWith(
        "jobs/job_001/notes",
        { content: "Recruiter call" },
        { headers: authHeaders }
      );
      expect(result).toEqual({
        id: "note_001",
        content: "Recruiter call",
        createdAt: new Date("2026-04-11T08:00:00.000Z"),
      });
    });
  });

  describe("deleteJobNote", () => {
    it("sends a delete request for the nested note", async () => {
      deleteMock.mockResolvedValueOnce(undefined);

      await deleteJobNote("job_001", "note_001");

      expect(deleteMock).toHaveBeenCalledWith("jobs/job_001/notes/note_001", {
        headers: authHeaders,
      });
    });
  });
});
