import { getUserCvs } from '@/modules/cv/data/queries';
import { DashboardPageClient } from './dashboard-page-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cvList = await getUserCvs();
  return <DashboardPageClient initialData={cvList} />;
}
