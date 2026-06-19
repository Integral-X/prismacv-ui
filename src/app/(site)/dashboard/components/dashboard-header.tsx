"use client";

import type { NavbarUser } from "@/components/common/navbar-client";

import { DashboardHeaderActions } from "./dashboard-header-actions";

interface DashboardHeaderProps {
  user: NavbarUser;
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({
  user,
  title = "Dashboard",
  subtitle,
}: DashboardHeaderProps) {
  return (
    <header className="shrink-0 px-6 py-5 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="min-w-0 text-2xl font-bold leading-none text-content-primary">
          {title}
        </h1>
        <DashboardHeaderActions user={user} />
      </div>
      {subtitle ? (
        <p className="mt-1 text-sm text-content-secondary">{subtitle}</p>
      ) : null}
    </header>
  );
}
