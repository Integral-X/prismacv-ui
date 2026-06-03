'use client';

import { NotificationsPopover } from '@/components/common/notifications-popover';
import { UserAccountMenu } from '@/components/common/user-account-menu';
import type { NavbarUser } from '@/components/common/navbar-client';
import { cn } from '@/lib/utils';

const dashboardHeaderBellClassName = 'size-5';
const dashboardHeaderAvatarClassName = 'size-8';

/** Shared 40×40 trigger — overrides Button `size="icon"` (36px) so bell and avatar align. */
export const dashboardHeaderActionTriggerClassName = cn(
  '!flex !size-10 !h-10 !w-10 !min-h-10 !min-w-10 !shrink-0',
  '!items-center !justify-center !rounded-full !p-0'
);

interface DashboardHeaderActionsProps {
  user: NavbarUser;
}

export function DashboardHeaderActions({ user }: DashboardHeaderActionsProps) {
  return (
    <div
      className='flex items-center gap-2'
      role='group'
      aria-label='Account actions'
    >
      <div className='flex size-10 items-center justify-center'>
        <NotificationsPopover
          triggerClassName={cn(
            dashboardHeaderActionTriggerClassName,
            'relative'
          )}
          bellClassName={dashboardHeaderBellClassName}
        />
      </div>
      <div className='flex size-10 items-center justify-center'>
        <UserAccountMenu
          user={user}
          triggerClassName={dashboardHeaderActionTriggerClassName}
          avatarClassName={dashboardHeaderAvatarClassName}
        />
      </div>
    </div>
  );
}
