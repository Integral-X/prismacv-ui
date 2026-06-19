import type {
  LearningResourceContract,
  LearningRoadmapContract,
  SkillCategoryContract,
  SkillGapResponseContract,
  UserSkillProgressContract,
} from "./contracts";
import {
  toLearningResource,
  toLearningRoadmap,
  toSkillCategory,
  toSkillGapResult,
  toUserSkillProgress,
} from "./mappers";

describe("toSkillCategory", () => {
  it("maps a category and coalesces optional description and icon to null", () => {
    const contract = {
      id: "cat_001",
      name: "Frontend",
    } satisfies SkillCategoryContract;

    expect(toSkillCategory(contract)).toEqual({
      id: "cat_001",
      name: "Frontend",
      description: null,
      icon: null,
    });
  });
});

describe("toSkillGapResult", () => {
  it("maps required skills and coalesces an absent user level to null", () => {
    const contract = {
      targetRole: "Backend Engineer",
      overallReadiness: 64,
      requiredSkills: [
        {
          skillName: "Go",
          category: "Languages",
          importance: 5,
          hasSkill: false,
        },
        {
          skillName: "PostgreSQL",
          category: "Databases",
          importance: 4,
          hasSkill: true,
          userLevel: 3,
        },
      ],
      strengths: ["PostgreSQL"],
      gaps: ["Go"],
    } satisfies SkillGapResponseContract;

    const result = toSkillGapResult(contract);

    expect(result.overallReadiness).toBe(64);
    expect(result.requiredSkills[0].userLevel).toBeNull();
    expect(result.requiredSkills[1].userLevel).toBe(3);
    expect(result.strengths).toEqual(["PostgreSQL"]);
    expect(result.gaps).toEqual(["Go"]);
  });
});

describe("toUserSkillProgress", () => {
  it("parses present dates and coalesces absent ones to null", () => {
    const started = {
      id: "prog_001",
      skillName: "React",
      level: 2,
      status: "in_progress",
      startedAt: "2026-04-01T00:00:00.000Z",
    } satisfies UserSkillProgressContract;

    const result = toUserSkillProgress(started);

    expect(result.startedAt).toEqual(new Date("2026-04-01T00:00:00.000Z"));
    expect(result.completedAt).toBeNull();
  });
});

describe("toLearningResource", () => {
  it("coalesces an absent duration to null", () => {
    const contract = {
      id: "res_001",
      skillName: "Docker",
      title: "Docker Basics",
      url: "https://learn.example/docker",
      platform: "ExampleLearn",
      difficulty: "beginner",
      isFree: true,
    } satisfies LearningResourceContract;

    expect(toLearningResource(contract).duration).toBeNull();
  });
});

describe("toLearningRoadmap", () => {
  it("maps milestones, nested skills, and their resources", () => {
    const contract = {
      targetRole: "DevOps Engineer",
      totalSkills: 2,
      completedSkills: 1,
      milestones: [
        {
          phase: "Foundations",
          description: "Core tooling",
          skills: [
            {
              skillName: "Linux",
              importance: 5,
              status: "completed",
              level: 4,
              resources: [
                {
                  id: "res_010",
                  skillName: "Linux",
                  title: "Linux CLI",
                  url: "https://learn.example/linux",
                  platform: "ExampleLearn",
                  difficulty: "beginner",
                  duration: "3h",
                  isFree: false,
                },
              ],
            },
          ],
        },
      ],
    } satisfies LearningRoadmapContract;

    const result = toLearningRoadmap(contract);

    expect(result.milestones).toHaveLength(1);
    expect(result.milestones[0].skills[0].skillName).toBe("Linux");
    expect(result.milestones[0].skills[0].resources[0].duration).toBe("3h");
    expect(result.milestones[0].skills[0].resources[0].isFree).toBe(false);
  });
});
