'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkedInImportProgressProps {
  progress: number;
  className?: string;
}

export const LinkedInImportProgress = ({
  progress,
  className,
}: LinkedInImportProgressProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className='relative border-2 border-dashed border-border-subtle rounded-lg p-8 bg-surface-card'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse'>
            <Loader2 className='w-8 h-8 text-primary animate-spin' />
          </div>
          <div className='w-full max-w-xs'>
            <div className='flex justify-between text-sm mb-2'>
              <span className='text-content-secondary'>Importing profile...</span>
              <span className='text-primary font-medium'>{progress}%</span>
            </div>
            <div className='w-full h-2 bg-border rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary transition-all duration-300 ease-out'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
