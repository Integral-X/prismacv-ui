'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Cv } from '@/modules/cv/data/mappers';
import { CvPreview } from './cv-preview';

interface CvPreviewPanelProps {
  cv: Cv;
}

export function CvPreviewPanel({ cv }: CvPreviewPanelProps) {
  const [scale, setScale] = useState(0.4);

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between border-b border-subtle px-4 py-2'>
        <span className='text-sm font-medium text-content-secondary'>
          Preview
        </span>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            aria-label='Zoom out'
            onClick={() =>
              setScale((s) => Math.max(0.25, +(s - 0.1).toFixed(1)))
            }
          >
            <ZoomOut className='h-4 w-4' />
          </Button>
          <span className='w-10 text-center text-xs text-content-secondary'>
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant='ghost'
            size='sm'
            aria-label='Zoom in'
            onClick={() =>
              setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(1)))
            }
          >
            <ZoomIn className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <div className='flex-1 overflow-auto bg-gray-100 p-4'>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          <CvPreview cv={cv} templateId={cv.templateId} />
        </div>
      </div>
    </div>
  );
}
