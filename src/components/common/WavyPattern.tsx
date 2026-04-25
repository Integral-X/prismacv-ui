import * as React from 'react';
import { cn } from '@/lib/utils';

interface WavyPatternProps {
  className?: string;
  height?: number;
}

export const WavyPattern = ({ className, height = 200 }: WavyPatternProps) => {
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <svg
        className='w-full'
        viewBox='0 0 1440 200'
        preserveAspectRatio='none'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{ height: `${height}px` }}
      >
        {/* Top wave layer - lighter teal (#B2E1E4) */}
        <path
          d='M0,30 C320,80 480,0 720,40 C960,80 1120,10 1440,50 L1440,200 L0,200 Z'
          fill='#B2E1E4'
        />
        {/* Bottom wave layer - darker teal (#59BEC4) */}
        <path
          d='M0,80 C320,130 480,60 720,100 C960,140 1120,70 1440,110 L1440,200 L0,200 Z'
          fill='#59BEC4'
        />
      </svg>
    </div>
  );
};
