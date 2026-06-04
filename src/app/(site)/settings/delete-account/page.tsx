import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/modules/auth/data/queries';

import { DeleteAccountPageClient } from './delete-account-page-client';

export default async function DeleteAccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <DeleteAccountPageClient email={user.email} />;
}
