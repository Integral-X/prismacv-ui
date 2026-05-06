import type { ReactNode } from 'react';

import { Navbar } from '@/components/common/Navbar';

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none'
      >
        Skip to main content
      </a>
      <Navbar />
      <main id='main-content'>{children}</main>
    </>
  );
}
