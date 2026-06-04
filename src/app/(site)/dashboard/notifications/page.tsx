import { getCurrentUser } from '@/modules/auth/data/queries';

import { NotificationsPageClient } from './notifications-page-client';

export const dynamic = 'force-dynamic';

export default async function DashboardNotificationsPage() {
  const user = await getCurrentUser();

  return (
    <NotificationsPageClient
      user={
        user
          ? {
              email: user.email,
              name: user.name,
              isAdmin: user.role === 'admin',
            }
          : null
      }
    />
  );
}
