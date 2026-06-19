import { getUserCvs } from "@/modules/cv/data/queries";
import { getJobs, getJobStats } from "@/modules/jobs/data/queries";
import { getCurrentUser } from "@/modules/auth/data/queries";

import { DashboardPageClient } from "./dashboard-page-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [cvList, jobs, stats, user] = await Promise.all([
    getUserCvs(),
    getJobs(),
    getJobStats(),
    getCurrentUser(),
  ]);

  return (
    <DashboardPageClient
      initialCvs={cvList.items}
      initialJobs={jobs}
      initialStats={stats}
      user={
        user
          ? {
              email: user.email,
              name: user.name,
              isAdmin: user.role === "admin",
            }
          : null
      }
    />
  );
}
