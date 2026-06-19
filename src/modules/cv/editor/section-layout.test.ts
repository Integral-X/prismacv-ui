import {
  defaultSectionLayout,
  isLayoutSectionKey,
  reconcileSectionLayout,
} from "./section-layout";
import type { SectionLayout } from "@/modules/cv/data/mappers";

describe("isLayoutSectionKey", () => {
  it("accepts the seven built-in keys and rejects others", () => {
    expect(isLayoutSectionKey("experience")).toBe(true);
    expect(isLayoutSectionKey("summary")).toBe(true);
    expect(isLayoutSectionKey("custom-uuid")).toBe(false);
    expect(isLayoutSectionKey("")).toBe(false);
  });
});

describe("reconcileSectionLayout", () => {
  it("returns the default layout for null", () => {
    expect(reconcileSectionLayout(null)).toEqual(defaultSectionLayout());
  });

  it("preserves a valid stored order", () => {
    const stored: SectionLayout = {
      mainOrder: ["experience", "summary", "projects"],
      sideOrder: ["education", "skills", "certifications", "languages"],
      hidden: [],
      titles: { experience: "Work History" },
    };

    expect(reconcileSectionLayout(stored)).toEqual(stored);
  });

  it("drops unknown keys (e.g. custom-section ids) and unknown titles", () => {
    const result = reconcileSectionLayout({
      mainOrder: ["summary", "cs-unknown", "experience"],
      sideOrder: ["skills"],
      hidden: [],
      titles: { experience: "Work", "cs-unknown": "Volunteer" },
    });

    expect(result.mainOrder).not.toContain("cs-unknown");
    expect(result.titles).toEqual({ experience: "Work" });
  });

  it("removes hidden keys from the columns", () => {
    const result = reconcileSectionLayout({
      mainOrder: ["summary", "experience"],
      sideOrder: ["skills"],
      hidden: ["experience"],
      titles: {},
    });

    expect(result.mainOrder).not.toContain("experience");
    expect(result.hidden).toContain("experience");
  });

  it("appends any built-in section the blob omitted, to its default column", () => {
    const result = reconcileSectionLayout({
      mainOrder: ["summary"],
      sideOrder: ["skills"],
      hidden: [],
      titles: {},
    });

    // Every built-in key is placed exactly once across the three buckets.
    const all = [...result.mainOrder, ...result.sideOrder, ...result.hidden];
    expect(new Set(all).size).toBe(all.length);
    expect(all).toEqual(
      expect.arrayContaining([
        "summary",
        "experience",
        "projects",
        "skills",
        "education",
        "certifications",
        "languages",
      ])
    );
    expect(result.mainOrder).toContain("experience"); // default main
    expect(result.sideOrder).toContain("education"); // default side
  });

  it("de-duplicates a key listed in both columns", () => {
    const result = reconcileSectionLayout({
      mainOrder: ["summary", "skills"],
      sideOrder: ["skills"],
      hidden: [],
      titles: {},
    });

    const skillsCount = [...result.mainOrder, ...result.sideOrder].filter(
      (k) => k === "skills"
    ).length;
    expect(skillsCount).toBe(1);
  });
});
