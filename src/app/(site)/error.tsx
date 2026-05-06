'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Site error:', error); // eslint-disable-line no-console
  }, [error]);

  return (
    <div className='flex-1 flex items-center justify-center px-4 py-16' role='alert' aria-live='assertive'>
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
