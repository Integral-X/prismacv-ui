'use client';

import type { UserProfile } from '@/modules/user/data/mappers';

import { PersonalDetailsForm } from './components/personal-details-form';
import { ProfilePhotoCard } from './components/profile-photo-card';
import { SettingsPageHeader } from './components/settings-page-header';

interface PersonalInfoPageClientProps {
  user: UserProfile;
}

export function PersonalInfoPageClient({ user }: PersonalInfoPageClientProps) {
  return (
    <>
      <SettingsPageHeader
        title='Personal Information'
        description='Update your name, contact details and profile photo.'
      />
      <div className='space-y-6'>
        <ProfilePhotoCard user={user} />
        <PersonalDetailsForm user={user} />
      </div>
    </>
  );
}
