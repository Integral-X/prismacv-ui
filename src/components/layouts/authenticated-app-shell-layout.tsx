import type { ReactNode } from 'react';

import {
  DashboardSidebar,
  type DashboardSidebarUser,
} from '@/components/common/dashboard-sidebar';
import { getCurrentUser } from '@/modules/auth/data/queries';

function toSidebarUser(user: {
  email: string;
  name?: string;
}): DashboardSidebarUser {
  const name = user.name?.trim() || user.email.split('@')[0];
  const nameParts = name.split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length > 0
      ? nameParts
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
          .toUpperCase()
      : user.email.slice(0, 2).toUpperCase();

  return { name, email: user.email, initials };
}

export default async function AuthenticatedAppShellLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();
  const sidebarUser = user
    ? toSidebarUser(user)
    : { name: 'Guest', email: '', initials: 'G' };

  return (
    <div className='flex h-[calc(100svh)] w-full bg-surface-page'>
      <DashboardSidebar user={sidebarUser} isAdmin={user?.role === 'admin'} />
      <div className='flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden'>
        {children}
      </div>
    </div>
  );
}
