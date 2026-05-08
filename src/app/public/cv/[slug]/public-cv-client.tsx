'use client';

import Link from 'next/link';
import { CvPreviewPanel } from '@/modules/cv/components/cv-preview-panel';
import type { Cv } from '@/modules/cv/data/mappers';
import { Button } from '@/components/ui/button';

interface PublicCvClientProps {
  cv: Cv;
}

export function PublicCvClient({ cv }: PublicCvClientProps) {
  return (
    <div className='min-h-screen bg-surface-primary'>
      <header className='border-b border-subtle bg-surface-card'>
        <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4'>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-content-muted'>
              Shared resume
            </p>
            <h1 className='text-lg font-semibold text-content-primary'>
              {cv.title}
            </h1>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link href='/'>Back to PrismaCV</Link>
          </Button>
        </div>
      </header>
      <div className='mx-auto max-w-4xl px-4 py-8'>
        <CvPreviewPanel cv={cv} />
      </div>
    </div>
  );
}
