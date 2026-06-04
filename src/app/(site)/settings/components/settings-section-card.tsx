import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SettingsSectionCardProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSectionCard({
  label,
  children,
  className,
}: SettingsSectionCardProps) {
  return (
    <Card className={cn('border-subtle shadow-card', className)}>
      <CardContent className='p-6'>
        <p className='mb-4 text-xs font-semibold tracking-wide text-content-muted uppercase'>
          {label}
        </p>
        {children}
      </CardContent>
    </Card>
  );
}
