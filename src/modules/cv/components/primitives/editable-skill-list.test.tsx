import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Cv, Skill } from "@/modules/cv/data/mappers";
import { EditorProvider } from "@/modules/cv/editor/editor-provider";
import { EditableSkillList } from "./editable-skill-list";

jest.mock("@/modules/cv/data/actions", () => ({
  updateSectionAction: jest.fn().mockResolvedValue({ ok: true }),
}));

function skill(overrides: Partial<Skill> = {}): Skill {
  return {
    id: "skill_1",
    name: "TypeScript",
    level: "intermediate",
    category: "Frontend",
    sortOrder: 0,
    ...overrides,
  };
}

function buildCv(skills: Skill[]): Cv {
  return {
    id: "cv_1",
    title: "My CV",
    slug: "my-cv",
    status: "draft",
    templateId: "horizon",
    isDefault: false,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    personalInfo: null,
    experiences: [],
    education: [],
    skills,
    certifications: [],
    projects: [],
    languages: [],
    customSections: [],
    layout: null,
  };
}

function renderList(skills: Skill[]) {
  return render(
    <EditorProvider cv={buildCv(skills)}>
      <EditableSkillList accentColor="var(--color-primary)" />
    </EditorProvider>
  );
}

describe("EditableSkillList", () => {
  it("renders skills as chips grouped under their category", () => {
    renderList([
      skill({ id: "s1", name: "TypeScript", category: "Frontend" }),
      skill({ id: "s2", name: "Postgres", category: "Backend" }),
    ]);

    expect(screen.getByDisplayValue("Frontend")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Backend")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Postgres")).toBeInTheDocument();
  });

  it("edits a skill name in place", async () => {
    const user = userEvent.setup();
    renderList([skill({ id: "s1", name: "TypeScript" })]);

    await user.click(screen.getByRole("button", { name: "Skill name" }));
    const input = screen.getByRole("textbox", { name: "Skill name" });
    await user.clear(input);
    await user.type(input, "Rust");
    await user.tab();

    expect(screen.getByText("Rust")).toBeInTheDocument();
  });

  it("removes a skill chip", async () => {
    const user = userEvent.setup();
    renderList([skill({ id: "s1", name: "TypeScript" })]);

    await user.click(screen.getByRole("button", { name: "Remove skill" }));

    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("adds a skill into its category group", async () => {
    const user = userEvent.setup();
    renderList([skill({ id: "s1", name: "TypeScript", category: "Frontend" })]);

    await user.click(
      screen.getByRole("button", { name: "Add skill to this category" })
    );

    // The new blank chip is an editable name button alongside the existing one.
    expect(screen.getAllByRole("button", { name: "Skill name" })).toHaveLength(
      2
    );
  });

  it("renames a category across its skills on blur", async () => {
    const user = userEvent.setup();
    renderList([
      skill({ id: "s1", name: "TypeScript", category: "Frontend" }),
      skill({ id: "s2", name: "React", category: "Frontend" }),
    ]);

    const label = screen.getByDisplayValue("Frontend");
    await user.clear(label);
    await user.type(label, "Web");
    await user.tab();

    const renamed = screen.getByDisplayValue("Web");
    const group = renamed.closest("div") as HTMLElement;
    expect(within(group).getByText("TypeScript")).toBeInTheDocument();
    expect(within(group).getByText("React")).toBeInTheDocument();
  });
});
