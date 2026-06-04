'use client';

import * as React from 'react';
import { Linkedin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getImportBorderColor,
  getImportBackgroundColor,
} from '../shared/utils/stateStyles';
import type { ImportState } from '../shared/utils/stateStyles';

interface LinkedInImportFormProps {
  state: ImportState;
  linkedInUrl: string;
  errorMessage: string;
  onUrlChange: (url: string) => void;
  onImport: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

export const LinkedInImportForm = ({
  state,
  linkedInUrl,
  errorMessage,
  onUrlChange,
  onImport,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  className,
}: LinkedInImportFormProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div
        role='button'
        tabIndex={0}
        aria-label='Import LinkedIn profile - enter URL or click to focus input'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        className={cn(
          'relative border-2 rounded-lg p-8 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          getImportBorderColor(state),
          getImportBackgroundColor(state),
          state === 'hover' && 'scale-[1.01]'
        )}
        onClick={(e) => {
          // Only focus input if clicking on the card itself, not the input/button
          if (e.target === e.currentTarget) {
            const input = e.currentTarget.querySelector('input');
            input?.focus();
          }
        }}
      >
        <div className='flex flex-col items-center text-center space-y-6'>
          {/* LinkedIn Icon */}
          <div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
              state === 'error' ? 'bg-feedback-error/15' : 'bg-primary/10',
              state === 'hover' && 'scale-110 bg-primary/20'
            )}
          >
            {state === 'error' ? (
              <AlertCircle className='w-10 h-10 text-feedback-error' />
            ) : (
              <Linkedin className='w-10 h-10 text-primary' />
            )}
          </div>

          {/* Text */}
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-content-primary'>
              {state === 'error'
                ? 'Import Failed'
                : 'Drop your LinkedIn profile here'}
            </h3>
            {state === 'error' && (
              <p className='text-sm text-feedback-error'>{errorMessage}</p>
            )}
          </div>

          {/* Input Field and Import Button */}
          <div className='w-full max-w-md flex gap-3'>
            <div className='flex-1 relative'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
                <Linkedin className='w-5 h-5 text-content-muted' />
              </div>
              <Input
                type='text'
                placeholder='https://linkedin.com/in/...'
                value={linkedInUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                onKeyDown={onKeyDown}
                className={cn(
                  'pl-10 pr-4 py-6 text-base',
                  state === 'error' &&
                    'border-feedback-error focus:border-feedback-error'
                )}
                aria-label='LinkedIn profile URL'
              />
            </div>
            <Button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onImport();
              }}
              disabled={!linkedInUrl.trim()}
              className='px-8 py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Import
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
