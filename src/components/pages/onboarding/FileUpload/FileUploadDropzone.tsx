'use client';

import * as React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  getUploadBorderColor,
  getUploadBackgroundColor,
} from '../shared/utils/stateStyles';
import type { UploadState } from '../shared/utils/stateStyles';

interface FileUploadDropzoneProps {
  state: UploadState;
  errorMessage: string;
  acceptedFormats: readonly string[];
  maxSizeMB: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBrowseClick: () => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FileUploadDropzone = ({
  state,
  errorMessage,
  acceptedFormats,
  maxSizeMB,
  fileInputRef,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  onBrowseClick,
  onFileInput,
  className,
}: FileUploadDropzoneProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div
        role='button'
        tabIndex={0}
        aria-label='Upload CV file - drag and drop or click to browse'
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        className={cn(
          'relative border-2 rounded-lg p-8 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          getUploadBorderColor(state),
          getUploadBackgroundColor(state),
          state === 'hover' && 'border-primary/50 bg-primary/5',
          state === 'dragover' && 'scale-[1.02]'
        )}
        onClick={onBrowseClick}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept={acceptedFormats.join(',')}
          onChange={onFileInput}
          className='hidden'
        />

        <div className='flex flex-col items-center text-center space-y-4'>
          {/* Icon */}
          <div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
              state === 'error' ? 'bg-red-100' : 'bg-primary/10',
              state === 'hover' && 'scale-110',
              state === 'dragover' && 'scale-110 bg-primary/20'
            )}
          >
            {state === 'error' ? (
              <AlertCircle className='w-10 h-10 text-red-600' />
            ) : (
              <Upload
                className={cn(
                  'w-10 h-10 text-primary transition-transform duration-300',
                  state === 'dragover' && 'scale-110'
                )}
              />
            )}
          </div>

          {/* Text */}
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-content-primary'>
              {state === 'error' ? 'Upload Failed' : 'Drag & drop your CV here'}
            </h3>
            {state === 'error' ? (
              <p className='text-sm text-red-600'>{errorMessage}</p>
            ) : (
              <p className='text-sm text-content-secondary'>
                or click to browse
              </p>
            )}
          </div>

          {/* File format info */}
          <p className='text-xs text-content-muted'>
            Supports {acceptedFormats.join(', ').toUpperCase()} (Max {maxSizeMB}
            MB)
          </p>

          {/* Browse button */}
          <Button
            type='button'
            variant='default'
            className='mt-4'
            onClick={(e) => {
              e.stopPropagation();
              onBrowseClick();
            }}
          >
            Browse File
          </Button>
        </div>
      </div>
    </div>
  );
};
