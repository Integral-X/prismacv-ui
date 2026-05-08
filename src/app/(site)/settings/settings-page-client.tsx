'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { KeyRound, Loader2, LogIn, Trash2, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/modules/user/data/mappers';
import type { BillingProfile } from '@/modules/billing/data/mappers';
import { updateProfileAction } from '@/modules/user/data/actions';
import { deleteAccountAction } from '@/modules/user/data/actions';

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
}

function ProviderBadge({ provider }: { provider: string }) {
  const label = provider.charAt(0).toUpperCase() + provider.slice(1);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full',
        'bg-secondary px-3 py-1 text-sm font-medium',
        'text-secondary-foreground'
      )}
    >
      <LogIn className='size-3.5' />
      {label}
    </span>
  );
}

interface SettingsPageClientProps {
  user: UserProfile;
  billing: BillingProfile;
}

export function SettingsPageClient({ user, billing }: SettingsPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  });

  function onSubmitProfile(data: ProfileFormData) {
    startTransition(async () => {
      const result = await updateProfileAction({
        name: data.name || undefined,
      });

      if (result.ok) {
        toast.success(result.message ?? 'Profile updated');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function onDeleteAccount() {
    startTransition(async () => {
      const result = await deleteAccountAction();

      if (result.ok && result.redirectTo) {
        toast.success('Account deleted');
        router.push(result.redirectTo);
      } else if (!result.ok) {
        toast.error(result.message);
        setShowDeleteConfirm(false);
      }
    });
  }

  return (
    <main className='mx-auto max-w-2xl px-4 py-10'>
      <h1 className='mb-8 text-2xl font-bold'>Settings</h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Plan & usage</CardTitle>
          <CardDescription>
            Current plan:{' '}
            <span className='font-medium uppercase'>{billing.plan}</span> - AI
            quota {billing.aiQuota.used}/{billing.aiQuota.limit}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant='outline' asChild>
            <Link href='/settings/billing'>Manage billing</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Profile Section */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='size-5' />
            Profile
          </CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex items-center gap-4'>
            <Avatar className='size-16'>
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name ?? 'Avatar'} />
              )}
              <AvatarFallback className='text-lg'>
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='font-medium'>{user.name ?? 'No name set'}</p>
              <p className='text-muted-foreground text-sm'>{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitProfile)} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='name' className='text-sm font-medium'>
                Display name
              </label>
              <Input
                id='name'
                placeholder='Your name'
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className='text-destructive text-sm'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input id='email' value={user.email} disabled readOnly />
              <p className='text-muted-foreground text-xs'>
                Email cannot be changed
              </p>
            </div>

            <Button type='submit' disabled={isPending || !isDirty}>
              {isPending && <Loader2 className='size-4 animate-spin' />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <KeyRound className='size-5' />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant='outline'
            onClick={() => router.push('/settings/change-password')}
          >
            Change password
          </Button>
        </CardContent>
      </Card>

      {/* Connected Accounts Section */}
      {user.provider && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <LogIn className='size-5' />
              Connected accounts
            </CardTitle>
            <CardDescription>
              External accounts linked to your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderBadge provider={user.provider} />
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className='border-destructive/50'>
        <CardHeader>
          <CardTitle className='text-destructive flex items-center gap-2'>
            <Trash2 className='size-5' />
            Danger zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardFooter>
          {!showDeleteConfirm ? (
            <Button
              variant='destructive'
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete account
            </Button>
          ) : (
            <div className='flex items-center gap-3'>
              <p className='text-sm'>Are you sure? This cannot be undone.</p>
              <Button
                variant='destructive'
                disabled={isPending}
                onClick={onDeleteAccount}
              >
                {isPending && <Loader2 className='size-4 animate-spin' />}
                Yes, delete
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
