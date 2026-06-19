"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  appNavAdminItem,
  dashboardNavItems,
  isAppNavActive,
} from "./app-nav-items";

export interface DashboardSidebarUser {
  name: string;
  email: string;
  initials: string;
}

interface DashboardSidebarProps {
  user: DashboardSidebarUser;
  isAdmin?: boolean;
}

function SidebarNavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-content-secondary hover:bg-surface-elevated hover:text-content-primary"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden />
      {label}
    </Link>
  );
}

export function DashboardSidebar({
  user,
  isAdmin = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = isAdmin
    ? [...dashboardNavItems, appNavAdminItem]
    : dashboardNavItems;

  return (
    <aside
      className="flex h-full w-60 shrink-0 flex-col border-r border-subtle bg-surface-card"
      aria-label="Dashboard navigation"
    >
      <div className="flex justify-center px-5 pt-5 pb-4">
        <Link
          href="/dashboard"
          className="transition-opacity hover:opacity-90"
          aria-label="Go to dashboard"
        >
          <Image
            src="/logo.svg"
            alt="PrismaCV"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <div className="px-4 pb-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-elevated"
        >
          <Avatar className="size-9 border border-subtle">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs text-content-muted">My Account</p>
            <p className="truncate text-sm font-semibold text-content-primary">
              {user.name}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <SidebarNavLink
            key={`${item.href}-${item.label}`}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isAppNavActive(pathname, item)}
          />
        ))}
      </nav>

      <div className="mt-auto p-4 pt-2">
        <div className="rounded-xl border border-subtle bg-surface-page p-4">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Sparkles className="size-4" aria-hidden />
            <p className="text-sm font-semibold">Upgrade Pro!</p>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-content-secondary">
            Unlock unlimited resumes, AI optimization, and priority support.
          </p>
          <Button className="w-full" size="sm" asChild>
            <Link href="/settings/billing">Upgrade Now</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
