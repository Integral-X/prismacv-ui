'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { persistOAuthSessionAction } from '@/modules/auth/data/actions';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const processedRef = React.useRef(false);

  React.useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    async function handleCallback() {
      try {
        const hash = window.location.hash;
        const tokenParam = hash
          .slice(1)
          .split('&')
          .find((p) => p.startsWith('token='));

        if (!tokenParam) {
          router.replace('/login?error=oauth_failed');
          return;
        }

        const base64 = tokenParam.slice('token='.length);
        const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload: unknown = JSON.parse(json);

        if (
          typeof payload !== 'object' ||
          payload === null ||
          !('accessToken' in payload) ||
          !('refreshToken' in payload) ||
          !('user' in payload)
        ) {
          router.replace('/login?error=oauth_failed');
          return;
        }

        const { accessToken, refreshToken, user } = payload as {
          accessToken: string;
          refreshToken: string;
          user: unknown;
        };

        const result = await persistOAuthSessionAction({
          accessToken,
          refreshToken,
          user,
        });

        if (result.ok) {
          router.replace(result.redirectTo ?? '/dashboard');
        } else {
          router.replace('/login?error=oauth_failed');
        }
      } catch {
        router.replace('/login?error=oauth_failed');
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-8 w-8 animate-spin text-content-secondary' />
        <p className='text-sm text-content-secondary'>Completing sign in...</p>
      </div>
    </div>
  );
}
