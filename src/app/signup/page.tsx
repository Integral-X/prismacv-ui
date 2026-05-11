'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { SignupForm } from '@/components/pages/signup/SignupForm';
import { SocialAuthButtons } from '@/components/pages/login/SocialAuthButtons';
import type { SignupFormData } from '@/lib/validations/auth';
import { signupUserAction } from '@/modules/auth/data/actions';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: SignupFormData) => {
    try {
      const result = await signupUserAction({
        email: data.email,
        name: `${data.firstName} ${data.lastName}`.trim(),
        password: data.password,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      router.push(
        result.redirectTo ??
          `/otp?mode=signup&email=${encodeURIComponent(data.email)}`
      );
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthFormLayout>
      <Card className='w-full max-w-[440px] bg-surface-card shadow-card p-8'>
        <h2 className='text-xl font-semibold text-content-primary mb-4'>
          Create an account
        </h2>

        <div className='mb-2'>
          <SocialAuthButtons />
        </div>

        <div className='relative mb-2'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-border-subtle' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-4 bg-surface-card text-content-tertiary'>
              Or
            </span>
          </div>
        </div>

        <SignupForm onSubmit={handleSignup} />
      </Card>
    </AuthFormLayout>
  );
}
