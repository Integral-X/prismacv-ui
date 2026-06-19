import { HttpError } from "@/shared/http/http-error";
import {
  getQueueJobStatusAction,
  queueAiAnalyzeAction,
  queueAiOptimizeAction,
  queuePdfExportAction,
} from "./actions";
import type {
  QueueJobAcceptedContract,
  QueueJobStatusContract,
} from "./contracts";

jest.mock("./mutations", () => ({
  getQueueJobStatus: jest.fn(),
  queueAiAnalyze: jest.fn(),
  queueAiOptimize: jest.fn(),
  queuePdfExport: jest.fn(),
}));

const mutations = jest.requireMock("./mutations") as {
  getQueueJobStatus: jest.Mock;
  queueAiAnalyze: jest.Mock;
  queueAiOptimize: jest.Mock;
  queuePdfExport: jest.Mock;
};

const accepted: QueueJobAcceptedContract = {
  jobId: "job_001",
  statusUrl: "/api/v1/queue/jobs/job_001",
};

describe("queue actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns accepted PDF export jobs", async () => {
    mutations.queuePdfExport.mockResolvedValueOnce(accepted);

    await expect(queuePdfExportAction({ cvId: "cv_001" })).resolves.toEqual({
      ok: true,
      data: accepted,
    });
  });

  it("returns accepted AI analysis jobs", async () => {
    mutations.queueAiAnalyze.mockResolvedValueOnce(accepted);

    await expect(queueAiAnalyzeAction({ cvId: "cv_001" })).resolves.toEqual({
      ok: true,
      data: accepted,
    });
  });

  it("returns accepted AI optimization jobs", async () => {
    mutations.queueAiOptimize.mockResolvedValueOnce(accepted);

    await expect(
      queueAiOptimizeAction({
        cvId: "cv_001",
        jobDescription: "Senior TypeScript engineer",
      })
    ).resolves.toEqual({
      ok: true,
      data: accepted,
    });
  });

  it("maps queue job status responses", async () => {
    const status: QueueJobStatusContract = {
      id: "job_001",
      state: "completed",
      type: "ai_analyze",
      result: {
        overallScore: 90,
        grammarScore: 88,
        readabilityScore: 82,
        atsScore: 79,
        issues: [],
        suggestions: [],
      },
      processedOn: "2026-06-01T10:00:00.000Z",
      finishedOn: "2026-06-01T10:00:05.000Z",
    };
    mutations.getQueueJobStatus.mockResolvedValueOnce(status);

    await expect(getQueueJobStatusAction("job_001")).resolves.toEqual({
      ok: true,
      data: {
        id: "job_001",
        state: "completed",
        type: "ai_analyze",
        result: status.result,
        error: null,
        processedOn: "2026-06-01T10:00:00.000Z",
        finishedOn: "2026-06-01T10:00:05.000Z",
      },
    });
  });

  it("maps queue failures to action failures", async () => {
    mutations.queuePdfExport.mockRejectedValueOnce(
      new HttpError(403, "Forbidden", "Upgrade required")
    );

    await expect(queuePdfExportAction({ cvId: "cv_001" })).resolves.toEqual({
      ok: false,
      code: "forbidden",
      message: "Upgrade required",
    });
  });
});
