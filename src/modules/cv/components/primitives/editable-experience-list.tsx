'use client';

import { Plus, Trash2 } from 'lucide-react';
import {
  useExperienceActions,
  useExperienceField,
  useExperiences,
} from '@/modules/cv/editor/editor-provider';
import type { ExperienceTextField } from '@/modules/cv/editor/editor-model';
import type { Experience } from '@/modules/cv/data/mappers';
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

interface ExperienceFieldProps {
  entryId: string;
  field: ExperienceTextField;
  ariaLabel: string;
  placeholder: string;
  className?: string;
  multiline?: boolean;
  as?: 'p' | 'span';
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
        className='space-y-4'
        renderItem={(experience) => (
          <ExperienceEditor experience={experience} accentColor={accentColor} />
        )}
      />

      <button
        type='button'
        onClick={addExperience}
        className='mt-4 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-interactive-link hover:underline'
      >
        <Plus className='size-3.5' />
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

  return (
    <div className='group'>
      <div className='flex items-baseline justify-between gap-2'>
        <ExperienceField
          entryId={experience.id}
          field='title'
          ariaLabel='Job title'
          placeholder='Job title'
          className='text-sm font-bold text-content-primary'
        />
        <button
          type='button'
          onClick={() => removeExperience(experience.id)}
          aria-label='Remove experience'
          className='shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-opacity hover:text-feedback-error group-hover:opacity-100'
        >
          <Trash2 className='size-3.5' />
        </button>
      </div>

      <div className='flex flex-wrap items-center gap-x-2 text-xs'>
        <span style={{ color: accentColor }}>
          <ExperienceField
            entryId={experience.id}
            field='company'
            ariaLabel='Company'
            placeholder='Company'
            className='font-semibold'
          />
        </span>
        <span className='text-content-tertiary'>·</span>
        <ExperienceField
          entryId={experience.id}
          field='location'
          ariaLabel='Location'
          placeholder='Location'
          className='text-content-tertiary'
        />
      </div>

      <div className='mt-1 flex flex-wrap items-center gap-2'>
        <input
          type='date'
          aria-label='Start date'
          value={toDateInputValue(experience.startDate)}
          onChange={(event) => {
            const next = fromDateInputValue(event.target.value);
            if (next) setStartDate(experience.id, next);
          }}
          className={DATE_INPUT_CLASS}
        />
        <span className='text-[10px] text-content-tertiary'>–</span>
        {experience.current ? (
          <span className='text-[10px] text-content-tertiary'>Present</span>
        ) : (
          <input
            type='date'
            aria-label='End date'
            value={toDateInputValue(experience.endDate)}
            onChange={(event) =>
              setEndDate(experience.id, fromDateInputValue(event.target.value))
            }
            className={DATE_INPUT_CLASS}
          />
        )}
        <label className='flex items-center gap-1 text-[10px] text-content-tertiary'>
          <input
            type='checkbox'
            checked={experience.current}
            onChange={(event) =>
              setCurrent(experience.id, event.target.checked)
            }
          />
          Current
        </label>
      </div>

      <ExperienceField
        entryId={experience.id}
        field='description'
        ariaLabel='Description'
        placeholder='Describe your impact — one bullet per line…'
        multiline
        as='p'
        className='mt-1 text-xs leading-relaxed text-content-secondary'
      />
    </div>
  );
}
