"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  useEducation,
  useEducationActions,
  useEducationField,
} from "@/modules/cv/editor/editor-provider";
import type { EducationTextField } from "@/modules/cv/editor/editor-model";
import type { Education } from "@/modules/cv/data/mappers";
import { BulletEditor } from "./bullet-editor";
import { InlineEditableText } from "./inline-editable-text";
import { MonthYearInput } from "./month-year-input";
import { SortableEntryList } from "./sortable-entry-list";

interface EducationFieldProps {
  entryId: string;
  field: EducationTextField;
  ariaLabel: string;
  placeholder: string;
  className?: string;
}

function EducationField({ entryId, field, ...props }: EducationFieldProps) {
  const { value, setValue } = useEducationField(entryId, field);
  return <InlineEditableText value={value} onChange={setValue} {...props} />;
}

/** Inline editor for the education list, rendered on the document in edit mode. */
export function EditableEducationList({
  accentColor,
}: {
  accentColor: string;
}) {
  const education = useEducation();
  const { addEducation, reorder } = useEducationActions();

  return (
    <div>
      <SortableEntryList
        items={education}
        onReorder={reorder}
        className="space-y-3"
        renderItem={(entry) => (
          <EducationEditor education={entry} accentColor={accentColor} />
        )}
      />

      <button
        type="button"
        onClick={addEducation}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-medium text-primary transition duration-150 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
      >
        <Plus className="size-3.5" />
        Add education
      </button>
    </div>
  );
}

function EducationEditor({
  education,
  accentColor,
}: {
  education: Education;
  accentColor: string;
}) {
  const { removeEducation, setStartDate, setEndDate } = useEducationActions();
  const { value: description, setValue: setDescription } = useEducationField(
    education.id,
    "description"
  );

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-x-1 text-xs font-bold text-content-primary">
          <EducationField
            entryId={education.id}
            field="degree"
            ariaLabel="Degree"
            placeholder="Degree"
            className="font-bold text-content-primary"
          />
          <span className="font-normal text-content-secondary">in</span>
          <EducationField
            entryId={education.id}
            field="field"
            ariaLabel="Field of study"
            placeholder="Field of study"
            className="font-normal text-content-secondary"
          />
        </div>
        <button
          type="button"
          onClick={() => removeEducation(education.id)}
          aria-label="Remove education"
          className="shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-all duration-150 hover:scale-110 hover:text-feedback-error active:scale-90 group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <span style={{ color: accentColor }}>
        <EducationField
          entryId={education.id}
          field="institution"
          ariaLabel="Institution"
          placeholder="Institution"
          className="text-xs"
        />
      </span>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <MonthYearInput
          value={education.startDate}
          onChange={(next) => {
            if (next) setStartDate(education.id, next);
          }}
          aria-label="Start date"
        />
        <span className="text-[10px] text-content-tertiary">–</span>
        <MonthYearInput
          value={education.endDate}
          onChange={(next) => setEndDate(education.id, next)}
          aria-label="End date"
        />
      </div>

      <BulletEditor
        value={description}
        onChange={setDescription}
        placeholder="Add notable achievements, courses, or activities…"
        ariaLabel="Education description"
        className="mt-1"
      />
    </div>
  );
}
