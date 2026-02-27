'use client';

import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { ResetPasswordForm } from '@/components/pages/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  const handleReset = async () => {
    // TODO: Implement API (use token from URL/query)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // router.push('/login');
  };

  return (
    <AuthFormLayout>
      <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
        <h2 className="text-xl font-semibold text-content-primary mb-4">
          Create new password
        </h2>
        <ResetPasswordForm onSubmit={handleReset} />
      </Card>
    </AuthFormLayout>
  );
}
