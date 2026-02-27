'use client';

import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { OtpForm } from '@/components/pages/auth/OtpForm';

export default function OtpPage() {
  const handleVerify = async () => {
    // TODO: Implement OTP verification API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // router.push('/reset-password');
  };

  return (
    <AuthFormLayout>
      <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
        <h2 className="text-xl font-semibold text-content-primary mb-4">
          Verify your email
        </h2>
        <OtpForm onSubmit={handleVerify} />
      </Card>
    </AuthFormLayout>
  );
}
