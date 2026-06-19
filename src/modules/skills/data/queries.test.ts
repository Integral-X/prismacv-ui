import { apiClient } from "@/shared/http/api-client";
import {
  getLearningRoadmap,
  getResources,
  getSkillCategories,
  getSkillRoles,
  getUserProgress,
} from "./queries";
import type {
  LearningResourceContract,
  LearningRoadmapContract,
  SkillCategoryContract,
  UserSkillProgressContract,
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

describe("skills queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSkillCategories", () => {
    it("fetches public categories without auth headers and maps them", async () => {
      const categories: SkillCategoryContract[] = [
        { id: "cat_001", name: "Frontend" },
      ];
      getMock.mockResolvedValueOnce(categories);

      const result = await getSkillCategories();

      expect(getMock).toHaveBeenCalledWith("skills/categories");
      expect(result[0]).toEqual({
        id: "cat_001",
        name: "Frontend",
        description: null,
        icon: null,
      });
    });
  });

  describe("getSkillRoles", () => {
    it("returns the raw role list from the backend", async () => {
      getMock.mockResolvedValueOnce(["Frontend Engineer", "Data Scientist"]);

      const result = await getSkillRoles();

      expect(getMock).toHaveBeenCalledWith("skills/roles");
      expect(result).toEqual(["Frontend Engineer", "Data Scientist"]);
    });
  });

  describe("getResources", () => {
    it("omits empty filter params", async () => {
      getMock.mockResolvedValueOnce([]);

      await getResources();

      expect(getMock).toHaveBeenCalledWith("skills/resources", { params: {} });
    });

    it("passes skill and difficulty filters when provided", async () => {
      const resources: LearningResourceContract[] = [
        {
          id: "res_001",
          skillName: "Docker",
          title: "Docker Basics",
          url: "https://learn.example/docker",
          platform: "ExampleLearn",
          difficulty: "beginner",
          isFree: true,
        },
      ];
      getMock.mockResolvedValueOnce(resources);

      const result = await getResources("Docker", "beginner");

      expect(getMock).toHaveBeenCalledWith("skills/resources", {
        params: { skill: "Docker", difficulty: "beginner" },
      });
      expect(result[0].duration).toBeNull();
    });
  });

  describe("getUserProgress", () => {
    it("fetches progress with auth headers and maps dates", async () => {
      const progress: UserSkillProgressContract[] = [
        {
          id: "prog_001",
          skillName: "React",
          level: 3,
          status: "completed",
          startedAt: "2026-04-01T00:00:00.000Z",
          completedAt: "2026-05-01T00:00:00.000Z",
        },
      ];
      getMock.mockResolvedValueOnce(progress);

      const result = await getUserProgress();

      expect(getMock).toHaveBeenCalledWith("skills/progress", {
        headers: authHeaders,
      });
      expect(result[0].completedAt).toEqual(
        new Date("2026-05-01T00:00:00.000Z")
      );
    });
  });

  describe("getLearningRoadmap", () => {
    it("fetches the roadmap for a role with auth headers and a role param", async () => {
      const roadmap: LearningRoadmapContract = {
        targetRole: "DevOps Engineer",
        totalSkills: 1,
        completedSkills: 0,
        milestones: [],
      };
      getMock.mockResolvedValueOnce(roadmap);

      const result = await getLearningRoadmap("DevOps Engineer");

      expect(getMock).toHaveBeenCalledWith("skills/roadmap", {
        headers: authHeaders,
        params: { role: "DevOps Engineer" },
      });
      expect(result.targetRole).toBe("DevOps Engineer");
    });
  });
});
