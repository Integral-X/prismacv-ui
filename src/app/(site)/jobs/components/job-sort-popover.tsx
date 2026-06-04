'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import type { JobSortOption } from '../lib/job-tracker-types';

interface JobSortPopoverProps {
  sort: JobSortOption;
  onApply: (sort: JobSortOption) => void;
}

export function JobSortPopover({ sort, onApply }: JobSortPopoverProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<JobSortOption>(sort);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(sort);
    }
    setOpen(nextOpen);
  }

  function handleReset() {
    setDraft('none');
  }

  function handleApply() {
    onApply(draft);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button type='button' variant='outline' className='gap-2'>
          <SlidersHorizontal className='size-4' aria-hidden />
          Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-72 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <p className='font-semibold text-content-primary'>Sort</p>
          <Button
            type='button'
            variant='link'
            className='h-auto px-0 text-sm text-primary'
            onClick={handleReset}
          >
            Reset all
          </Button>
        </div>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <Checkbox
              id='sort-due-date-asc'
              checked={draft === 'dueDateAsc'}
              onCheckedChange={(checked) =>
                setDraft(checked ? 'dueDateAsc' : 'none')
              }
            />
            <label
              htmlFor='sort-due-date-asc'
              className='flex cursor-pointer items-center gap-2 text-sm text-content-primary'
            >
              Due date
              <ArrowUp className='size-3.5' aria-hidden />
            </label>
          </div>
          <div className='flex items-center gap-3'>
            <Checkbox
              id='sort-due-date-desc'
              checked={draft === 'dueDateDesc'}
              onCheckedChange={(checked) =>
                setDraft(checked ? 'dueDateDesc' : 'none')
              }
            />
            <label
              htmlFor='sort-due-date-desc'
              className='flex cursor-pointer items-center gap-2 text-sm text-content-primary'
            >
              Due date
              <ArrowDown className='size-3.5' aria-hidden />
            </label>
          </div>
        </div>
        <Button
          type='button'
          variant='outline'
          className='mt-4 w-full border-primary text-primary hover:bg-primary/5'
          onClick={handleApply}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
}
