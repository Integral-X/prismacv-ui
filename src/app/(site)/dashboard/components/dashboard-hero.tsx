'use client';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DashboardHeroProps {
  userName: string;
  hasResumes: boolean;
  onCreateResume: () => void;
  isPending?: boolean;
}

export function DashboardHero({
  userName,
  hasResumes,
  onCreateResume,
  isPending = false,
}: DashboardHeroProps) {
  return (
    <section className='relative overflow-hidden rounded-xl bg-primary px-6 py-8 text-primary-foreground md:px-8 md:py-10'>
      <div className='relative z-10 max-w-xl'>
        <p className='text-sm font-medium text-primary-foreground/90'>
          Welcome back, {userName}!
        </p>
        <h2 className='mt-2 text-2xl font-bold md:text-3xl'>
          Let&apos;s create your resume
        </h2>
        <p className='mt-2 text-sm leading-relaxed text-primary-foreground/90'>
          {hasResumes
            ? 'Pick up where you left off or start a fresh version in minutes.'
            : "You haven't created a resume yet. It takes just a few minutes to get started."}
        </p>
        <Button
          type='button'
          variant='secondary'
          className='mt-6 bg-surface-card text-content-primary hover:bg-surface-elevated'
          onClick={onCreateResume}
          disabled={isPending}
        >
          Create Resume
          <ArrowRight className='size-4' />
        </Button>
      </div>
      <div
        className='pointer-events-none absolute -right-4 bottom-0 hidden h-40 w-56 rounded-tl-3xl bg-primary-foreground/10 md:block lg:h-48 lg:w-72'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute right-8 top-6 hidden size-24 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 md:block'
        aria-hidden
      />
    </section>
  );
}
