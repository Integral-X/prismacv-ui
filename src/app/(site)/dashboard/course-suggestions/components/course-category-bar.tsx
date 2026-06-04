'use client';

import { useRef } from 'react';
import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  COURSE_CATEGORIES,
  type CourseCategory,
} from '../lib/course-suggestions-data';

interface CourseCategoryBarProps {
  activeCategory: CourseCategory;
  onCategoryChange: (category: CourseCategory) => void;
}

export function CourseCategoryBar({
  activeCategory,
  onCategoryChange,
}: CourseCategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }

  return (
    <div>
      <h2 className='mb-3 text-base font-semibold text-content-primary'>
        Categories
      </h2>
      <div className='relative'>
        <div
          ref={scrollRef}
          className='flex gap-2 overflow-x-auto pb-1 pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          role='tablist'
          aria-label='Course categories'
        >
          {COURSE_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type='button'
                role='tab'
                aria-selected={isActive}
                className={cn(
                  'shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-subtle bg-surface-card text-content-secondary hover:border-primary/30 hover:text-content-primary'
                )}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='absolute top-1/2 right-0 size-8 -translate-y-1/2 cursor-pointer rounded-full bg-surface-card shadow-sm'
          aria-label='Scroll categories right'
          onClick={scrollRight}
        >
          <ChevronRight className='size-4' />
        </Button>
      </div>
    </div>
  );
}
