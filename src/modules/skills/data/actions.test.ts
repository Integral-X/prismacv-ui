import { HttpError } from "@/shared/http/http-error";
import {
  assessSkillsAction,
  fetchRoadmapAction,
  updateSkillProgressAction,
} from "./actions";
import type {
  LearningRoadmap,
  SkillGapResult,
  UserSkillProgress,
} from "./mappers";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("./mutations", () => ({
  assessSkills: jest.fn(),
  updateSkillProgress: jest.fn(),
}));

jest.mock("./queries", () => ({
  getLearningRoadmap: jest.fn(),
}));

const mutations = jest.requireMock("./mutations") as {
  assessSkills: jest.Mock;
  updateSkillProgress: jest.Mock;
};

const queries = jest.requireMock("./queries") as {
  getLearningRoadmap: jest.Mock;
};

const { revalidatePath } = jest.requireMock("next/cache") as {
  revalidatePath: jest.Mock;
};

const gapResult: SkillGapResult = {
  targetRole: "Backend Engineer",
  overallReadiness: 70,
  requiredSkills: [],
  strengths: [],
  gaps: [],
};

const progress: UserSkillProgress = {
  id: "prog_001",
  skillName: "React",
  level: 3,
  status: "completed",
  startedAt: null,
  completedAt: null,
};

const roadmap: LearningRoadmap = {
  targetRole: "DevOps Engineer",
  totalSkills: 0,
  completedSkills: 0,
  milestones: [],
};

describe("skills actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("assessSkillsAction", () => {
    it("returns the assessment result on success", async () => {
      mutations.assessSkills.mockResolvedValueOnce(gapResult);

      const result = await assessSkillsAction({
        targetRole: "Backend Engineer",
      });

      expect(result).toEqual({ ok: true, data: gapResult });
      expect(mutations.assessSkills).toHaveBeenCalledWith({
        targetRole: "Backend Engineer",
      });
    });

    it("maps a generic error to the unknown fallback", async () => {
      mutations.assessSkills.mockRejectedValueOnce(new Error("boom"));

      const result = await assessSkillsAction({ targetRole: "x" });

      expect(result).toEqual({
        ok: false,
        code: "unknown",
        message: "Unable to assess your skills.",
      });
    });
  });

  describe("updateSkillProgressAction", () => {
    it("returns progress and revalidates the skills and roadmap pages", async () => {
      mutations.updateSkillProgress.mockResolvedValueOnce(progress);

      const result = await updateSkillProgressAction({ skillName: "React" });

      expect(result).toEqual({
        ok: true,
        data: progress,
        message: "Progress updated.",
      });
      expect(revalidatePath).toHaveBeenCalledWith("/skills");
      expect(revalidatePath).toHaveBeenCalledWith("/skills/roadmap");
    });

    it("maps a 401 HttpError to unauthorized and skips revalidation", async () => {
      mutations.updateSkillProgress.mockRejectedValueOnce(
        new HttpError(401, "Unauthorized", "Session expired")
      );

      const result = await updateSkillProgressAction({ skillName: "React" });

      expect(result).toEqual({
        ok: false,
        code: "unauthorized",
        message: "Session expired",
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("fetchRoadmapAction", () => {
    it("returns the roadmap from the query on success", async () => {
      queries.getLearningRoadmap.mockResolvedValueOnce(roadmap);

      const result = await fetchRoadmapAction("DevOps Engineer");

      expect(result).toEqual({ ok: true, data: roadmap });
      expect(queries.getLearningRoadmap).toHaveBeenCalledWith(
        "DevOps Engineer"
      );
    });

    it("maps a 404 HttpError to not_found", async () => {
      queries.getLearningRoadmap.mockRejectedValueOnce(
        new HttpError(404, "Not Found", "No roadmap for role")
      );

      const result = await fetchRoadmapAction("Unknown Role");

      expect(result).toEqual({
        ok: false,
        code: "not_found",
        message: "No roadmap for role",
      });
    });
  });
});
