import type { ReactNode } from 'react';

import { Footer } from '@/components/common/Footer';

import { SettingsLayoutClient } from './components/settings-layout-client';

export default function SettingsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='flex min-h-full flex-col bg-surface-page'>
      <SettingsLayoutClient>{children}</SettingsLayoutClient>
      <Footer />
    </div>
  );
}
