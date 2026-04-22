"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { AuthFormLayout } from "@/components/layouts/AuthFormLayout";
import { ResetPasswordForm } from "@/components/pages/auth/ResetPasswordForm";
import type { ResetPasswordFormData } from "@/lib/validations/auth";
import { resetPasswordAction } from "@/modules/auth/data/actions";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") ?? "";

  const handleReset = async (data: ResetPasswordFormData) => {
    if (!resetToken) {
      toast.error("Missing or invalid password reset token.");
      return;
    }

    const result = await resetPasswordAction({
      confirmPassword: data.confirmPassword,
      newPassword: data.password,
      resetToken,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    if (result.message) {
      toast.success(result.message);
    }

    router.push(result.redirectTo ?? "/login");
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

export default function ResetPasswordPage() {
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
      <ResetPasswordPageContent />
    </Suspense>
  );
}
