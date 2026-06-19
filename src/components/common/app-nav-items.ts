import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  FileStack,
  LayoutDashboard,
  Map,
  ScanSearch,
  Shield,
} from "lucide-react";

export interface AppNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPrefix?: boolean;
}

/** Sidebar navigation aligned with the dashboard mockup. */
export const dashboardNavItems: AppNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    matchPrefix: false,
  },
  {
    href: "/dashboard/documents",
    label: "My Document",
    icon: FileStack,
    matchPrefix: true,
  },
  {
    href: "/jobs",
    label: "Job Tracker",
    icon: Briefcase,
    matchPrefix: true,
  },
  {
    href: "/skills",
    label: "Skill Gap analysis",
    icon: BarChart3,
    matchPrefix: true,
  },
  {
    href: "/ats-scorer",
    label: "Resume Scanner",
    icon: ScanSearch,
    matchPrefix: true,
  },
  {
    href: "/skills/roadmap",
    label: "Roadmap",
    icon: Map,
    matchPrefix: true,
  },
  {
    href: "/dashboard/course-suggestions",
    label: "Course Suggestions",
    icon: BookOpen,
    matchPrefix: true,
  },
];

export const appNavAdminItem: AppNavItem = {
  href: "/admin",
  label: "Admin",
  icon: Shield,
  matchPrefix: true,
};

export function isAppNavActive(pathname: string, item: AppNavItem): boolean {
  if (item.matchPrefix === false) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
