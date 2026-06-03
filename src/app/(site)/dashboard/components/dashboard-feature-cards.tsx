'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CvListItem } from '@/modules/cv/data/mappers';
import type { Job, JobStatus } from '@/modules/jobs/data/mappers';

import { DashboardSurfaceCard } from './dashboard-surface-card';

interface DashboardFeatureCardsProps {
  jobs: Job[];
  cvs: CvListItem[];
}

const JOB_STATUS_STYLES: Record<
  JobStatus,
  { label: string; className: string }
> = {
  saved: {
    label: 'Saved',
    className: 'border-subtle text-content-secondary',
  },
  applied: {
    label: 'Applied',
    className: 'border-primary/30 bg-primary/10 text-primary',
  },
  interview: {
    label: 'Interview',
    className: 'border-feedback-info/30 bg-feedback-info/15 text-feedback-info',
  },
  offer: {
    label: 'Offer',
    className:
      'border-feedback-success/30 bg-feedback-success/15 text-feedback-success',
  },
  rejected: {
    label: 'Rejected',
    className:
      'border-feedback-error/30 bg-feedback-error/15 text-feedback-error',
  },
};

const CV_STATUS_STYLES: Record<
  CvListItem['status'],
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'border-subtle text-content-secondary',
  },
  published: {
    label: 'In Progress',
    className: 'border-primary/30 bg-primary/10 text-primary',
  },
};

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'
    >
      {label}
      <ArrowUpRight className='size-4' aria-hidden />
    </Link>
  );
}

export function DashboardFeatureCards({
  jobs,
  cvs,
}: DashboardFeatureCardsProps) {
  const recentJobs = jobs.slice(0, 2);
  const recentCvs = cvs.slice(0, 2);

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
      <DashboardSurfaceCard className='p-6'>
        <h3 className='text-lg font-semibold text-content-primary'>
          Resume Score
        </h3>
        <div className='mt-6 flex flex-col gap-6 sm:flex-row sm:items-center'>
          <div
            className='relative mx-auto flex size-28 shrink-0 items-center justify-center rounded-full border-10 border-primary/20 sm:mx-0'
            role='img'
            aria-label='Resume score 74 percent'
          >
            <span className='text-2xl font-bold text-content-primary'>74%</span>
            <span className='absolute -bottom-6 text-xs text-content-muted'>
              Score
            </span>
          </div>
          <div className='min-w-0 flex-1 space-y-4'>
            <div>
              <p className='text-xs font-semibold tracking-wide text-content-muted uppercase'>
                Targeted role
              </p>
              <p className='mt-1 font-semibold text-content-primary'>
                Principal TPM Manager
              </p>
              <p className='text-sm text-content-secondary'>at Microsoft</p>
            </div>
            <Button asChild>
              <Link href='/ats-scorer'>Scan Resume</Link>
            </Button>
          </div>
        </div>
      </DashboardSurfaceCard>

      <DashboardSurfaceCard className='p-6'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='text-lg font-semibold text-content-primary'>
            Job Tracker
          </h3>
          <SectionLink href='/jobs' label='View applications' />
        </div>
        <ul className='mt-4 space-y-4'>
          {recentJobs.length === 0 ? (
            <li className='text-sm text-content-secondary'>
              No applications yet. Add your first role in Job Tracker.
            </li>
          ) : (
            recentJobs.map((job) => {
              const statusStyle = JOB_STATUS_STYLES[job.status];
              return (
                <li
                  key={job.id}
                  className='flex items-start justify-between gap-3 border-b border-subtle pb-4 last:border-b-0 last:pb-0'
                >
                  <div className='min-w-0'>
                    <p className='font-semibold text-content-primary'>
                      {job.title}
                    </p>
                    <p className='text-sm text-content-secondary'>
                      {job.company}
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className={cn('shrink-0', statusStyle.className)}
                  >
                    {statusStyle.label}
                  </Badge>
                </li>
              );
            })
          )}
        </ul>
      </DashboardSurfaceCard>

      <DashboardSurfaceCard className='p-6'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='text-lg font-semibold text-content-primary'>
            My Document
          </h3>
          <SectionLink href='/dashboard/documents' label='View all' />
        </div>
        <ul className='mt-4 space-y-4'>
          {recentCvs.length === 0 ? (
            <li className='text-sm text-content-secondary'>
              No resumes yet. Create one from the banner above.
            </li>
          ) : (
            recentCvs.map((cv) => {
              const statusStyle = CV_STATUS_STYLES[cv.status];
              return (
                <li key={cv.id}>
                  <Link
                    href={`/cv/${cv.id}/edit`}
                    className='flex items-start justify-between gap-3 border-b border-subtle pb-4 transition-colors last:border-b-0 last:pb-0 hover:text-primary'
                  >
                    <div className='min-w-0'>
                      <p className='font-semibold text-content-primary'>
                        {cv.title}
                      </p>
                    </div>
                    <Badge
                      variant='outline'
                      className={cn('shrink-0', statusStyle.className)}
                    >
                      {statusStyle.label}
                    </Badge>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </DashboardSurfaceCard>

      <DashboardSurfaceCard className='p-6'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='text-lg font-semibold text-content-primary'>
            Skill Gap Analysis
          </h3>
          <SectionLink href='/skills' label='Analyze another role' />
        </div>
        <ul className='mt-6 space-y-5'>
          {['System Design', 'TypeScript', 'Leadership'].map((skill) => (
            <li key={skill}>
              <div className='mb-2 flex items-center justify-between text-sm'>
                <span className='font-medium text-content-primary'>
                  {skill}
                </span>
                <span className='text-content-muted'>65%</span>
              </div>
              <div className='h-2 rounded-full bg-surface-elevated'>
                <div
                  className='h-2 rounded-full bg-primary'
                  style={{ width: '65%' }}
                />
              </div>
            </li>
          ))}
        </ul>
      </DashboardSurfaceCard>
    </div>
  );
}
