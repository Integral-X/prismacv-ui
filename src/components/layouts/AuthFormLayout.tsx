'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WavyPattern } from '@/components/common/WavyPattern';

interface AuthFormLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for auth pages (login, signup, forgot password, reset password, OTP).
 * Renders: header (logo) + centered content area (children) + wavy footer.
 */
export const AuthFormLayout = ({ children }: AuthFormLayoutProps) => {
  return (
    <div className='relative flex min-h-screen flex-col overflow-hidden bg-surface-page'>
      {/* Header - Logo only */}
      <header className='relative z-10 w-full'>
        <div className='container flex h-14 items-center px-4'>
          <Link
            href='/'
            className='flex items-center transition-opacity hover:opacity-90'
          >
            <Image
              src='/logo.svg'
              alt='PrismaCV'
              width={120}
              height={32}
              className='h-8 w-auto'
            />
          </Link>
        </div>
      </header>

      {/* Main - Centered form content (children) */}
      <main className='relative z-10 flex flex-1 items-center justify-center px-4 py-8'>
        {children}
      </main>

      {/* Wavy Pattern Footer */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0'>
        <WavyPattern height={200} />
      </div>
    </div>
  );
};
