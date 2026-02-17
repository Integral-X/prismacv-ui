'use client';

import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { SignupForm } from '@/components/pages/signup/SignupForm';
import { SocialAuthButtons } from '@/components/pages/login/SocialAuthButtons';

export default function SignupPage() {
  const handleSignup = async () => {
    // TODO: Implement actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // router.push('/login');
  };

  return (
    <AuthFormLayout>
      <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
        <h2 className="text-xl font-semibold text-content-primary mb-4">
          Create an account
        </h2>

        <div className="mb-2">
          <SocialAuthButtons />
        </div>

        <div className="relative mb-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-content-tertiary">Or</span>
          </div>
        </div>

        <SignupForm onSubmit={handleSignup} />
      </Card>
    </AuthFormLayout>
  );
}
