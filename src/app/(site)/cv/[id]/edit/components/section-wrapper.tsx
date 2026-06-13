'use client';

import { useState, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  title: string;
  count: number;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SectionWrapper({
  title,
  count,
  children,
  defaultOpen = false,
}: SectionWrapperProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className='gap-0 bg-surface-card py-0 shadow-card'>
      <CardHeader className='p-0'>
        <button
          type='button'
          className='flex w-full cursor-pointer items-center justify-between px-4 py-3 select-none'
          aria-expanded={open ? 'true' : 'false'}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm text-content-primary'>
              {title}
            </CardTitle>
            <Badge variant='secondary'>{count}</Badge>
          </div>
          <ChevronDown
            className={cn(
              'size-4 text-content-secondary transition-transform',
              open && 'rotate-180'
            )}
          />
        </button>
      </CardHeader>
      {open && <CardContent className='px-4 pt-0 pb-4'>{children}</CardContent>}
    </Card>
  );
}
