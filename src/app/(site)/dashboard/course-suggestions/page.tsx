import { getCurrentUser } from '@/modules/auth/data/queries';

import { CourseSuggestionsPageClient } from './course-suggestions-page-client';

export const dynamic = 'force-dynamic';

export default async function CourseSuggestionsPage() {
  const user = await getCurrentUser();

  return (
    <CourseSuggestionsPageClient
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
