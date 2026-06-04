'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  manualCreateJobSchema,
  quickAddJobSchema,
  type ManualCreateJobFormData,
  type QuickAddJobFormData,
} from '@/lib/validations/jobs';
import type { CvListItem } from '@/modules/cv/data/mappers';
import type { JobStatus } from '@/modules/jobs/data/mappers';
import { REVERSE_STATUS_MAP } from '@/modules/jobs/data/mappers';

import { titleFromJobUrl } from '../lib/job-tracker-utils';
import { JOB_COLUMN_THEMES } from './job-column-config';
import { JobCvPicker } from './job-cv-picker';
import { JobManualFormFields } from './job-manual-form-fields';

type AddJobMode = 'quick' | 'manual';

function createManualDefaults(
  initialStatus: JobStatus,
  cvs: CvListItem[]
): ManualCreateJobFormData {
  return {
    title: '',
    company: '',
    location: '',
    jobType: 'remote',
    expertise: 'senior',
    appliedDate: '',
    applicationDeadline: '',
    source: 'linkedin',
    status: REVERSE_STATUS_MAP[initialStatus],
    url: '',
    description: '',
    cvId: cvs[0]?.id ?? '',
  };
}

interface JobAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStatus: JobStatus;
  isPending: boolean;
  cvs: CvListItem[];
  onQuickAdd: (url: string, status: JobStatus) => void;
  onManualAdd: (data: ManualCreateJobFormData) => void;
}

export function JobAddDialog({
  open,
  onOpenChange,
  initialStatus,
  isPending,
  cvs,
  onQuickAdd,
  onManualAdd,
}: JobAddDialogProps) {
  const [mode, setMode] = useState<AddJobMode>('quick');

  const quickForm = useForm<QuickAddJobFormData>({
    resolver: zodResolver(quickAddJobSchema),
    defaultValues: { url: '' },
  });

  const manualForm = useForm<ManualCreateJobFormData>({
    resolver: zodResolver(manualCreateJobSchema),
    defaultValues: createManualDefaults(initialStatus, cvs),
  });

  useEffect(() => {
    if (!open) return;

    manualForm.reset(createManualDefaults(initialStatus, cvs));
    quickForm.reset({ url: '' });
    setMode('quick');
  }, [open, initialStatus, cvs, manualForm, quickForm]);

  function handleQuickSubmit(data: QuickAddJobFormData) {
    onQuickAdd(data.url, initialStatus);
  }

  function handleManualSubmit(data: ManualCreateJobFormData) {
    onManualAdd(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-h-[min(90svh,880px)] max-w-2xl overflow-y-auto'
        aria-describedby='add-job-dialog-description'
      >
        <DialogHeader className='items-center text-center'>
          <div className='mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Target className='size-6' aria-hidden />
          </div>
          <DialogTitle>Add a new job</DialogTitle>
          <DialogDescription id='add-job-dialog-description'>
            Paste a job link to add to your job tracker. New jobs start in{' '}
            {JOB_COLUMN_THEMES[initialStatus].label}.
          </DialogDescription>
        </DialogHeader>

        <div className='flex gap-2 rounded-lg bg-surface-page p-1'>
          <Button
            type='button'
            variant={mode === 'quick' ? 'default' : 'ghost'}
            className={cn(
              'flex-1',
              mode !== 'quick' && 'text-content-secondary'
            )}
            onClick={() => setMode('quick')}
          >
            Quick add
          </Button>
          <Button
            type='button'
            variant={mode === 'manual' ? 'default' : 'ghost'}
            className={cn(
              'flex-1',
              mode !== 'manual' && 'text-content-secondary'
            )}
            onClick={() => setMode('manual')}
          >
            Add Manually
          </Button>
        </div>

        {mode === 'quick' ? (
          <form
            onSubmit={quickForm.handleSubmit(handleQuickSubmit)}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='job-post-url'>Job Post Link</Label>
              <Input
                id='job-post-url'
                type='url'
                placeholder='https://...'
                aria-invalid={!!quickForm.formState.errors.url}
                {...quickForm.register('url')}
              />
              {quickForm.formState.errors.url ? (
                <p role='alert' className='text-xs text-feedback-error'>
                  {quickForm.formState.errors.url.message}
                </p>
              ) : null}
              <p className='text-xs text-content-muted'>
                We&apos;ll use the link as the listing. Title defaults to{' '}
                {quickForm.watch('url')
                  ? `"${titleFromJobUrl(quickForm.watch('url'))}"`
                  : 'the site name'}
                .
              </p>
            </div>
            <DialogFooter className='gap-2 sm:justify-between'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Job'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form
            onSubmit={manualForm.handleSubmit(handleManualSubmit)}
            className='space-y-4'
          >
            <JobManualFormFields form={manualForm} />
            <JobCvPicker
              cvs={cvs}
              selectedCvId={manualForm.watch('cvId') ?? ''}
              onCvChange={(cvId) => manualForm.setValue('cvId', cvId)}
            />
            <DialogFooter className='gap-2 sm:justify-between'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Job'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
