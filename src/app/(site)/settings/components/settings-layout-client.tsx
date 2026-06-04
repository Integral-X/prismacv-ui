'use client';

import type { ReactNode } from 'react';
import { SettingsSidebar } from './settings-sidebar';

interface SettingsLayoutClientProps {
  children: ReactNode;
}

export function SettingsLayoutClient({ children }: SettingsLayoutClientProps) {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-8 lg:py-10'>
      <div className='flex flex-col gap-8 lg:flex-row lg:gap-10'>
        <SettingsSidebar />
        <div className='min-w-0 flex-1'>{children}</div>
      </div>
    </div>
  );
}
