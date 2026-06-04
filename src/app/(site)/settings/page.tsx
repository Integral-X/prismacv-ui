import { getCurrentUser } from '@/modules/user/data/queries';

import { PersonalInfoPageClient } from './personal-info-page-client';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  return <PersonalInfoPageClient user={user} />;
}
