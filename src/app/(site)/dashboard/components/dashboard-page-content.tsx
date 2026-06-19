import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { DashboardSurfaceCard } from "./dashboard-surface-card";

type DashboardPageContentMaxWidth = "6xl" | "2xl" | "1600";

const maxWidthClass: Record<DashboardPageContentMaxWidth, string> = {
  "6xl": "max-w-6xl",
  "2xl": "max-w-2xl",
  "1600": "max-w-[1600px]",
};

interface DashboardPageContentProps {
  children: ReactNode;
  maxWidth?: DashboardPageContentMaxWidth;
  className?: string;
  cardClassName?: string;
}

export function DashboardPageContent({
  children,
  maxWidth = "6xl",
  className,
  cardClassName,
}: DashboardPageContentProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8",
        className
      )}
    >
      <div className={cn("mx-auto w-full", maxWidthClass[maxWidth])}>
        <DashboardSurfaceCard
          interactive={false}
          className={cn("p-4 md:p-6", cardClassName)}
        >
          {children}
        </DashboardSurfaceCard>
      </div>
    </div>
  );
}
