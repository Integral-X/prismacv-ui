'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/lib/validations/auth';
import { changePasswordAction } from '@/modules/auth/data/actions';

export function ChangePasswordClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: ChangePasswordFormData) {
    startTransition(async () => {
      const result = await changePasswordAction(data);

      if (result.ok) {
        toast.success(result.message ?? 'Password changed successfully');
        router.push('/settings');
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <main className='mx-auto max-w-2xl px-4 py-10'>
      <Button
        variant='ghost'
        className='mb-6'
        onClick={() => router.push('/settings')}
      >
        <ArrowLeft className='size-4' />
        Back to settings
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <KeyRound className='size-5' />
            Change password
          </CardTitle>
          <CardDescription>
            Enter your current password and choose a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='currentPassword' className='text-sm font-medium'>
                Current password
              </label>
              <Input
                id='currentPassword'
                type='password'
                placeholder='Enter current password'
                {...register('currentPassword')}
                aria-invalid={!!errors.currentPassword}
              />
              {errors.currentPassword && (
                <p className='text-destructive text-sm'>
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='newPassword' className='text-sm font-medium'>
                New password
              </label>
              <Input
                id='newPassword'
                type='password'
                placeholder='Enter new password'
                {...register('newPassword')}
                aria-invalid={!!errors.newPassword}
              />
              {errors.newPassword && (
                <p className='text-destructive text-sm'>
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='confirmPassword' className='text-sm font-medium'>
                Confirm new password
              </label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirm new password'
                {...register('confirmPassword')}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className='text-destructive text-sm'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className='size-4 animate-spin' />}
              Change password
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
