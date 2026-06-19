import { apiClient } from "@/shared/http/api-client";
import { fetchCoverLetter, fetchCoverLetters } from "./queries";
import type {
  CoverLetterResponseContract,
  PaginatedCoverLettersContract,
} from "./contracts";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock("@/shared/auth/execute-authenticated-request", () => ({
  executeAuthenticatedRead: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: "Bearer test-token" })
  ),
}));

const getMock = jest.mocked(apiClient.get);
const authHeaders = { Authorization: "Bearer test-token" };

const letterContract: CoverLetterResponseContract = {
  id: "cl_001",
  userId: "user_001",
  cvId: "cv_001",
  title: "Application for Acme",
  content: "Dear hiring manager...",
  jobTitle: "Senior Engineer",
  company: "Acme Corp",
  tone: "professional",
  createdAt: "2026-04-01T10:00:00.000Z",
  updatedAt: "2026-04-02T11:00:00.000Z",
};

describe("cover-letters queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchCoverLetters", () => {
    it("fetches the first page by default and maps the list", async () => {
      const page: PaginatedCoverLettersContract = {
        data: [letterContract],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      getMock.mockResolvedValueOnce(page);

      const result = await fetchCoverLetters();

      expect(getMock).toHaveBeenCalledWith("cover-letters", {
        headers: authHeaders,
        params: { page: 1, limit: 20 },
      });
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.data[0].id).toBe("cl_001");
      expect(result.data[0].createdAt).toEqual(
        new Date("2026-04-01T10:00:00.000Z")
      );
    });

    it("forwards explicit page and limit values", async () => {
      getMock.mockResolvedValueOnce({
        data: [],
        total: 0,
        page: 3,
        limit: 5,
        totalPages: 0,
      } satisfies PaginatedCoverLettersContract);

      await fetchCoverLetters(3, 5);

      expect(getMock).toHaveBeenCalledWith("cover-letters", {
        headers: authHeaders,
        params: { page: 3, limit: 5 },
      });
    });
  });

  describe("fetchCoverLetter", () => {
    it("fetches a single cover letter by id and maps it", async () => {
      getMock.mockResolvedValueOnce(letterContract);

      const result = await fetchCoverLetter("cl_001");

      expect(getMock).toHaveBeenCalledWith("cover-letters/cl_001", {
        headers: authHeaders,
      });
      expect(result.title).toBe("Application for Acme");
    });
  });
});
