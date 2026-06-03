'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { deleteAccountAction } from '@/modules/user/data/actions';

import { SettingsPageHeader } from '../components/settings-page-header';

interface DeleteAccountPageClientProps {
  email: string;
}

export function DeleteAccountPageClient({
  email,
}: DeleteAccountPageClientProps) {
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  const emailMatches =
    confirmEmail.trim().toLowerCase() === email.trim().toLowerCase();

  function onDeleteAccount() {
    if (!emailMatches) {
      toast.error('Email does not match your account.');
      return;
    }

    startTransition(async () => {
      const result = await deleteAccountAction();

      if (result.ok) {
        toast.success('Account deleted');
        window.location.href = '/';
        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <>
      <SettingsPageHeader
        title='Delete Account'
        description='Permanently remove your account and all associated data.'
      />

      <Card className='border-subtle shadow-card'>
        <CardContent className='space-y-6 p-6'>
          <div className='flex items-start gap-3 text-destructive'>
            <AlertTriangle className='mt-0.5 size-5 shrink-0' aria-hidden />
            <div>
              <p className='font-semibold'>This action is irreversible</p>
              <p className='mt-1 text-sm text-content-secondary'>
                Deleting your account will permanently erase all your documents,
                job applications, settings, and billing history. This cannot be
                undone.
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmEmail'>Type your email to confirm</Label>
            <Input
              id='confirmEmail'
              type='email'
              placeholder={email}
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
              aria-invalid={confirmEmail.length > 0 && !emailMatches}
              disabled={isPending}
              autoComplete='off'
            />
          </div>

          <Button
            type='button'
            variant='outline'
            className='w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto'
            disabled={isPending || !emailMatches}
            onClick={onDeleteAccount}
          >
            {isPending ? <Loader2 className='size-4 animate-spin' /> : null}
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
