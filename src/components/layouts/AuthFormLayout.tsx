"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { WavyPattern } from "@/components/common/WavyPattern";

interface AuthFormLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for auth pages (login, signup, forgot password, reset password, OTP).
 * Renders: header (logo) + centered content area (children) + wavy footer.
 */
export const AuthFormLayout = ({ children }: AuthFormLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] overflow-hidden">
      {/* Header - Logo only */}
      <header className="w-full">
        <div className="container h-14 flex items-center px-4">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="PrismaCV"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main - Centered form content (children) */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Wavy Pattern Footer */}
      <div className="mt-auto w-full">
        <WavyPattern height={200} />
      </div>
    </div>
  );
};
