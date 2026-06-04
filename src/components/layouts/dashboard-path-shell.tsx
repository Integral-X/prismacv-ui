'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface DashboardPathShellProps {
  children: ReactNode;
  navbar: ReactNode;
}

export function DashboardPathShell({
  children,
  navbar,
}: DashboardPathShellProps) {
  const pathname = usePathname();
  const usesAppShell =
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/jobs' ||
    pathname.startsWith('/jobs/');

  if (usesAppShell) {
    return (
      <main
        id='main-content'
        tabIndex={-1}
        className='flex min-h-0 flex-1 flex-col'
      >
        {children}
      </main>
    );
  }

  return (
    <>
      {navbar}
      <main id='main-content' tabIndex={-1} className='flex flex-1 flex-col'>
        {children}
      </main>
    </>
  );
}
