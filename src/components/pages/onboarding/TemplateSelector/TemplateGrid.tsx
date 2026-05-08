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
  const cardRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const focusTemplateByIndex = React.useCallback(
    (targetIndex: number) => {
      if (templates.length === 0) return;
      const normalized = (targetIndex + templates.length) % templates.length;
      cardRefs.current[normalized]?.focus();
    },
    [templates.length]
  );

  const handleTemplateKeyDown = React.useCallback(
    (
      e: React.KeyboardEvent<HTMLButtonElement>,
      templateId: string,
      index: number
    ) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(templateId);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusTemplateByIndex(index + 1);
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusTemplateByIndex(index - 1);
      }
    },
    [focusTemplateByIndex, onSelect]
  );

  if (templates.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-content-muted mb-4'>
          No templates match your filters
        </p>
        <Button variant='outline' onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {templates.map((template, index) => (
        <button
          type='button'
          key={template.id}
          ref={(node) => {
            cardRefs.current[index] = node;
          }}
          tabIndex={
            selectedTemplate === template.id ||
            (selectedTemplate === null && index === 0)
              ? 0
              : -1
          }
          aria-label={`${template.name} template`}
          aria-current={selectedTemplate === template.id ? 'true' : undefined}
          onClick={() => onSelect(template.id)}
          onKeyDown={(e) => handleTemplateKeyDown(e, template.id, index)}
          className={cn(
            'group relative cursor-pointer overflow-hidden text-left transition-all duration-300',
            'hover:shadow-lg hover:-translate-y-1',
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
            <p className='text-sm font-medium text-content-primary text-center'>
              {template.name}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
