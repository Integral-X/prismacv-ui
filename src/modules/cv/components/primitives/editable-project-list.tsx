"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  useProjectActions,
  useProjectField,
  useProjects,
} from "@/modules/cv/editor/editor-provider";
import type { ProjectTextField } from "@/modules/cv/editor/editor-model";
import type { Project } from "@/modules/cv/data/mappers";
import { BulletEditor } from "./bullet-editor";
import { InlineEditableText } from "./inline-editable-text";
import { MonthYearInput } from "./month-year-input";
import { SortableEntryList } from "./sortable-entry-list";

interface ProjectFieldProps {
  entryId: string;
  field: ProjectTextField;
  ariaLabel: string;
  placeholder: string;
  className?: string;
}

function ProjectField({ entryId, field, ...props }: ProjectFieldProps) {
  const { value, setValue } = useProjectField(entryId, field);
  return <InlineEditableText value={value} onChange={setValue} {...props} />;
}

/** Inline editor for the project list, rendered on the document in edit mode. */
export function EditableProjectList({ accentColor }: { accentColor: string }) {
  const projects = useProjects();
  const { addProject, reorder } = useProjectActions();

  return (
    <div>
      <SortableEntryList
        items={projects}
        onReorder={reorder}
        className="space-y-3"
        renderItem={(project) => (
          <ProjectEditor project={project} accentColor={accentColor} />
        )}
      />

      <button
        type="button"
        onClick={addProject}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-medium text-primary transition duration-150 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
      >
        <Plus className="size-3.5" />
        Add project
      </button>
    </div>
  );
}

function ProjectEditor({
  project,
  accentColor,
}: {
  project: Project;
  accentColor: string;
}) {
  const { removeProject, setStartDate, setEndDate } = useProjectActions();
  const { value: description, setValue: setDescription } = useProjectField(
    project.id,
    "description"
  );

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-2">
        <ProjectField
          entryId={project.id}
          field="name"
          ariaLabel="Project name"
          placeholder="Project name"
          className="text-sm font-bold text-content-primary"
        />
        <button
          type="button"
          onClick={() => removeProject(project.id)}
          aria-label="Remove project"
          className="shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-all duration-150 hover:scale-110 hover:text-feedback-error active:scale-90 group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <span style={{ color: accentColor }}>
        <ProjectField
          entryId={project.id}
          field="url"
          ariaLabel="Project URL"
          placeholder="project.com"
          className="text-xs"
        />
      </span>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <MonthYearInput
          value={project.startDate}
          onChange={(next) => setStartDate(project.id, next)}
          aria-label="Start date"
        />
        <span className="text-[10px] text-content-tertiary">–</span>
        <MonthYearInput
          value={project.endDate}
          onChange={(next) => setEndDate(project.id, next)}
          aria-label="End date"
        />
      </div>

      <BulletEditor
        value={description}
        onChange={setDescription}
        placeholder="Describe the project — one bullet per line…"
        ariaLabel="Project description"
        className="mt-1"
      />
    </div>
  );
}
