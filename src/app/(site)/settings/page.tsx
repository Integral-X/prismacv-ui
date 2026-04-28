import { getCurrentUser } from '@/modules/user/data/queries';
import { SettingsPageClient } from './settings-page-client';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  return <SettingsPageClient user={user} />;
}
