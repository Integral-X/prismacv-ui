import { getJobs } from '@/modules/jobs/data/queries';
import { getJobStats } from '@/modules/jobs/data/queries';
import { JobsPageClient } from './jobs-page-client';

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const [jobs, stats] = await Promise.all([getJobs(), getJobStats()]);
  return <JobsPageClient initialJobs={jobs} initialStats={stats} />;
}
