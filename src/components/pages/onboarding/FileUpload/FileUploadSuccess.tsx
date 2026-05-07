'use client';

import { X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UploadedFile } from './types';
import {
  getUploadBorderColor,
  getUploadBackgroundColor,
} from '../shared/utils/stateStyles';
import type { UploadState } from '../shared/utils/stateStyles';

interface FileUploadSuccessProps {
  uploadedFile: UploadedFile;
  state: UploadState;
  onRemove: () => void;
  className?: string;
}

export const FileUploadSuccess = ({
  uploadedFile,
  state,
  onRemove,
  className,
}: FileUploadSuccessProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 rounded-lg p-6 transition-all duration-300',
          getUploadBorderColor(state),
          getUploadBackgroundColor(state)
        )}
      >
        <div className='flex items-center gap-4'>
          <div className='shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
            <CheckCircle className='w-6 h-6 text-green-600' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-content-primary truncate'>
              {uploadedFile.name}
            </p>
            <p className='text-sm text-content-muted'>{uploadedFile.size}</p>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={onRemove}
            className='shrink-0'
          >
            <X className='w-5 h-5 text-content-muted' />
          </Button>
        </div>

        {/* Parsing status */}
        <div className='mt-4 flex items-center gap-2 text-sm text-green-700'>
          <div className='shrink-0 w-2 h-2 rounded-full bg-green-600 animate-pulse' />
          <span>Analyzing your CV...</span>
        </div>
      </div>
    </div>
  );
};
