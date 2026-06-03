'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  CreditCard,
  KeyRound,
  Star,
  Trash2,
  User,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: typeof User;
  variant?: 'default' | 'danger';
}

const accountItems: NavItem[] = [
  { href: '/settings', label: 'Personal Info', icon: User },
  {
    href: '/settings/change-password',
    label: 'Login & Password',
    icon: KeyRound,
  },
];

const billingItems: NavItem[] = [
  {
    href: '/settings/billing',
    label: 'Plan & Subscription',
    icon: Star,
  },
  {
    href: '/settings/billing/invoices',
    label: 'Billing & Invoices',
    icon: CreditCard,
  },
];

const dangerItems: NavItem[] = [
  {
    href: '/settings/delete-account',
    label: 'Delete Account',
    icon: Trash2,
    variant: 'danger',
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/settings') {
    return pathname === '/settings';
  }

  if (href === '/settings/billing') {
    return pathname === '/settings/billing';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  const isDanger = item.variant === 'danger';

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isDanger
          ? cn(
              'text-destructive hover:bg-destructive/10',
              active && 'bg-destructive/10'
            )
          : cn(
              'text-content-secondary hover:bg-surface-elevated hover:text-content-primary',
              active && 'bg-primary/10 text-primary'
            )
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className='size-4 shrink-0' aria-hidden />
      {item.label}
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div>
      <p className='mb-2 px-3 text-xs font-semibold tracking-wide text-content-muted uppercase'>
        {title}
      </p>
      <nav className='flex flex-col gap-0.5' aria-label={title}>
        {items.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
    </div>
  );
}

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-full shrink-0 lg:w-56'>
      <div className='rounded-xl border border-subtle bg-surface-card p-4 shadow-card'>
        <Link
          href='/dashboard'
          className='mb-6 flex items-center gap-2 px-3 py-2 text-sm font-medium text-content-secondary transition-colors hover:text-content-primary'
        >
          <ChevronLeft className='size-4' aria-hidden />
          Back to dashboard
        </Link>

        <div className='space-y-6'>
          <NavSection
            title='Account Settings'
            items={accountItems}
            pathname={pathname}
          />
          <NavSection
            title='Billing'
            items={billingItems}
            pathname={pathname}
          />
          <NavSection title='Danger' items={dangerItems} pathname={pathname} />
        </div>
      </div>
    </aside>
  );
}
