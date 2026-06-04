import { getCurrentUser } from '@/modules/auth/data/queries';
import { getUserCvs } from '@/modules/cv/data/queries';

import { DocumentsPageClient } from './documents-page-client';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const [cvList, user] = await Promise.all([getUserCvs(), getCurrentUser()]);

  return (
    <DocumentsPageClient
      initialCvs={cvList.items}
      user={
        user
          ? {
              email: user.email,
              name: user.name,
              isAdmin: user.role === 'admin',
            }
          : null
      }
    />
  );
}
