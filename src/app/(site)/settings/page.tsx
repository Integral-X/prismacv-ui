import { getCurrentUser } from '@/modules/user/data/queries';
import { getBillingProfile } from '@/modules/billing/data/queries';
import { SettingsPageClient } from './settings-page-client';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const [user, billing] = await Promise.all([
    getCurrentUser(),
    getBillingProfile(),
  ]);
  return <SettingsPageClient user={user} billing={billing} />;
}
