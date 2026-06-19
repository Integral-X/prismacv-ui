"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  useCertificationActions,
  useCertificationField,
  useCertifications,
} from "@/modules/cv/editor/editor-provider";
import type { CertificationTextField } from "@/modules/cv/editor/editor-model";
import type { Certification } from "@/modules/cv/data/mappers";
import { InlineEditableText } from "./inline-editable-text";
import { MonthYearInput } from "./month-year-input";
import { SortableEntryList } from "./sortable-entry-list";

interface CertificationFieldProps {
  entryId: string;
  field: CertificationTextField;
  ariaLabel: string;
  placeholder: string;
  className?: string;
}

function CertificationField({
  entryId,
  field,
  ...props
}: CertificationFieldProps) {
  const { value, setValue } = useCertificationField(entryId, field);
  return <InlineEditableText value={value} onChange={setValue} {...props} />;
}

/** Inline editor for the certification list. */
export function EditableCertificationList({
  accentColor,
}: {
  accentColor: string;
}) {
  const certifications = useCertifications();
  const { addCertification, reorder } = useCertificationActions();

  return (
    <div>
      <SortableEntryList
        items={certifications}
        onReorder={reorder}
        className="space-y-2"
        renderItem={(certification) => (
          <CertificationEditor
            certification={certification}
            accentColor={accentColor}
          />
        )}
      />

      <button
        type="button"
        onClick={addCertification}
        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-medium text-primary transition duration-150 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
      >
        <Plus className="size-3.5" />
        Add certification
      </button>
    </div>
  );
}

function CertificationEditor({
  certification,
  accentColor,
}: {
  certification: Certification;
  accentColor: string;
}) {
  const { removeCertification, setIssueDate } = useCertificationActions();

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-2">
        <CertificationField
          entryId={certification.id}
          field="name"
          ariaLabel="Certification name"
          placeholder="Certification name"
          className="text-xs font-semibold text-content-primary"
        />
        <button
          type="button"
          onClick={() => removeCertification(certification.id)}
          aria-label="Remove certification"
          className="shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-all duration-150 hover:scale-110 hover:text-feedback-error active:scale-90 group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <span style={{ color: accentColor }}>
        <CertificationField
          entryId={certification.id}
          field="issuer"
          ariaLabel="Issuer"
          placeholder="Issuer"
          className="text-xs"
        />
      </span>

      <div className="mt-1">
        <MonthYearInput
          value={certification.issueDate}
          onChange={(next) => setIssueDate(certification.id, next)}
          aria-label="Issue date"
        />
      </div>
    </div>
  );
}
