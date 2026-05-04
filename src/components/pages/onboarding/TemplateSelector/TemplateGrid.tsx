'use client';

import * as React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Template } from './types';

interface TemplateGridProps {
  templates: Template[];
  selectedTemplate: string | null;
  onSelect: (templateId: string) => void;
  onClearFilters: () => void;
}

export const TemplateGrid = ({
  templates,
  selectedTemplate,
  onSelect,
  onClearFilters,
}: TemplateGridProps) => {
  if (templates.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 mb-4'>No templates match your filters</p>
        <Button variant='outline' onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div
      role='radiogroup'
      aria-label='Choose a template'
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
    >
      {templates.map((template, index) => (
        <div
          key={template.id}
          role='radio'
          tabIndex={
            selectedTemplate === template.id ||
            (selectedTemplate === null && index === 0)
              ? 0
              : -1
          }
          aria-checked={selectedTemplate === template.id}
          aria-label={`${template.name} template`}
          onClick={() => onSelect(template.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(template.id);
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
          <div className='relative aspect-3/4 overflow-hidden'>
            <Image
              src={template.image}
              alt={`${template.name} template`}
              fill
              className='object-contain group-hover:scale-105 transition-transform duration-300'
            />
          </div>

          {/* Selection Indicator */}
          {selectedTemplate === template.id && (
            <div className='absolute top-1 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg z-10'>
              <Check className='w-5 h-5 text-white' />
            </div>
          )}

          {/* Template Name */}
          <div className='p-4'>
            <p className='text-sm font-medium text-gray-900 text-center'>
              {template.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
