import type { Cv } from "@/modules/cv/data/mappers";
import { createEditorStore } from "./editor-store";

function buildCv(overrides: Partial<Cv> = {}): Cv {
  return {
    id: "cv_1",
    title: "My CV",
    slug: "my-cv",
    status: "draft",
    templateId: "horizon",
    isDefault: false,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    personalInfo: {
      id: "pi_1",
      fullName: "Ada Lovelace",
      email: null,
      phone: null,
      location: null,
      website: null,
      linkedinUrl: null,
      summary: "Original summary.",
      avatarUrl: null,
    },
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    customSections: [],
    layout: null,
    ...overrides,
  };
}

describe("editor store", () => {
  it("starts with every section saved and nothing dirty", () => {
    const store = createEditorStore(buildCv());
    const state = store.getState();

    expect(state.dirtySections.size).toBe(0);
    expect(state.sectionSave.personalInfo).toBe("saved");
    expect(state.sectionSave.skills).toBe("saved");
  });

  it("editing a personal-info field marks the section dirty and unsaved", () => {
    const store = createEditorStore(buildCv());

    store.getState().setPersonalInfoField("summary", "Rewritten summary.");
    const state = store.getState();

    expect(state.doc.personalInfo?.summary).toBe("Rewritten summary.");
    expect(state.dirtySections.has("personalInfo")).toBe(true);
    expect(state.sectionSave.personalInfo).toBe("unsaved");
  });

  it("seeds a blank record when editing a CV with no personal info", () => {
    const store = createEditorStore(buildCv({ personalInfo: null }));

    store.getState().setPersonalInfoField("fullName", "Grace Hopper");

    expect(store.getState().doc.personalInfo?.fullName).toBe("Grace Hopper");
  });

  it("markSaved clears the dirty flag and resets the indicator", () => {
    const store = createEditorStore(buildCv());

    store.getState().setPersonalInfoField("summary", "edited");
    store.getState().markSaving("personalInfo");
    expect(store.getState().sectionSave.personalInfo).toBe("saving");

    store.getState().markSaved("personalInfo");
    const state = store.getState();
    expect(state.dirtySections.has("personalInfo")).toBe(false);
    expect(state.sectionSave.personalInfo).toBe("saved");
  });

  it("markFailed surfaces a failed indicator without clearing the dirty buffer", () => {
    const store = createEditorStore(buildCv());

    store.getState().setPersonalInfoField("summary", "edited");
    store.getState().markFailed("personalInfo");
    const state = store.getState();

    expect(state.sectionSave.personalInfo).toBe("failed");
    expect(state.dirtySections.has("personalInfo")).toBe(true);
  });

  it("applyPersonalInfo reconciles from a server result without dirtying", () => {
    const store = createEditorStore(buildCv());

    store.getState().applyPersonalInfo({
      id: "pi_1",
      fullName: "Ada Lovelace",
      email: null,
      phone: null,
      location: null,
      website: null,
      linkedinUrl: null,
      summary: "AI-optimised summary.",
      avatarUrl: null,
    });
    const state = store.getState();

    expect(state.doc.personalInfo?.summary).toBe("AI-optimised summary.");
    expect(state.dirtySections.has("personalInfo")).toBe(false);
  });
});

describe("editor store — experiences", () => {
  function experienceCv() {
    return buildCv({
      experiences: [
        {
          id: "exp_1",
          company: "Analytical Engines",
          title: "Engineer",
          location: null,
          startDate: new Date("2024-01-01T00:00:00.000Z"),
          endDate: null,
          current: true,
          description: null,
          sortOrder: 0,
        },
      ],
    });
  }

  it("addExperience appends a blank entry and marks the section dirty", () => {
    const store = createEditorStore(buildCv());

    store.getState().addExperience();
    const state = store.getState();

    expect(state.doc.experiences).toHaveLength(1);
    expect(state.doc.experiences[0].company).toBe("");
    expect(state.dirtySections.has("experiences")).toBe(true);
    expect(state.sectionSave.experiences).toBe("unsaved");
  });

  it("setExperienceText edits only the targeted entry", () => {
    const store = createEditorStore(experienceCv());

    store.getState().setExperienceText("exp_1", "title", "Lead Engineer");
    const state = store.getState();

    expect(state.doc.experiences[0].title).toBe("Lead Engineer");
    expect(state.dirtySections.has("experiences")).toBe(true);
  });

  it("setExperienceCurrent clears the end date when set to current", () => {
    const store = createEditorStore(experienceCv());

    store
      .getState()
      .setExperienceEndDate("exp_1", new Date("2025-01-01T00:00:00.000Z"));
    store.getState().setExperienceCurrent("exp_1", true);

    expect(store.getState().doc.experiences[0].current).toBe(true);
    expect(store.getState().doc.experiences[0].endDate).toBeNull();
  });

  it("removeExperience drops the entry and marks dirty", () => {
    const store = createEditorStore(experienceCv());

    store.getState().removeExperience("exp_1");
    const state = store.getState();

    expect(state.doc.experiences).toHaveLength(0);
    expect(state.dirtySections.has("experiences")).toBe(true);
  });

  it("applyExperiences reconciles without dirtying", () => {
    const store = createEditorStore(experienceCv());

    store.getState().applyExperiences([]);
    const state = store.getState();

    expect(state.doc.experiences).toHaveLength(0);
    expect(state.dirtySections.has("experiences")).toBe(false);
  });
});

describe("editor store — education", () => {
  function educationCv() {
    return buildCv({
      education: [
        {
          id: "edu_1",
          institution: "Cambridge",
          degree: "BSc",
          field: null,
          startDate: new Date("2018-09-01T00:00:00.000Z"),
          endDate: null,
          gpa: null,
          description: null,
          sortOrder: 0,
        },
      ],
    });
  }

  it("addEducation appends a blank entry and marks the section dirty", () => {
    const store = createEditorStore(buildCv());

    store.getState().addEducation();
    const state = store.getState();

    expect(state.doc.education).toHaveLength(1);
    expect(state.doc.education[0].degree).toBe("");
    expect(state.dirtySections.has("education")).toBe(true);
    expect(state.sectionSave.education).toBe("unsaved");
  });

  it("setEducationText edits only the targeted entry", () => {
    const store = createEditorStore(educationCv());

    store.getState().setEducationText("edu_1", "degree", "BSc Mathematics");

    expect(store.getState().doc.education[0].degree).toBe("BSc Mathematics");
    expect(store.getState().dirtySections.has("education")).toBe(true);
  });

  it("removeEducation drops the entry and marks dirty", () => {
    const store = createEditorStore(educationCv());

    store.getState().removeEducation("edu_1");

    expect(store.getState().doc.education).toHaveLength(0);
    expect(store.getState().dirtySections.has("education")).toBe(true);
  });

  it("applyEducation reconciles without dirtying", () => {
    const store = createEditorStore(educationCv());

    store.getState().applyEducation([]);

    expect(store.getState().doc.education).toHaveLength(0);
    expect(store.getState().dirtySections.has("education")).toBe(false);
  });
});

describe("editor store — reorder", () => {
  function threeExperienceCv() {
    return buildCv({
      experiences: [
        {
          id: "exp_a",
          company: "A",
          title: "First",
          location: null,
          startDate: new Date("2024-01-01T00:00:00.000Z"),
          endDate: null,
          current: false,
          description: null,
          sortOrder: 0,
        },
        {
          id: "exp_b",
          company: "B",
          title: "Second",
          location: null,
          startDate: new Date("2024-01-01T00:00:00.000Z"),
          endDate: null,
          current: false,
          description: null,
          sortOrder: 1,
        },
        {
          id: "exp_c",
          company: "C",
          title: "Third",
          location: null,
          startDate: new Date("2024-01-01T00:00:00.000Z"),
          endDate: null,
          current: false,
          description: null,
          sortOrder: 2,
        },
      ],
    });
  }

  it("reorderExperiences moves an entry and marks the section dirty", () => {
    const store = createEditorStore(threeExperienceCv());

    store.getState().reorderExperiences(0, 2);
    const state = store.getState();

    expect(state.doc.experiences.map((entry) => entry.id)).toEqual([
      "exp_b",
      "exp_c",
      "exp_a",
    ]);
    expect(state.dirtySections.has("experiences")).toBe(true);
    expect(state.sectionSave.experiences).toBe("unsaved");
  });

  it("reorderExperiences moving up reorders correctly", () => {
    const store = createEditorStore(threeExperienceCv());

    store.getState().reorderExperiences(2, 0);

    expect(store.getState().doc.experiences.map((entry) => entry.id)).toEqual([
      "exp_c",
      "exp_a",
      "exp_b",
    ]);
  });

  it("reorder is a no-op for an out-of-range source index", () => {
    const store = createEditorStore(threeExperienceCv());

    store.getState().reorderExperiences(5, 0);

    expect(store.getState().doc.experiences.map((entry) => entry.id)).toEqual([
      "exp_a",
      "exp_b",
      "exp_c",
    ]);
  });

  it("reorderLanguages moves an entry within the languages section", () => {
    const store = createEditorStore(
      buildCv({
        languages: [
          {
            id: "lang_1",
            name: "English",
            proficiency: "native",
            sortOrder: 0,
          },
          {
            id: "lang_2",
            name: "French",
            proficiency: "fluent",
            sortOrder: 1,
          },
        ],
      })
    );

    store.getState().reorderLanguages(0, 1);
    const state = store.getState();

    expect(state.doc.languages.map((entry) => entry.id)).toEqual([
      "lang_2",
      "lang_1",
    ]);
    expect(state.dirtySections.has("languages")).toBe(true);
  });
});

describe("editor store — skills", () => {
  it("addSkill appends a blank uncategorized skill by default", () => {
    const store = createEditorStore(buildCv());

    store.getState().addSkill();
    const skills = store.getState().doc.skills;

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe("");
    expect(skills[0].category).toBeNull();
  });

  it("addSkill pre-assigns the given category", () => {
    const store = createEditorStore(buildCv());

    store.getState().addSkill("Frontend");

    expect(store.getState().doc.skills[0].category).toBe("Frontend");
  });
});

describe("editor store — layout", () => {
  it("seeds the default layout for a CV without one", () => {
    const store = createEditorStore(buildCv());
    const layout = store.getState().doc.layout;

    expect(layout.mainOrder).toEqual(["summary", "experience", "projects"]);
    expect(layout.sideOrder).toEqual([
      "skills",
      "education",
      "certifications",
      "languages",
    ]);
    expect(layout.hidden).toEqual([]);
  });

  it("reorders within a column and marks the layout section dirty", () => {
    const store = createEditorStore(buildCv());

    store.getState().reorderLayoutColumn("main", 0, 2);
    const state = store.getState();

    expect(state.doc.layout.mainOrder).toEqual([
      "experience",
      "projects",
      "summary",
    ]);
    expect(state.dirtySections.has("layout")).toBe(true);
    expect(state.sectionSave.layout).toBe("unsaved");
  });

  it("hide removes the section from its column and adds it to hidden", () => {
    const store = createEditorStore(buildCv());

    store.getState().hideLayoutSection("experience");
    const layout = store.getState().doc.layout;

    expect(layout.mainOrder).not.toContain("experience");
    expect(layout.hidden).toContain("experience");
  });

  it("show restores a hidden section to the end of its default column", () => {
    const store = createEditorStore(buildCv());

    store.getState().hideLayoutSection("experience");
    store.getState().showLayoutSection("experience");
    const layout = store.getState().doc.layout;

    expect(layout.hidden).not.toContain("experience");
    expect(layout.mainOrder[layout.mainOrder.length - 1]).toBe("experience");
  });

  it("setSectionTitle stores an override and clears it when reset to default", () => {
    const store = createEditorStore(buildCv());

    store.getState().setSectionTitle("experience", "Work History");
    expect(store.getState().doc.layout.titles.experience).toBe("Work History");

    store.getState().setSectionTitle("experience", "Experience");
    expect(store.getState().doc.layout.titles.experience).toBeUndefined();
  });

  it("clears a title override when blanked", () => {
    const store = createEditorStore(buildCv());

    store.getState().setSectionTitle("skills", "Toolbox");
    store.getState().setSectionTitle("skills", "   ");

    expect(store.getState().doc.layout.titles.skills).toBeUndefined();
  });
});
