'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, Columns, Layout, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  image: string;
  hasHeadshot: boolean;
  layout: 'single' | 'two-column';
  category: string;
}

interface TemplateSelectorProps {
  onSelect?: (templateId: string) => void;
  selectedTemplate?: string | null;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_1.svg',
    hasHeadshot: true,
    layout: 'single',
    category: 'professional',
  },
  {
    id: '2',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_2.svg',
    hasHeadshot: false,
    layout: 'two-column',
    category: 'modern',
  },
  {
    id: '3',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_3.svg',
    hasHeadshot: true,
    layout: 'two-column',
    category: 'creative',
  },
  {
    id: '4',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_1.svg',
    hasHeadshot: false,
    layout: 'single',
    category: 'professional',
  },
  {
    id: '5',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_2.svg',
    hasHeadshot: true,
    layout: 'single',
    category: 'modern',
  },
  {
    id: '6',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_3.svg',
    hasHeadshot: false,
    layout: 'two-column',
    category: 'creative',
  },
  {
    id: '7',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_1.svg',
    hasHeadshot: true,
    layout: 'two-column',
    category: 'professional',
  },
  {
    id: '8',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_2.svg',
    hasHeadshot: false,
    layout: 'single',
    category: 'modern',
  },
  {
    id: '9',
    name: 'Azuril',
    image: '/images/onboarding/resume_thumb_3.svg',
    hasHeadshot: true,
    layout: 'single',
    category: 'creative',
  },
];

export const TemplateSelector = ({
  onSelect,
  selectedTemplate,
}: TemplateSelectorProps) => {
  const [headshotFilter, setHeadshotFilter] = React.useState<boolean | null>(
    null
  );
  const [layoutFilter, setLayoutFilter] = React.useState<
    'single' | 'two-column' | null
  >(null);

  const filteredTemplates = React.useMemo(() => {
    return templates.filter((template) => {
      if (headshotFilter !== null && template.hasHeadshot !== headshotFilter) {
        return false;
      }
      if (layoutFilter !== null && template.layout !== layoutFilter) {
        return false;
      }
      return true;
    });
  }, [headshotFilter, layoutFilter]);

  const handleHeadshotToggle = () => {
    if (headshotFilter === true) {
      setHeadshotFilter(null);
    } else {
      setHeadshotFilter(true);
    }
  };

  const handleLayoutToggle = (layout: 'single' | 'two-column') => {
    if (layoutFilter === layout) {
      setLayoutFilter(null);
    } else {
      setLayoutFilter(layout);
    }
  };

  const clearFilters = () => {
    setHeadshotFilter(null);
    setLayoutFilter(null);
  };

  const hasActiveFilters = headshotFilter !== null || layoutFilter !== null;

  return (
    <div className="w-full">
      {/* Filter Bar - Above Templates */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700 mr-2">
              Filter by:
            </span>

            {/* Headshot Filter */}
            <button
              onClick={handleHeadshotToggle}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                'border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                headshotFilter === true
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
              )}
              aria-label="Filter templates with headshot"
            >
              <User
                className={cn(
                  'w-4 h-4',
                  headshotFilter === true ? 'text-white' : 'text-gray-500'
                )}
              />
              <span>With Headshot</span>
              {headshotFilter === true && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Layout Filters */}
            <button
              onClick={() => handleLayoutToggle('single')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                'border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                layoutFilter === 'single'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
              )}
              aria-label="Filter single column templates"
            >
              <Layout
                className={cn(
                  'w-4 h-4',
                  layoutFilter === 'single' ? 'text-white' : 'text-gray-500'
                )}
              />
              <span>Single Column</span>
              {layoutFilter === 'single' && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>

            <button
              onClick={() => handleLayoutToggle('two-column')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                'border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                layoutFilter === 'two-column'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
              )}
              aria-label="Filter two column templates"
            >
              <Columns
                className={cn(
                  'w-4 h-4',
                  layoutFilter === 'two-column' ? 'text-white' : 'text-gray-500'
                )}
              />
              <span>Two Column</span>
              {layoutFilter === 'two-column' && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-primary transition-colors underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${template.name} template`}
              onClick={() => onSelect?.(template.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(template.id);
                }
              }}
              className={cn(
                'group cursor-pointer transition-all duration-300 overflow-hidden',
                'hover:shadow-lg hover:-translate-y-1',
                'relative',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                selectedTemplate === template.id && 'shadow-lg'
              )}
            >
              {/* Template Image */}
              <div className="relative aspect-3/4 overflow-hidden">
                <Image
                  src={template.image}
                  alt={`${template.name} template`}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Selection Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg z-10">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Template Name */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 text-center">
                  {template.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No templates match your filters</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};
