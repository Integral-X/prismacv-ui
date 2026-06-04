'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Info, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/lib/validations/auth';
import { changePasswordAction } from '@/modules/auth/data/actions';

import { SettingsPageHeader } from '../components/settings-page-header';
import { SettingsSectionCard } from '../components/settings-section-card';
import { SettingsToggleRow } from '../components/settings-toggle-row';

interface ChangePasswordClientProps {
  email: string;
}

export function ChangePasswordClient({ email }: ChangePasswordClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmitPassword(data: ChangePasswordFormData) {
    startTransition(async () => {
      const result = await changePasswordAction(data);

      if (result.ok) {
        toast.success(result.message ?? 'Password changed successfully');
        reset();
        router.push(result.redirectTo ?? '/login');
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className='space-y-6'>
      <SettingsPageHeader
        title='Login & Password'
        description='Manage your email address and password.'
      />

      <SettingsSectionCard label='Email address'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='currentEmail'>Current email</Label>
            <Input id='currentEmail' value={email} disabled readOnly />
            <p className='text-sm text-content-muted'>
              We&apos;ll send a confirmation to your new email before changing
              it.
            </p>
          </div>
          <div className='flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <p className='flex items-center gap-1.5 text-xs text-content-muted'>
              <Info className='size-3.5 shrink-0' aria-hidden />
              Email change is coming soon.
            </p>
            <Button type='button' disabled className='sm:shrink-0'>
              Update Email
            </Button>
          </div>
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard label='Password'>
        <form
          onSubmit={handleSubmit(onSubmitPassword)}
          className='space-y-4'
          noValidate
        >
          <div className='space-y-2'>
            <Label htmlFor='currentPassword'>Current password</Label>
            <Input
              id='currentPassword'
              type='password'
              placeholder='Enter current password'
              {...register('currentPassword')}
              aria-invalid={!!errors.currentPassword}
              disabled={isPending}
            />
            {errors.currentPassword ? (
              <p className='text-sm text-destructive' role='alert'>
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='newPassword'>New password</Label>
            <Input
              id='newPassword'
              type='password'
              placeholder='Enter new password'
              {...register('newPassword')}
              aria-invalid={!!errors.newPassword}
              disabled={isPending}
            />
            {errors.newPassword ? (
              <p className='text-sm text-destructive' role='alert'>
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm new password</Label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='Confirm new password'
              {...register('confirmPassword')}
              aria-invalid={!!errors.confirmPassword}
              disabled={isPending}
            />
            {errors.confirmPassword ? (
              <p className='text-sm text-destructive' role='alert'>
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <div className='flex flex-wrap justify-end gap-3 border-t border-subtle pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => reset()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? <Loader2 className='size-4 animate-spin' /> : null}
              Update Password
            </Button>
          </div>
        </form>
      </SettingsSectionCard>

      <CardTwoFactorSection />
    </div>
  );
}

function CardTwoFactorSection() {
  return (
    <SettingsSectionCard label='Two-Factor Authentication'>
      <SettingsToggleRow
        title='Enable 2FA'
        description='Use an authenticator app for extra security'
        checked
        disabled
      />
      <SettingsToggleRow
        title='SMS Backup Code'
        description='Receive a code via text message'
        checked={false}
        disabled
      />
      <p className='mt-4 flex items-center gap-1.5 text-xs text-content-muted'>
        <Info className='size-3.5 shrink-0' aria-hidden />
        Two-factor authentication is coming soon.
      </p>
    </SettingsSectionCard>
  );
}
