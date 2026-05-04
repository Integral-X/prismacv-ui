'use server';

import { redirect } from 'next/navigation';

import { HttpError } from '@/shared/http/http-error';
import {
  changePassword,
  forgotPassword,
  loginUser,
  resendSignupOtp,
  resetPassword,
  signupUser,
  verifyResetOtp,
  verifySignupOtp,
} from './mutations';
import { toUserProfile } from './mappers';
import type { UserLoginContract } from './contracts';
import { clearAuthSession, persistAuthSession } from './session';

export type AuthActionCode =
  | 'conflict'
  | 'email_not_verified'
  | 'invalid_credentials'
  | 'rate_limited'
  | 'unauthorized'
  | 'unknown';

export interface ActionSuccessResult {
  ok: true;
  message?: string;
  redirectTo?: string;
}

export interface ActionFailureResult {
  ok: false;
  code: AuthActionCode;
  email?: string;
  message: string;
}

export type ActionResult = ActionSuccessResult | ActionFailureResult;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    return error.serverMessage ?? error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function toFailureResult(
  error: unknown,
  fallbackMessage: string,
  options: {
    email?: string;
    unauthorizedCode?: Extract<
      AuthActionCode,
      'email_not_verified' | 'invalid_credentials' | 'unauthorized'
    >;
  } = {}
): ActionFailureResult {
  if (error instanceof HttpError) {
    const message = getErrorMessage(error, fallbackMessage);

    if (error.isConflict) {
      return { ok: false, code: 'conflict', email: options.email, message };
    }

    if (error.isTooManyRequests) {
      return { ok: false, code: 'rate_limited', email: options.email, message };
    }

    if (error.isUnauthorized) {
      return {
        ok: false,
        code: options.unauthorizedCode ?? 'unauthorized',
        email: options.email,
        message,
      };
    }
  }

  return {
    ok: false,
    code: 'unknown',
    email: options.email,
    message: getErrorMessage(error, fallbackMessage),
  };
}

export async function loginUserAction(input: {
  email: string;
  password: string;
  rememberMe: boolean;
}): Promise<ActionResult> {
  try {
    const result = await loginUser({
      email: input.email,
      password: input.password,
    });

    await persistAuthSession(result, input.rememberMe);

    return {
      ok: true,
      redirectTo: '/dashboard',
    };
  } catch (error) {
    const message = getErrorMessage(
      error,
      'Unable to sign you in right now. Please try again.'
    );

    if (message.toLowerCase().includes('not verified')) {
      return {
        ok: false,
        code: 'email_not_verified',
        email: input.email,
        message,
      };
    }

    return toFailureResult(error, 'Unable to sign you in right now.', {
      unauthorizedCode: 'invalid_credentials',
    });
  }
}

export async function signupUserAction(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<ActionResult> {
  try {
    await signupUser(input);

    return {
      ok: true,
      redirectTo: `/otp?mode=signup&email=${encodeURIComponent(input.email)}`,
    };
  } catch (error) {
    return toFailureResult(error, 'Unable to create your account right now.', {
      email: input.email,
    });
  }
}

export async function verifyOtpAction(input: {
  email: string;
  otp: string;
  mode: 'reset' | 'signup';
}): Promise<ActionResult> {
  try {
    if (input.mode === 'signup') {
      const result = await verifySignupOtp({
        email: input.email,
        otp: input.otp,
      });

      await persistAuthSession(result);

      return {
        ok: true,
        message: result.message,
        redirectTo: '/dashboard',
      };
    }

    const result = await verifyResetOtp({
      email: input.email,
      otp: input.otp,
    });

    return {
      ok: true,
      redirectTo: `/reset-password?token=${encodeURIComponent(
        result.resetToken
      )}`,
    };
  } catch (error) {
    return toFailureResult(error, 'Unable to verify the code right now.', {
      email: input.email,
    });
  }
}

export async function resendOtpAction(input: {
  email: string;
  mode: 'reset' | 'signup';
}): Promise<ActionResult> {
  try {
    if (input.mode === 'signup') {
      const result = await resendSignupOtp({ email: input.email });

      return {
        ok: true,
        message: result.message,
      };
    }

    const result = await forgotPassword({ email: input.email });

    return {
      ok: true,
      message: result.message,
    };
  } catch (error) {
    return toFailureResult(error, 'Unable to resend the code right now.', {
      email: input.email,
    });
  }
}

export async function forgotPasswordAction(input: {
  email: string;
}): Promise<ActionResult> {
  try {
    await forgotPassword({ email: input.email });

    return {
      ok: true,
      redirectTo: `/otp?mode=reset&email=${encodeURIComponent(input.email)}`,
    };
  } catch (error) {
    return toFailureResult(error, 'Unable to start password reset right now.', {
      email: input.email,
    });
  }
}

export async function resetPasswordAction(input: {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  try {
    await resetPassword(input);
    await clearAuthSession();

    return {
      ok: true,
      redirectTo: '/login',
      message: 'Password reset successfully. Please sign in.',
    };
  } catch (error) {
    return toFailureResult(error, 'Unable to reset your password right now.');
  }
}

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  try {
    await changePassword(input);
    await clearAuthSession();
    return {
      ok: true,
      message: 'Password changed successfully. Please sign in again.',
      redirectTo: '/login',
    };
  } catch (error) {
    return toFailureResult(error, 'Failed to change password', {
      unauthorizedCode: 'invalid_credentials',
    });
  }
}

export async function logoutUserAction(): Promise<void> {
  await clearAuthSession();
  redirect('/login');
}

export async function persistOAuthSessionAction(input: {
  accessToken: string;
  refreshToken: string;
  user: unknown;
}): Promise<ActionResult> {
  try {
    const contract = input as unknown as UserLoginContract;
    const user = toUserProfile(contract.user);

    await persistAuthSession(
      {
        user,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
      },
      true
    );

    return { ok: true, redirectTo: '/dashboard' };
  } catch (error) {
    return toFailureResult(error, 'Unable to complete OAuth sign in.');
  }
}
