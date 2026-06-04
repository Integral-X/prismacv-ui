import type { ReactNode } from 'react';

import { Navbar } from '@/components/common/Navbar';

import { DashboardPathShell } from './dashboard-path-shell';

export function DashboardPathShellWrapper({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardPathShell navbar={<Navbar />}>{children}</DashboardPathShell>
  );
}
