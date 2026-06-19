"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { AuthFormLayout } from "@/components/layouts/AuthFormLayout";
import { ResetPasswordForm } from "@/components/pages/auth/ResetPasswordForm";
import type { ResetPasswordFormData } from "@/lib/validations/auth";
import { resetPasswordAction } from "@/modules/auth/data/actions";

export function ResetPasswordPageClient() {
  const router = useRouter();
  const handleReset = async (data: ResetPasswordFormData) => {
    const result = await resetPasswordAction({
      confirmPassword: data.confirmPassword,
      newPassword: data.password,
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
      <Card className="w-full max-w-[440px] bg-surface-card shadow-card p-8">
        <h2 className="text-xl font-semibold text-content-primary mb-4">
          Create new password
        </h2>
        <ResetPasswordForm onSubmit={handleReset} />
      </Card>
    </AuthFormLayout>
  );
}
