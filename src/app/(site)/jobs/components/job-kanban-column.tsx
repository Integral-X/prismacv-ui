'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Job, JobStatus } from '@/modules/jobs/data/mappers';

import { formatColumnCount } from '../lib/job-tracker-utils';
import { JOB_COLUMN_THEMES } from './job-column-config';
import { JobTrackerCard } from './job-tracker-card';

interface JobKanbanColumnProps {
  status: JobStatus;
  jobs: Job[];
  onAddJob: (status: JobStatus) => void;
  onSelectJob: (jobId: string) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onDelete: (jobId: string) => void;
  isPending: boolean;
}

export function JobKanbanColumn({
  status,
  jobs,
  onAddJob,
  onSelectJob,
  onStatusChange,
  onDelete,
  isPending,
}: JobKanbanColumnProps) {
  const theme = JOB_COLUMN_THEMES[status];

  return (
    <div className='flex min-w-[260px] flex-1 flex-col'>
      <div
        className={cn(
          'mb-3 flex items-center gap-2 rounded-lg px-3 py-2.5',
          theme.headerClassName
        )}
      >
        <span
          className={cn('size-2.5 shrink-0 rounded-full', theme.dotClassName)}
          aria-hidden
        />
        <span className='text-sm font-semibold text-content-primary'>
          {theme.label}
        </span>
        <span className='text-sm font-medium text-content-muted'>
          {formatColumnCount(jobs.length)}
        </span>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='ml-auto size-7'
          aria-label={`Add job to ${theme.label}`}
          onClick={() => onAddJob(status)}
          disabled={isPending}
        >
          <Plus className='size-4' />
        </Button>
      </div>

      <div className='flex max-h-[calc(100svh-18rem)] flex-col gap-3 overflow-y-auto pr-1'>
        {jobs.map((job) => (
          <JobTrackerCard
            key={job.id}
            job={job}
            onSelect={onSelectJob}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            isPending={isPending}
          />
        ))}
        <button
          type='button'
          onClick={() => onAddJob(status)}
          className={cn(
            'flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-sm font-medium text-content-secondary transition-colors',
            'hover:border-primary/40 hover:bg-surface-elevated hover:text-content-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            theme.addCardClassName
          )}
          disabled={isPending}
        >
          <Plus className='size-5' aria-hidden />
          Add Job
        </button>
      </div>
    </div>
  );
}
