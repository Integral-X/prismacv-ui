'use client';

import { Bookmark, ListFilter, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CourseSuggestionsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  bookmarkedOnly: boolean;
  onBookmarkedOnlyChange: (value: boolean) => void;
  bookmarkCount: number;
}

export function CourseSuggestionsToolbar({
  search,
  onSearchChange,
  bookmarkedOnly,
  onBookmarkedOnlyChange,
  bookmarkCount,
}: CourseSuggestionsToolbarProps) {
  return (
    <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
      <div className='relative min-w-0 flex-1'>
        <Search
          className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-content-muted'
          aria-hidden
        />
        <Input
          type='search'
          placeholder='Search courses, skills ...'
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className='pl-9'
          aria-label='Search courses and skills'
        />
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          className='cursor-pointer gap-2'
        >
          <ListFilter className='size-4' aria-hidden />
          All
        </Button>
        <Button
          type='button'
          className={cn(
            'cursor-pointer gap-2',
            bookmarkedOnly && 'ring-2 ring-primary ring-offset-2'
          )}
          onClick={() => onBookmarkedOnlyChange(!bookmarkedOnly)}
        >
          <Bookmark className='size-4' aria-hidden />
          Bookmark
          {bookmarkCount > 0 ? (
            <span className='rounded-full bg-primary-foreground/20 px-1.5 text-xs'>
              {bookmarkCount}
            </span>
          ) : null}
        </Button>
      </div>
    </div>
  );
}
