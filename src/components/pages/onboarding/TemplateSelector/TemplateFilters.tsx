'use client';

import { User, Columns, Layout, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateLayout } from './types';

interface TemplateFiltersProps {
  headshotFilter: boolean | null;
  layoutFilter: TemplateLayout | null;
  onHeadshotToggle: () => void;
  onLayoutToggle: (layout: TemplateLayout) => void;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const TemplateFilters = ({
  headshotFilter,
  layoutFilter,
  onHeadshotToggle,
  onLayoutToggle,
  onClearFilters,
  filteredCount,
  totalCount,
}: TemplateFiltersProps) => {
  const hasActiveFilters = headshotFilter !== null || layoutFilter !== null;

  return (
    <div className='mb-8'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle'>
        <div className='flex flex-wrap items-center gap-3'>
          <span className='text-sm font-medium text-content-secondary mr-2'>
            Filter by:
          </span>

          {/* Headshot Filter */}
          <button
            onClick={onHeadshotToggle}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              'border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              headshotFilter === true
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-card text-content-secondary border-border-subtle hover:border-primary hover:text-primary'
            )}
            aria-label='Filter templates with headshot'
          >
            <User
              className={cn(
                'w-4 h-4',
                headshotFilter === true ? 'text-white' : 'text-content-muted'
              )}
            />
            <span>With Headshot</span>
            {headshotFilter === true && (
              <Check className='w-4 h-4 text-white' />
            )}
          </button>

          {/* Layout Filters */}
          <button
            onClick={() => onLayoutToggle('single')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              'border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              layoutFilter === 'single'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-card text-content-secondary border-border-subtle hover:border-primary hover:text-primary'
            )}
            aria-label='Filter single column templates'
          >
            <Layout
              className={cn(
                'w-4 h-4',
                layoutFilter === 'single' ? 'text-white' : 'text-content-muted'
              )}
            />
            <span>Single Column</span>
            {layoutFilter === 'single' && (
              <Check className='w-4 h-4 text-white' />
            )}
          </button>

          <button
            onClick={() => onLayoutToggle('two-column')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              'border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              layoutFilter === 'two-column'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-card text-content-secondary border-border-subtle hover:border-primary hover:text-primary'
            )}
            aria-label='Filter two column templates'
          >
            <Columns
              className={cn(
                'w-4 h-4',
                layoutFilter === 'two-column' ? 'text-white' : 'text-content-muted'
              )}
            />
            <span>Two Column</span>
            {layoutFilter === 'two-column' && (
              <Check className='w-4 h-4 text-white' />
            )}
          </button>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className='text-sm text-content-secondary hover:text-primary transition-colors underline'
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className='mt-4 text-sm text-content-secondary'>
        Showing {filteredCount} of {totalCount} templates
      </div>
    </div>
  );
};
