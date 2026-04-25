import type { ReactNode } from 'react';

import { Navbar } from '@/components/common/Navbar';

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
