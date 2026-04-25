import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { AuthFormLayout } from '@/components/layouts/AuthFormLayout';
import { OtpPageClient } from './otp-page-client';

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <AuthFormLayout>
          <Card className='w-full max-w-[440px] bg-white shadow-card p-8'>
            <p className='text-sm text-content-secondary'>Loading…</p>
          </Card>
        </AuthFormLayout>
      }
    >
      <OtpPageClient />
    </Suspense>
  );
}
