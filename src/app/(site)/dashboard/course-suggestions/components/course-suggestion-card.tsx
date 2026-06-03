'use client';

import { Bookmark, ExternalLink, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { CourseSuggestion } from '../lib/course-suggestions-data';

interface CourseSuggestionCardProps {
  course: CourseSuggestion;
  isBookmarked: boolean;
  onToggleBookmark: (courseId: string) => void;
}

export function CourseSuggestionCard({
  course,
  isBookmarked,
  onToggleBookmark,
}: CourseSuggestionCardProps) {
  return (
    <article className='overflow-hidden rounded-xl border border-subtle bg-surface-card shadow-card'>
      <div className='relative h-40 bg-surface-elevated'>
        <div
          className='absolute inset-0 bg-linear-to-br from-feedback-info/20 via-surface-page to-primary/15'
          aria-hidden
        />
        <div
          className='absolute inset-0 opacity-30'
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, var(--color-feedback-info) 0%, transparent 45%), radial-gradient(circle at 80% 70%, var(--color-primary) 0%, transparent 40%)',
          }}
          aria-hidden
        />
        <div className='absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-subtle bg-surface-card px-2.5 py-1 text-xs font-medium text-content-primary shadow-sm'>
          <span className='size-2 rounded-full bg-primary' aria-hidden />
          {course.platform}
        </div>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={cn(
            'absolute top-3 right-3 size-9 cursor-pointer rounded-full shadow-sm',
            isBookmarked
              ? 'bg-feedback-warning text-primary-foreground hover:bg-feedback-warning/90'
              : 'border border-subtle bg-surface-card text-content-secondary hover:bg-surface-elevated'
          )}
          aria-label={
            isBookmarked ? 'Remove bookmark' : `Bookmark ${course.title}`
          }
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(course.id)}
        >
          <Bookmark
            className={cn('size-4', isBookmarked && 'fill-current')}
            aria-hidden
          />
        </Button>
      </div>

      <div className='space-y-3 p-4'>
        <div>
          <h3 className='font-semibold leading-snug text-content-primary'>
            {course.title}
          </h3>
          <p className='mt-1 text-sm text-content-secondary'>{course.author}</p>
        </div>

        <div className='flex items-center justify-between gap-2 text-sm'>
          <span className='inline-flex items-center gap-1 text-content-secondary'>
            <Star
              className='size-4 fill-feedback-warning text-feedback-warning'
              aria-hidden
            />
            {course.rating} ({course.ratingCount})
          </span>
          <span className='text-content-muted'>
            Duration: {course.durationHours}h
          </span>
        </div>

        <div className='flex items-center justify-between gap-3 border-t border-subtle pt-3'>
          <div className='flex flex-wrap gap-2 text-xs text-content-muted'>
            <span>{course.priceLabel}</span>
            <span>{course.paceLabel}</span>
          </div>
          <Button
            type='button'
            size='sm'
            className='cursor-pointer gap-1.5'
            onClick={() => {
              /* Course detail route coming when API is available */
            }}
          >
            View Details
            <ExternalLink className='size-3.5' aria-hidden />
          </Button>
        </div>
      </div>
    </article>
  );
}
