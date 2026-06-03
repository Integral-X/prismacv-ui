import type { LucideIcon } from 'lucide-react';
import { CalendarDays, FileText } from 'lucide-react';

export type NotificationGroupLabel = 'Today' | 'Yesterday' | 'Earlier';

export interface DashboardNotification {
  id: string;
  group: NotificationGroupLabel;
  title: string;
  description: string;
  timeLabel: string;
  icon: LucideIcon;
  read: boolean;
}

export const initialDashboardNotifications: DashboardNotification[] = [
  {
    id: 'notif-1',
    group: 'Today',
    title: 'Interview Reminder: Google',
    description:
      'Your interview is coming up soon. Get ready and be confident.',
    timeLabel: '1 hour ago',
    icon: CalendarDays,
    read: false,
  },
  {
    id: 'notif-2',
    group: 'Today',
    title: 'Interview Reminder: Google',
    description:
      'Your interview is coming up soon. Get ready and be confident.',
    timeLabel: '1 hour ago',
    icon: CalendarDays,
    read: false,
  },
  {
    id: 'notif-3',
    group: 'Today',
    title: 'Interview Reminder: Google',
    description:
      'Your interview is coming up soon. Get ready and be confident.',
    timeLabel: '1 hour ago',
    icon: CalendarDays,
    read: false,
  },
  {
    id: 'notif-4',
    group: 'Yesterday',
    title: 'Application saved',
    description: 'Product Designer at Linear was added to your job tracker.',
    timeLabel: 'Yesterday',
    icon: CalendarDays,
    read: false,
  },
  {
    id: 'notif-5',
    group: 'Yesterday',
    title: 'CV updated',
    description: 'Resume v3 Design was saved successfully.',
    timeLabel: 'Yesterday',
    icon: FileText,
    read: true,
  },
];

export const notificationGroupOrder: NotificationGroupLabel[] = [
  'Today',
  'Yesterday',
  'Earlier',
];
