import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardSurfaceCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function DashboardSurfaceCard({
  children,
  className,
  interactive = true,
}: DashboardSurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-subtle bg-surface-card shadow-card",
        interactive &&
          "transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:shadow-(--shadow-cardHover)",
        className
      )}
    >
      {children}
    </div>
  );
}
