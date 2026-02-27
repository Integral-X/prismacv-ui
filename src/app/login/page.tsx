'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { LoginForm } from '@/components/pages/login/LoginForm';
import { SocialAuthButtons } from '@/components/pages/login/SocialAuthButtons';

export default function LoginPage() {
  const handleLogin = async () => {
    // TODO: Implement actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // router.push('/dashboard');
  };

  return (
    <AuthFormLayout>
      <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
        <h2 className="text-xl text-center font-semibold text-content-primary mb-4">
          Sign in your account
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

        <LoginForm onSubmit={handleLogin} />
      </Card>
    </AuthFormLayout>
  );
}
