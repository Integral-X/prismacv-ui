import {
  Award,
  Briefcase,
  CalendarDays,
  FileText,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { JobStats } from "@/modules/jobs/data/mappers";

import { DashboardSurfaceCard } from "./dashboard-surface-card";

interface DashboardStatCardsProps {
  stats: JobStats;
  cvCount: number;
  cvUpdatedLabel: string;
}

interface StatCardConfig {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconWrapClass: string;
  iconClass: string;
}

export function DashboardStatCards({
  stats,
  cvCount,
  cvUpdatedLabel,
}: DashboardStatCardsProps) {
  const interviewCount = stats.byStatus.interview ?? 0;
  const appliedCount = stats.byStatus.applied ?? 0;

  const cards: StatCardConfig[] = [
    {
      label: "Applications",
      value: String(stats.total),
      subtext: `+${stats.appliedThisWeek} THIS WEEK`,
      icon: Briefcase,
      iconWrapClass: "bg-feedback-success/15",
      iconClass: "text-feedback-success",
    },
    {
      label: "Interviews",
      value: String(interviewCount),
      subtext:
        stats.pendingInterviews > 0
          ? `${stats.pendingInterviews} SCHEDULED`
          : "NO UPCOMING",
      icon: CalendarDays,
      iconWrapClass: "bg-feedback-info/15",
      iconClass: "text-feedback-info",
    },
    {
      label: "Skill Gap",
      value: String(appliedCount > 0 ? appliedCount : stats.total),
      subtext: "REVIEW PRIORITY",
      icon: Award,
      iconWrapClass: "bg-feedback-error/15",
      iconClass: "text-feedback-error",
    },
    {
      label: "CV Versions",
      value: String(cvCount),
      subtext: cvUpdatedLabel,
      icon: FileText,
      iconWrapClass: "bg-feedback-info/15",
      iconClass: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardSurfaceCard key={card.label} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-3xl font-bold text-content-primary">
                {card.value}
              </p>
              <p className="mt-1 text-sm font-medium text-content-primary">
                {card.label}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-content-muted uppercase">
                {card.subtext}
              </p>
            </div>
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                card.iconWrapClass
              )}
            >
              <card.icon className={cn("size-5", card.iconClass)} aria-hidden />
            </span>
          </div>
        </DashboardSurfaceCard>
      ))}
    </div>
  );
}
