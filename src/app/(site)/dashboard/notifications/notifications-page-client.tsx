"use client";

import { useRouter } from "next/navigation";

import type { NavbarUser } from "@/components/common/navbar-client";
import { NotificationsPanel } from "@/components/common/notifications-panel";

import { DashboardHeader } from "../components/dashboard-header";

interface NotificationsPageClientProps {
  user: NavbarUser | null;
}

export function NotificationsPageClient({
  user,
}: NotificationsPageClientProps) {
  const router = useRouter();
  const navbarUser: NavbarUser = user ?? {
    email: "guest@prismacv.app",
    name: "Guest",
  };

  return (
    <>
      <DashboardHeader user={navbarUser} />
      <div className="flex-1 overflow-y-auto bg-surface-page px-4 py-8 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <NotificationsPanel
            variant="page"
            onClose={() => router.push("/dashboard")}
          />
        </div>
      </div>
    </>
  );
}
