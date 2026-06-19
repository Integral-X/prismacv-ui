"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { otpSchema, type OtpFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

interface OtpFormProps {
  className?: string;
  errorMessage?: string;
  statusMessage?: string;
  onResend?: () => void | Promise<void>;
  onSubmit?: (data: OtpFormData) => void | Promise<void>;
}

export const OtpForm = ({
  className,
  errorMessage,
  statusMessage,
  onResend,
  onSubmit,
}: OtpFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema) as Resolver<OtpFormData>,
    defaultValues: { code: "" },
  });

  const handleFormSubmit = async (data: OtpFormData) => {
    try {
      setIsLoading(true);
      await onSubmit?.(data);
    } catch (error) {
      void error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!onResend) return;

    try {
      setIsResending(true);
      await onResend();
    } catch (error) {
      void error;
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className={cn("flex flex-col gap-5", className)}
    >
      <p className="text-sm text-content-secondary">
        We sent a 6-digit code to your email. Enter it below.
      </p>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="code"
          className="text-sm font-medium text-content-primary"
        >
          Verification code
        </label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          aria-invalid={!!form.formState.errors.code}
          disabled={isLoading}
          {...form.register("code")}
        />
        {form.formState.errors.code && (
          <p className="text-sm text-feedback-error" role="alert">
            {form.formState.errors.code.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/85 text-primary-foreground font-medium text-base"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>

      {errorMessage ? (
        <p className="text-sm text-feedback-error text-center" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {statusMessage ? (
        <p className="text-sm text-content-secondary text-center" role="status">
          {statusMessage}
        </p>
      ) : null}

      <p className="text-center text-sm text-content-secondary">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          disabled={!onResend || isResending}
          onClick={handleResend}
          className="text-interactive-link hover:text-interactive-link-hover font-medium transition-colors"
        >
          {isResending ? "Resending..." : "Resend"}
        </button>
      </p>

      <p className="text-center text-sm text-content-secondary">
        <Link
          href="/login"
          className="text-interactive-link hover:text-interactive-link-hover font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
