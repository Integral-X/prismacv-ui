import type { ReactNode } from "react";

import { DashboardPathShellWrapper } from "@/components/layouts/dashboard-path-shell-wrapper";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-content-inverse focus:outline-none"
      >
        Skip to main content
      </a>
      <DashboardPathShellWrapper>{children}</DashboardPathShellWrapper>
    </div>
  );
}
