import type {
  Certification,
  Cv,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  Skill,
} from "@/modules/cv/data/mappers";
import {
  emptyEducation,
  emptyExperience,
  emptyPersonalInfo,
  toCertificationRequests,
  toEditorDocument,
  toEducationRequests,
  toExperienceRequests,
  toLanguageRequests,
  toLayoutRequest,
  toLiveCv,
  toPersonalInfoRequest,
  toProjectRequests,
  toSkillRequests,
} from "./editor-model";
import { defaultSectionLayout } from "./section-layout";

const personalInfo: PersonalInfo = {
  id: "pi_1",
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  phone: null,
  location: "London",
  website: null,
  linkedinUrl: null,
  summary: "Mathematician and first programmer.",
  avatarUrl: null,
};

const cv: Cv = {
  id: "cv_1",
  title: "My CV",
  slug: "my-cv",
  status: "draft",
  templateId: "horizon",
  isDefault: false,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
  personalInfo,
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  customSections: [],
  layout: null,
};

const experience: Experience = {
  id: "exp_1",
  company: "Analytical Engines",
  title: "Lead Engineer",
  location: "London",
  startDate: new Date("2024-01-01T00:00:00.000Z"),
  endDate: null,
  current: true,
  description: "Built the first program.",
  sortOrder: 0,
};

describe("toExperienceRequests", () => {
  it("denormalises experiences and reindexes sortOrder by position", () => {
    const [first, second] = toExperienceRequests([
      { ...experience, sortOrder: 9 },
      { ...experience, id: "exp_2", sortOrder: 4 },
    ]);

    expect(first.company).toBe("Analytical Engines");
    expect(first.startDate).toBe("2024-01-01T00:00:00.000Z");
    expect(first.current).toBe(true);
    expect(first.sortOrder).toBe(0);
    expect(second.sortOrder).toBe(1);
  });

  it("maps null end date and optional fields to undefined", () => {
    const [request] = toExperienceRequests([
      { ...experience, location: null, description: null },
    ]);

    expect(request.endDate).toBeUndefined();
    expect(request.location).toBeUndefined();
    expect(request.description).toBeUndefined();
  });

  it("drops entries still missing the required company or title", () => {
    const requests = toExperienceRequests([
      { ...experience, id: "a" },
      { ...experience, id: "b", company: "", title: "Engineer" },
      { ...experience, id: "c", title: "   " },
    ]);

    expect(requests).toHaveLength(1);
    expect(requests[0].company).toBe("Analytical Engines");
    expect(requests[0].sortOrder).toBe(0);
  });
});

describe("emptyExperience", () => {
  it("creates a blank entry with the given id and sort order", () => {
    const blank = emptyExperience("experience-local-1", 3);

    expect(blank.id).toBe("experience-local-1");
    expect(blank.company).toBe("");
    expect(blank.title).toBe("");
    expect(blank.current).toBe(false);
    expect(blank.sortOrder).toBe(3);
    expect(blank.startDate).toBeInstanceOf(Date);
  });
});

const educationEntry: Education = {
  id: "edu_1",
  institution: "Cambridge",
  degree: "BSc Mathematics",
  field: "Mathematics",
  startDate: new Date("2018-09-01T00:00:00.000Z"),
  endDate: new Date("2021-06-01T00:00:00.000Z"),
  gpa: "4.0",
  description: null,
  sortOrder: 0,
};

describe("toEducationRequests", () => {
  it("denormalises education, reindexes sortOrder, and drops incomplete rows", () => {
    const requests = toEducationRequests([
      { ...educationEntry, sortOrder: 7 },
      { ...educationEntry, id: "edu_2", degree: "" },
    ]);

    expect(requests).toHaveLength(1);
    expect(requests[0].institution).toBe("Cambridge");
    expect(requests[0].startDate).toBe("2018-09-01T00:00:00.000Z");
    expect(requests[0].sortOrder).toBe(0);
  });

  it("maps null optional fields to undefined", () => {
    const [request] = toEducationRequests([
      { ...educationEntry, field: null, gpa: null, endDate: null },
    ]);

    expect(request.field).toBeUndefined();
    expect(request.gpa).toBeUndefined();
    expect(request.endDate).toBeUndefined();
  });
});

describe("emptyEducation", () => {
  it("creates a blank entry with the given id and sort order", () => {
    const blank = emptyEducation("education-local-1", 2);

    expect(blank.id).toBe("education-local-1");
    expect(blank.institution).toBe("");
    expect(blank.degree).toBe("");
    expect(blank.sortOrder).toBe(2);
    expect(blank.startDate).toBeInstanceOf(Date);
  });
});

describe("toProjectRequests", () => {
  const project: Project = {
    id: "p1",
    name: "ReadSaver",
    description: "A RAG app",
    url: "github.com/x",
    startDate: new Date("2024-01-01T00:00:00.000Z"),
    endDate: null,
    sortOrder: 0,
  };

  it("denormalises, reindexes, and drops nameless entries", () => {
    const requests = toProjectRequests([
      { ...project, sortOrder: 5 },
      { ...project, id: "p2", name: "  " },
    ]);
    expect(requests).toHaveLength(1);
    expect(requests[0].name).toBe("ReadSaver");
    expect(requests[0].startDate).toBe("2024-01-01T00:00:00.000Z");
    expect(requests[0].sortOrder).toBe(0);
  });

  it("maps null fields to undefined", () => {
    const [request] = toProjectRequests([
      { ...project, url: null, description: null, startDate: null },
    ]);
    expect(request.url).toBeUndefined();
    expect(request.description).toBeUndefined();
    expect(request.startDate).toBeUndefined();
  });
});

describe("toCertificationRequests", () => {
  const cert: Certification = {
    id: "c1",
    name: "AWS SAA",
    issuer: "Amazon",
    issueDate: new Date("2023-05-01T00:00:00.000Z"),
    expiryDate: null,
    credentialUrl: null,
    sortOrder: 0,
  };

  it("denormalises and drops nameless entries", () => {
    const requests = toCertificationRequests([
      cert,
      { ...cert, id: "c2", name: "" },
    ]);
    expect(requests).toHaveLength(1);
    expect(requests[0].issuer).toBe("Amazon");
    expect(requests[0].issueDate).toBe("2023-05-01T00:00:00.000Z");
    expect(requests[0].expiryDate).toBeUndefined();
  });
});

describe("toSkillRequests", () => {
  const skill: Skill = {
    id: "s1",
    name: "React",
    level: "expert",
    category: "Frontend",
    sortOrder: 0,
  };

  it("uppercases the level and drops nameless skills", () => {
    const requests = toSkillRequests([skill, { ...skill, id: "s2", name: "" }]);
    expect(requests).toHaveLength(1);
    expect(requests[0].level).toBe("EXPERT");
    expect(requests[0].category).toBe("Frontend");
  });
});

describe("toLanguageRequests", () => {
  const language: Language = {
    id: "l1",
    name: "English",
    proficiency: "native",
    sortOrder: 0,
  };

  it("uppercases proficiency and drops nameless languages", () => {
    const requests = toLanguageRequests([
      language,
      { ...language, id: "l2", name: "" },
    ]);
    expect(requests).toHaveLength(1);
    expect(requests[0].proficiency).toBe("NATIVE");
    expect(requests[0].sortOrder).toBe(0);
  });
});

describe("toEditorDocument", () => {
  it("projects a CV into the editor document, carrying id and template", () => {
    const doc = toEditorDocument(cv);

    expect(doc.cvId).toBe("cv_1");
    expect(doc.templateId).toBe("horizon");
    expect(doc.personalInfo).toEqual(personalInfo);
    expect(doc.experiences).toBe(cv.experiences);
  });

  it("seeds the default section layout when the CV has none", () => {
    const doc = toEditorDocument(cv);

    expect(doc.layout).toEqual(defaultSectionLayout());
  });
});

describe("toLayoutRequest", () => {
  it("copies the layout arrays and titles into the PUT payload", () => {
    const layout = {
      mainOrder: ["summary" as const, "experience" as const],
      sideOrder: ["skills" as const],
      hidden: ["certifications" as const],
      titles: { experience: "Work History" },
    };

    const request = toLayoutRequest(layout);

    expect(request).toEqual(layout);
    expect(request.mainOrder).not.toBe(layout.mainOrder);
    expect(request.titles).not.toBe(layout.titles);
  });
});

describe("toLiveCv", () => {
  it("overlays the live draft onto the CV for preview rendering", () => {
    const doc = toEditorDocument(cv);
    const editedDoc = {
      ...doc,
      personalInfo: { ...personalInfo, summary: "Edited live." },
      experiences: [experience],
    };

    const live = toLiveCv(cv, editedDoc);

    expect(live.personalInfo?.summary).toBe("Edited live.");
    expect(live.experiences).toEqual([experience]);
  });

  it("passes through CV-only fields the editor does not own", () => {
    const doc = toEditorDocument(cv);

    const live = toLiveCv(cv, doc);

    expect(live.title).toBe("My CV");
    expect(live.slug).toBe("my-cv");
    expect(live.status).toBe("draft");
    expect(live.customSections).toBe(cv.customSections);
  });

  it("carries the live layout onto the CV", () => {
    const doc = toEditorDocument(cv);
    const editedDoc = {
      ...doc,
      layout: { ...doc.layout, hidden: ["certifications" as const] },
    };

    const live = toLiveCv(cv, editedDoc);

    expect(live.layout?.hidden).toEqual(["certifications"]);
  });
});

describe("toPersonalInfoRequest", () => {
  it("maps null fields to undefined and passes through values", () => {
    const request = toPersonalInfoRequest(personalInfo);

    expect(request.fullName).toBe("Ada Lovelace");
    expect(request.summary).toBe("Mathematician and first programmer.");
    expect(request.phone).toBeUndefined();
    expect(request.website).toBeUndefined();
    expect("phone" in request ? request.phone : undefined).toBeUndefined();
  });

  it("preserves an empty-string edit rather than dropping it", () => {
    const cleared = toPersonalInfoRequest({ ...personalInfo, summary: "" });

    expect(cleared.summary).toBe("");
  });

  it("returns an empty payload when there is no personal info", () => {
    expect(toPersonalInfoRequest(null)).toEqual({});
  });
});

describe("emptyPersonalInfo", () => {
  it("creates a blank record with every field null and an empty id", () => {
    const blank = emptyPersonalInfo();

    expect(blank.id).toBe("");
    expect(blank.fullName).toBeNull();
    expect(blank.summary).toBeNull();
  });
});
