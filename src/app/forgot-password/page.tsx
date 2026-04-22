"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { AuthFormLayout } from "@/components/layouts/AuthFormLayout";
import { ForgotPasswordForm } from "@/components/pages/auth/ForgotPasswordForm";
import type { ForgotPasswordFormData } from "@/lib/validations/auth";
import { forgotPasswordAction } from "@/modules/auth/data/actions";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    const result = await forgotPasswordAction({
      email: data.email,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    router.push(
      result.redirectTo ??
        `/otp?mode=reset&email=${encodeURIComponent(data.email)}`
    );
  };

  return (
    <AuthFormLayout>
      <Card className="w-full max-w-[440px] bg-white shadow-card p-8">
        <h2 className="text-xl font-semibold text-content-primary mb-4">
          Restore your password
        </h2>
        <ForgotPasswordForm onSubmit={handleSubmit} />
      </Card>
    </AuthFormLayout>
  );
}
