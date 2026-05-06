'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Building2,
  Calendar,
  Trash2,
  Send,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import type { Job, JobNote, JobStatus } from '@/modules/jobs/data/mappers';
import { REVERSE_STATUS_MAP } from '@/modules/jobs/data/mappers';
import {
  createJobNoteAction,
  deleteJobNoteAction,
  deleteJobAction,
  updateJobStatusAction,
} from '@/modules/jobs/data/actions';

interface JobDetailClientProps {
  job: Job;
}

const STATUS_LABELS: Record<JobStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const STATUS_COLORS: Record<JobStatus, string> = {
  saved: 'bg-surface-elevated text-content-primary',
  applied: 'bg-feedback-info/10 text-feedback-info',
  interview: 'bg-feedback-warning/10 text-feedback-warning',
  offer: 'bg-feedback-success/10 text-feedback-success',
  rejected: 'bg-feedback-error/10 text-feedback-error',
};

export function JobDetailClient({ job: initialJob }: JobDetailClientProps) {
  const router = useRouter();
  const [job, setJob] = useState(initialJob);
  const [isPending, startTransition] = useTransition();
  const [noteContent, setNoteContent] = useState('');

  function handleStatusChange(status: JobStatus) {
    startTransition(async () => {
      const result = await updateJobStatusAction(job.id, {
        status: REVERSE_STATUS_MAP[status],
      });
      if (result.ok && result.data) {
        setJob(result.data);
        toast.success('Status updated');
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function handleAddNote() {
    if (!noteContent.trim()) return;

    startTransition(async () => {
      const result = await createJobNoteAction(job.id, {
        content: noteContent.trim(),
      });

      if (result.ok && result.data) {
        setJob((prev) => ({
          ...prev,
          jobNotes: [result.data!, ...prev.jobNotes],
        }));
        setNoteContent('');
        toast.success('Note added');
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function handleDeleteNote(noteId: string) {
    startTransition(async () => {
      const result = await deleteJobNoteAction(job.id, noteId);

      if (result.ok) {
        setJob((prev) => ({
          ...prev,
          jobNotes: prev.jobNotes.filter((n) => n.id !== noteId),
        }));
        toast.success('Note deleted');
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteJobAction(job.id);

      if (result.ok) {
        toast.success('Job deleted');
        router.push('/jobs');
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className='min-h-screen bg-surface-primary'>
      <div className='mx-auto max-w-4xl px-4 py-8'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-3'>
          <Button variant='ghost' size='icon' aria-label='Back to jobs' asChild>
            <Link href='/jobs'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-content-primary'>
              {job.title}
            </h1>
            <div className='mt-1 flex items-center gap-3 text-sm text-content-secondary'>
              <span className='flex items-center gap-1'>
                <Building2 className='size-3.5' />
                {job.company}
              </span>
              {job.location ? (
                <span className='flex items-center gap-1'>
                  <MapPin className='size-3.5' />
                  {job.location}
                  {job.isRemote && ' (Remote)'}
                </span>
              ) : job.isRemote ? (
                <span className='flex items-center gap-1'>
                  <MapPin className='size-3.5' />
                  Remote
                </span>
              ) : null}
            </div>
          </div>
          <Button
            variant='destructive'
            size='sm'
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className='size-4' />
            Delete
          </Button>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Left: details and notes */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Job info card */}
            <div className='rounded-lg border border-border-subtle bg-surface-card p-4'>
              <div className='flex flex-wrap gap-3'>
                <Badge className={STATUS_COLORS[job.status]}>
                  {STATUS_LABELS[job.status]}
                </Badge>
                {job.salaryMin !== null && job.salaryMin !== undefined && (
                  <span className='text-sm text-content-secondary'>
                    {job.salaryCurrency ?? '$'}
                    {job.salaryMin.toLocaleString()}
                    {job.salaryMax && ` – ${job.salaryMax.toLocaleString()}`}
                  </span>
                )}
                {job.appliedAt && (
                  <span className='flex items-center gap-1 text-sm text-content-secondary'>
                    <Calendar className='size-3.5' />
                    Applied{' '}
                    {job.appliedAt.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
              {job.url && /^https?:\/\//i.test(job.url) && (
                <a
                  href={job.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-3 inline-flex items-center gap-1 text-sm text-brand-primary hover:underline'
                >
                  <ExternalLink className='size-3.5' />
                  View job listing
                </a>
              )}
              {job.notes && (
                <p className='mt-3 text-sm text-content-secondary'>
                  {job.notes}
                </p>
              )}
            </div>

            {/* Notes section */}
            <div className='rounded-lg border border-border-subtle bg-surface-card p-4'>
              <h2 className='mb-4 text-lg font-medium text-content-primary'>
                Notes
              </h2>

              {/* Add note form */}
              <div className='mb-4 flex gap-2'>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder='Add a note about this application...'
                  className='min-h-[80px] flex-1 text-sm'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      if (!isPending) handleAddNote();
                    }
                  }}
                />
              </div>
              <Button
                size='sm'
                onClick={handleAddNote}
                disabled={isPending || !noteContent.trim()}
                className='mb-4'
              >
                {isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <Send className='size-4' />
                )}
                Add Note
              </Button>

              {/* Notes list */}
              {job.jobNotes.length === 0 ? (
                <p className='py-4 text-center text-sm text-content-tertiary'>
                  No notes yet. Add one above.
                </p>
              ) : (
                <div className='space-y-3'>
                  {job.jobNotes.map((note: JobNote) => (
                    <div
                      key={note.id}
                      className='group flex items-start gap-2 rounded-md border border-border-subtle p-3'
                    >
                      <p className='flex-1 text-sm text-content-primary'>
                        {note.content}
                      </p>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-content-tertiary'>
                          {note.createdAt.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={isPending}
                          aria-label='Delete note'
                        >
                          <Trash2 className='size-3' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: status change panel */}
          <div className='space-y-4'>
            <div className='rounded-lg border border-border-subtle bg-surface-card p-4'>
              <h3 className='mb-3 text-sm font-medium text-content-primary'>
                Update Status
              </h3>
              <div className='flex flex-col gap-2'>
                {(
                  Object.entries(STATUS_LABELS) as [JobStatus, string][]
                ).map(([status, label]) => (
                  <Button
                    key={status}
                    variant={job.status === status ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleStatusChange(status)}
                    disabled={isPending || job.status === status}
                    className='justify-start'
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
