"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  useExperienceActions,
  useExperienceField,
  useExperiences,
} from "@/modules/cv/editor/editor-provider";
import type { ExperienceTextField } from "@/modules/cv/editor/editor-model";
import type { Experience } from "@/modules/cv/data/mappers";
import { BulletEditor } from "./bullet-editor";
import { InlineEditableText } from "./inline-editable-text";
import { MonthYearInput } from "./month-year-input";
import { SortableEntryList } from "./sortable-entry-list";

interface ExperienceFieldProps {
  entryId: string;
  field: ExperienceTextField;
  ariaLabel: string;
  placeholder: string;
  className?: string;
}

function ExperienceField({ entryId, field, ...props }: ExperienceFieldProps) {
  const { value, setValue } = useExperienceField(entryId, field);
  return <InlineEditableText value={value} onChange={setValue} {...props} />;
}

/**
 * Inline editor for the experience list, rendered on the document in edit mode.
 * Each entry's text fields are click-to-edit; dates and the current flag use
 * compact controls revealed in the entry; entries can be added and removed.
 */
export function EditableExperienceList({
  accentColor,
}: {
  accentColor: string;
}) {
  const experiences = useExperiences();
  const { addExperience, reorder } = useExperienceActions();

  return (
    <div>
      <SortableEntryList
        items={experiences}
        onReorder={reorder}
        className="space-y-4"
        renderItem={(experience) => (
          <ExperienceEditor experience={experience} accentColor={accentColor} />
        )}
      />

      <button
        type="button"
        onClick={addExperience}
        className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-medium text-primary transition duration-150 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
      >
        <Plus className="size-3.5" />
        Add experience
      </button>
    </div>
  );
}

function ExperienceEditor({
  experience,
  accentColor,
}: {
  experience: Experience;
  accentColor: string;
}) {
  const { removeExperience, setStartDate, setEndDate, setCurrent } =
    useExperienceActions();
  const { value: description, setValue: setDescription } = useExperienceField(
    experience.id,
    "description"
  );

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-2">
        <ExperienceField
          entryId={experience.id}
          field="title"
          ariaLabel="Job title"
          placeholder="Job title"
          className="text-sm font-bold text-content-primary"
        />
        <button
          type="button"
          onClick={() => removeExperience(experience.id)}
          aria-label="Remove experience"
          className="shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-all duration-150 hover:scale-110 hover:text-feedback-error active:scale-90 group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 text-xs">
        <span style={{ color: accentColor }}>
          <ExperienceField
            entryId={experience.id}
            field="company"
            ariaLabel="Company"
            placeholder="Company"
            className="font-semibold"
          />
        </span>
        <span className="text-content-tertiary">·</span>
        <ExperienceField
          entryId={experience.id}
          field="location"
          ariaLabel="Location"
          placeholder="Location"
          className="text-content-tertiary"
        />
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <MonthYearInput
          value={experience.startDate}
          onChange={(next) => {
            if (next) setStartDate(experience.id, next);
          }}
          aria-label="Start date"
        />
        <span className="text-[10px] text-content-tertiary">–</span>
        {experience.current ? (
          <span className="text-[10px] text-content-tertiary">Present</span>
        ) : (
          <MonthYearInput
            value={experience.endDate}
            onChange={(next) => setEndDate(experience.id, next)}
            aria-label="End date"
          />
        )}
        <label className="flex items-center gap-1 text-[10px] text-content-tertiary">
          <input
            type="checkbox"
            checked={experience.current}
            onChange={(event) =>
              setCurrent(experience.id, event.target.checked)
            }
          />
          Current
        </label>
      </div>

      <BulletEditor
        value={description}
        onChange={setDescription}
        placeholder="Describe your impact — one bullet per line…"
        ariaLabel="Job description"
        className="mt-1"
      />
    </div>
  );
}
