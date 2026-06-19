import { apiClient } from "@/shared/http/api-client";
import type {
  SkillGapResponseContract,
  UserSkillProgressContract,
} from "./contracts";
import { assessSkills, updateSkillProgress } from "./mutations";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: {
    post: jest.fn(),
    patch: jest.fn(),
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
const authHeaders = { Authorization: "Bearer test-token" };

const gapContract = {
  targetRole: "Backend Engineer",
  overallReadiness: 68,
  requiredSkills: [],
  strengths: ["TypeScript"],
  gaps: ["Go"],
} satisfies SkillGapResponseContract;

const progressContract = {
  id: "prog_001",
  skillName: "React",
  level: 3,
  status: "in_progress",
  startedAt: "2026-04-01T00:00:00.000Z",
} satisfies UserSkillProgressContract;

describe("skills mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("assessSkills", () => {
    it("posts the assessment request and maps the gap result", async () => {
      postMock.mockResolvedValueOnce(gapContract);

      const result = await assessSkills({ targetRole: "Backend Engineer" });

      expect(postMock).toHaveBeenCalledWith(
        "skills/assess",
        { targetRole: "Backend Engineer" },
        { headers: authHeaders }
      );
      expect(result.overallReadiness).toBe(68);
      expect(result.gaps).toEqual(["Go"]);
    });

    it("forwards current skills when provided", async () => {
      postMock.mockResolvedValueOnce(gapContract);

      await assessSkills({
        targetRole: "Backend Engineer",
        currentSkills: [{ name: "TypeScript", level: 4 }],
      });

      expect(postMock).toHaveBeenCalledWith(
        "skills/assess",
        {
          targetRole: "Backend Engineer",
          currentSkills: [{ name: "TypeScript", level: 4 }],
        },
        { headers: authHeaders }
      );
    });
  });

  describe("updateSkillProgress", () => {
    it("patches the progress endpoint and maps the result", async () => {
      patchMock.mockResolvedValueOnce(progressContract);

      const result = await updateSkillProgress({
        skillName: "React",
        level: 3,
        status: "in_progress",
      });

      expect(patchMock).toHaveBeenCalledWith(
        "skills/progress",
        { skillName: "React", level: 3, status: "in_progress" },
        { headers: authHeaders }
      );
      expect(result.skillName).toBe("React");
      expect(result.startedAt).toEqual(new Date("2026-04-01T00:00:00.000Z"));
      expect(result.completedAt).toBeNull();
    });
  });
});
