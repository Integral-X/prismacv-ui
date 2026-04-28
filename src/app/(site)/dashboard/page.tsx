import { getUserCvs } from '@/modules/cv/data/queries';
import { DashboardPageClient } from './dashboard-page-client';

export default async function DashboardPage() {
  const cvList = await getUserCvs();
  return <DashboardPageClient initialData={cvList} />;
}
