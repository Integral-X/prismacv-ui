'use client';

import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { ForgotPasswordForm } from '@/components/pages/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const handleSubmit = async () => {
    // TODO: Implement API - send reset email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // router.push('/otp');
  };

  return (
    <AuthFormLayout>
      <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
        <h2 className="text-xl font-semibold text-content-primary mb-4">
          Restore your password
        </h2>
        <ForgotPasswordForm onSubmit={handleSubmit} />
      </Card>
    </AuthFormLayout>
  );
}
