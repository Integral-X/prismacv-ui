'use client';

import * as React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

interface ResetPasswordFormProps {
  className?: string;
  errorMessage?: string;
  onSubmit?: (data: ResetPasswordFormData) => void | Promise<void>;
}

export const ResetPasswordForm = ({
  className,
  errorMessage,
  onSubmit,
}: ResetPasswordFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(
      resetPasswordSchema
    ) as Resolver<ResetPasswordFormData>,
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
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
      className={cn('flex flex-col gap-5', className)}
    >
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='password'
          className='text-sm font-medium text-content-primary'
        >
          New password
        </label>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            aria-invalid={!!form.formState.errors.password}
            disabled={isLoading}
            {...form.register('password')}
            className='pr-10'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition-colors'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className='w-5 h-5' />
            ) : (
              <Eye className='w-5 h-5' />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className='text-sm text-feedback-error' role='alert'>
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='confirmPassword'
          className='text-sm font-medium text-content-primary'
        >
          Confirm password
        </label>
        <div className='relative'>
          <Input
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            aria-invalid={!!form.formState.errors.confirmPassword}
            disabled={isLoading}
            {...form.register('confirmPassword')}
            className='pr-10'
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition-colors'
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className='w-5 h-5' />
            ) : (
              <Eye className='w-5 h-5' />
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className='text-sm text-feedback-error' role='alert'>
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type='submit'
        disabled={isLoading}
        className='w-full h-12 bg-primary hover:bg-primary/85 text-primary-foreground font-medium text-base'
      >
        {isLoading ? 'Resetting...' : 'Reset password'}
      </Button>

      {errorMessage ? (
        <p className='text-sm text-feedback-error text-center' role='alert'>
          {errorMessage}
        </p>
      ) : null}

      <p className='text-center text-sm text-content-secondary'>
        <Link
          href='/login'
          className='text-interactive-link hover:text-interactive-link-hover font-medium transition-colors'
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
