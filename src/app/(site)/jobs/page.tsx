import { getCurrentUser } from "@/modules/auth/data/queries";
import { getUserCvs } from "@/modules/cv/data/queries";
import { getJobs } from "@/modules/jobs/data/queries";

import { JobsPageClient } from "./jobs-page-client";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const [jobs, cvList, user] = await Promise.all([
    getJobs(),
    getUserCvs(),
    getCurrentUser(),
  ]);

  return (
    <JobsPageClient
      initialJobs={jobs}
      initialCvs={cvList.items}
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
