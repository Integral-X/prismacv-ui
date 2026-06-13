'use client';

import { Plus, Trash2 } from 'lucide-react';
import {
  useProjectActions,
  useProjectField,
  useProjects,
} from '@/modules/cv/editor/editor-provider';
import type { ProjectTextField } from '@/modules/cv/editor/editor-model';
import type { Project } from '@/modules/cv/data/mappers';
import { InlineEditableText } from './inline-editable-text';
import {
  DATE_INPUT_CLASS,
  fromDateInputValue,
  toDateInputValue,
} from './date-input';
import { SortableEntryList } from './sortable-entry-list';

interface ProjectFieldProps {
  entryId: string;
  field: ProjectTextField;
  ariaLabel: string;
  placeholder: string;
  className?: string;
  multiline?: boolean;
  as?: 'p' | 'span';
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
        className='space-y-3'
        renderItem={(project) => (
          <ProjectEditor project={project} accentColor={accentColor} />
        )}
      />

      <button
        type='button'
        onClick={addProject}
        className='mt-3 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-interactive-link hover:underline'
      >
        <Plus className='size-3.5' />
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

  return (
    <div className='group'>
      <div className='flex items-baseline justify-between gap-2'>
        <ProjectField
          entryId={project.id}
          field='name'
          ariaLabel='Project name'
          placeholder='Project name'
          className='text-sm font-bold text-content-primary'
        />
        <button
          type='button'
          onClick={() => removeProject(project.id)}
          aria-label='Remove project'
          className='shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-opacity hover:text-feedback-error group-hover:opacity-100'
        >
          <Trash2 className='size-3.5' />
        </button>
      </div>

      <span style={{ color: accentColor }}>
        <ProjectField
          entryId={project.id}
          field='url'
          ariaLabel='Project URL'
          placeholder='project.com'
          className='text-xs'
        />
      </span>

      <div className='mt-1 flex flex-wrap items-center gap-2'>
        <input
          type='date'
          aria-label='Start date'
          value={toDateInputValue(project.startDate)}
          onChange={(event) =>
            setStartDate(project.id, fromDateInputValue(event.target.value))
          }
          className={DATE_INPUT_CLASS}
        />
        <span className='text-[10px] text-content-tertiary'>–</span>
        <input
          type='date'
          aria-label='End date'
          value={toDateInputValue(project.endDate)}
          onChange={(event) =>
            setEndDate(project.id, fromDateInputValue(event.target.value))
          }
          className={DATE_INPUT_CLASS}
        />
      </div>

      <ProjectField
        entryId={project.id}
        field='description'
        ariaLabel='Project description'
        placeholder='Describe the project — one bullet per line…'
        multiline
        as='p'
        className='mt-1 text-xs leading-relaxed text-content-secondary'
      />
    </div>
  );
}
