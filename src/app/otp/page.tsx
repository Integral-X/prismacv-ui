"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { AuthFormLayout } from "@/components/layouts/AuthFormLayout";
import { OtpForm } from "@/components/pages/auth/OtpForm";
import type { OtpFormData } from "@/lib/validations/auth";
import { resendOtpAction, verifyOtpAction } from "@/modules/auth/data/actions";

function OtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const mode = searchParams.get("mode") === "reset" ? "reset" : "signup";

  const handleVerify = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Missing email address for verification.");
      return;
    }

    const result = await verifyOtpAction({
      email,
      mode,
      otp: data.code,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    if (result.message) {
      toast.success(result.message);
    }

    router.push(
      result.redirectTo ??
        (mode === "reset" ? "/reset-password" : "/onboarding")
    );
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email address for verification.");
      return;
    }

    const result = await resendOtpAction({
      email,
      mode,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message ?? "A new code has been sent.");
  };

  return (
    <AuthFormLayout>
      <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
        <h2 className="text-xl font-semibold text-content-primary mb-4">
          {mode === "reset" ? "Verify reset code" : "Verify your email"}
        </h2>
        <OtpForm onResend={handleResend} onSubmit={handleVerify} />
      </Card>
    </AuthFormLayout>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <AuthFormLayout>
          <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
            <p className="text-sm text-content-secondary">Loading…</p>
          </Card>
        </AuthFormLayout>
      }
    >
      <OtpPageContent />
    </Suspense>
  );
}
