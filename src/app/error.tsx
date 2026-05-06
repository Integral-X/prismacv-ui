'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error); // eslint-disable-line no-console
  }, [error]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-surface-primary px-4' role='alert' aria-live='assertive'>
      <div className='text-center max-w-md'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-feedback-error/10'>
          <AlertTriangle className='h-8 w-8 text-feedback-error' />
        </div>
        <h1 className='text-2xl font-semibold text-content-primary mb-2'>
          Something went wrong
        </h1>
        <p className='text-content-secondary mb-6'>
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} variant='default'>
          Try again
        </Button>
      </div>
    </div>
  );
}
