'use client';

import { Plus, Trash2 } from 'lucide-react';
import {
  useEducation,
  useEducationActions,
  useEducationField,
} from '@/modules/cv/editor/editor-provider';
import type { EducationTextField } from '@/modules/cv/editor/editor-model';
import type { Education } from '@/modules/cv/data/mappers';
import { InlineEditableText } from './inline-editable-text';
import { SortableEntryList } from './sortable-entry-list';

function toDateInputValue(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

function fromDateInputValue(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const DATE_INPUT_CLASS =
  'rounded border border-subtle bg-transparent px-1 py-0.5 text-[10px] text-content-tertiary';

interface EducationFieldProps {
  entryId: string;
  field: EducationTextField;
  ariaLabel: string;
  placeholder: string;
  className?: string;
  multiline?: boolean;
  as?: 'p' | 'span';
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
        className='space-y-3'
        renderItem={(entry) => (
          <EducationEditor education={entry} accentColor={accentColor} />
        )}
      />

      <button
        type='button'
        onClick={addEducation}
        className='mt-3 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-interactive-link hover:underline'
      >
        <Plus className='size-3.5' />
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

  return (
    <div className='group'>
      <div className='flex items-baseline justify-between gap-2'>
        <EducationField
          entryId={education.id}
          field='degree'
          ariaLabel='Degree'
          placeholder='Degree'
          className='text-xs font-bold text-content-primary'
        />
        <button
          type='button'
          onClick={() => removeEducation(education.id)}
          aria-label='Remove education'
          className='shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-opacity hover:text-feedback-error group-hover:opacity-100'
        >
          <Trash2 className='size-3.5' />
        </button>
      </div>

      <span style={{ color: accentColor }}>
        <EducationField
          entryId={education.id}
          field='institution'
          ariaLabel='Institution'
          placeholder='Institution'
          className='text-xs'
        />
      </span>

      <div className='mt-1 flex flex-wrap items-center gap-2'>
        <input
          type='date'
          aria-label='Start date'
          value={toDateInputValue(education.startDate)}
          onChange={(event) => {
            const next = fromDateInputValue(event.target.value);
            if (next) setStartDate(education.id, next);
          }}
          className={DATE_INPUT_CLASS}
        />
        <span className='text-[10px] text-content-tertiary'>–</span>
        <input
          type='date'
          aria-label='End date'
          value={toDateInputValue(education.endDate)}
          onChange={(event) =>
            setEndDate(education.id, fromDateInputValue(event.target.value))
          }
          className={DATE_INPUT_CLASS}
        />
      </div>
    </div>
  );
}
