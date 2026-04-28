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
    <Card className='bg-surface-card shadow-card'>
      <CardHeader
        className='cursor-pointer select-none'
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-content-primary'>{title}</CardTitle>
            <Badge variant='secondary'>{count}</Badge>
          </div>
          <ChevronDown
            className={cn(
              'size-5 text-content-secondary transition-transform',
              open && 'rotate-180'
            )}
          />
        </div>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}
