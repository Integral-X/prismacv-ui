"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  className?: string;
  errorMessage?: string;
  onSubmit?: (data: SignupFormData) => void | Promise<void>;
}

export const SignupForm = ({
  className,
  errorMessage,
  onSubmit,
}: SignupFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema) as Resolver<SignupFormData>,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      marketingEmails: false,
    },
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const termsAccepted = watch("termsAccepted");
  const marketingEmails = watch("marketingEmails");

  const handleFormSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      await onSubmit?.(data);
    } catch (error) {
      // Error handling - TODO: Add toast notification
      void error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-content-primary"
          >
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder="Jon"
            aria-invalid={!!errors.firstName}
            disabled={isLoading}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-feedback-error" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-content-primary"
          >
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            placeholder="jon"
            aria-invalid={!!errors.lastName}
            disabled={isLoading}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-feedback-error" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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
          aria-invalid={!!errors.email}
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-feedback-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-content-primary"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            disabled={isLoading}
            {...register("password")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-feedback-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-content-primary"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter your password"
            aria-invalid={!!errors.confirmPassword}
            disabled={isLoading}
            {...register("confirmPassword")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-feedback-error" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="termsAccepted"
          checked={!!termsAccepted}
          onCheckedChange={(checked) =>
            setValue("termsAccepted", checked === true)
          }
          disabled={isLoading}
        />
        <label
          htmlFor="termsAccepted"
          className="text-sm text-content-secondary cursor-pointer select-none leading-tight"
        >
          I agree to the{" "}
          <Link href="/terms" className="text-interactive-link hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-interactive-link hover:underline"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.termsAccepted && (
        <p className="text-sm text-feedback-error -mt-2" role="alert">
          {errors.termsAccepted.message}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="marketingEmails"
          checked={!!marketingEmails}
          onCheckedChange={(checked) =>
            setValue("marketingEmails", checked === true)
          }
          disabled={isLoading}
        />
        <label
          htmlFor="marketingEmails"
          className="text-sm text-content-secondary cursor-pointer select-none"
        >
          Email me tailored resume advice & updates from Prisma CV
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#069EA8] hover:bg-[#058a93] text-white font-medium text-base uppercase tracking-wide"
      >
        {isLoading ? "Creating account..." : "Create an account"}
      </Button>

      {errorMessage ? (
        <p className="text-sm text-feedback-error text-center" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <p className="text-center text-sm text-content-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-interactive-link hover:text-interactive-link-hover font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};
