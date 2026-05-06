'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { LoginForm } from '@/components/pages/login/LoginForm';
import { SocialAuthButtons } from '@/components/pages/login/SocialAuthButtons';
import type { LoginFormData } from '@/lib/validations/auth';
import { loginUserAction } from '@/modules/auth/data/actions';

function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const error = searchParams.get('error');
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (toastShownRef.current) return;
    if (redirectTo && !error) {
      toastShownRef.current = true;
      toast.info('Please sign in to continue.');
    }
    if (error === 'oauth_failed') {
      toastShownRef.current = true;
      toast.error('OAuth sign-in failed. Please try again.');
    }
  }, [redirectTo, error]);

  const handleLogin = async (data: LoginFormData) => {
    const result = await loginUserAction({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (!result.ok) {
      if (result.code === 'email_not_verified' && result.email) {
        router.push(
          `/otp?mode=signup&email=${encodeURIComponent(result.email)}`
        );
        return;
      }

      toast.error(result.message);
      return;
    }

    // Redirect to the originally requested page or default
    // Prevent open redirect: must start with single slash and not be protocol-relative
    const isSafePath = redirectTo &&
      redirectTo.startsWith('/') &&
      !redirectTo.startsWith('//') &&
      !redirectTo.startsWith('/\\');
    const destination = isSafePath
      ? redirectTo
      : (result.redirectTo ?? '/dashboard');
    router.push(destination);
  };

  return (
    <AuthFormLayout>
      <Card className='w-full max-w-[440px] bg-white shadow-card p-8'>
        <h2 className='text-xl text-center font-semibold text-content-primary mb-4'>
          Sign in your account
        </h2>

        <div className='mb-2'>
          <SocialAuthButtons />
        </div>

        <div className='relative mb-2'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-border-subtle' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-4 bg-white text-content-tertiary'>Or</span>
          </div>
        </div>

        <LoginForm onSubmit={handleLogin} />
      </Card>
    </AuthFormLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageClient />
    </Suspense>
  );
}
