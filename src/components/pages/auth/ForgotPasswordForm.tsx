"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

interface ForgotPasswordFormProps {
  className?: string;
  errorMessage?: string;
  onSubmit?: (data: ForgotPasswordFormData) => void | Promise<void>;
}

export const ForgotPasswordForm = ({
  className,
  errorMessage,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(
      forgotPasswordSchema
    ) as Resolver<ForgotPasswordFormData>,
    defaultValues: { email: "" },
  });

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await onSubmit?.(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className={cn("flex flex-col gap-5", className)}
    >
      <p className="text-sm text-content-secondary">
        We will send you a secure email with a link to change your password.
      </p>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-content-primary"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          aria-invalid={!!form.formState.errors.email}
          disabled={isLoading}
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-feedback-error" role="alert">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/85 text-primary-foreground font-medium text-base"
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>

      {errorMessage ? (
        <p className="text-sm text-feedback-error text-center" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
};
