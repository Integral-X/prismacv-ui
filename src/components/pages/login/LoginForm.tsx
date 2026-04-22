"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  className?: string;
  errorMessage?: string;
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
}

export const LoginForm = ({
  className,
  errorMessage,
  onSubmit,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const rememberMe = watch("rememberMe");

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual login API call
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
      className={cn("flex flex-col gap-6", className)}
    >
      {/* Email Field */}
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

      {/* Password Field */}
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) =>
              setValue("rememberMe", checked as boolean)
            }
            disabled={isLoading}
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-content-secondary cursor-pointer select-none"
          >
            Remember me
          </label>
        </div>

        <Link
          href="/forgot-password"
          className="text-sm text-interactive-link hover:text-interactive-link-hover transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#069EA8] hover:bg-[#058a93] text-white font-medium text-base"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      {errorMessage ? (
        <p className="text-sm text-feedback-error text-center" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {/* Sign Up Link */}
      <p className="text-center text-sm text-content-secondary">
        First time here?{" "}
        <Link
          href="/signup"
          className="text-interactive-link hover:text-interactive-link-hover font-medium transition-colors"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
};
