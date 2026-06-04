import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { HttpError } from '@/shared/http/http-error';
import type {
  ChangePasswordContract,
  ChangePasswordRequest,
  ForgotPasswordContract,
  ForgotPasswordRequest,
  OtpResendContract,
  OtpVerificationContract,
  RefreshTokenContract,
  RefreshTokenRequest,
  ResetPasswordContract,
  ResetPasswordRequest,
  ResendSignupOtpRequest,
  UserAuthContract,
  UserLoginContract,
  UserLoginRequest,
  UserSignupRequest,
  VerifyResetOtpContract,
  VerifyResetOtpRequest,
  VerifySignupOtpRequest,
} from './contracts';
import {
  toAuthResult,
  toOtpResendResult,
  toOtpVerificationResult,
  toSignupResult,
  type AuthResult,
  type OtpResendResult,
  type OtpVerificationResult,
  type SignupResult,
} from './mappers';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from './session';

async function refreshSessionAndGetAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthSession();
    throw new HttpError(401, 'Unauthorized', 'Authentication required');
  }

  try {
    const refreshedSession = await refreshUserToken({ refreshToken });

    await persistAuthSession(refreshedSession, await shouldPersistSession());

    return refreshedSession.accessToken;
  } catch (error) {
    await clearAuthSession();
    throw error;
  }
}

async function executeAuthenticatedRequest<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  let accessToken = await getAccessToken();

  if (!accessToken) {
    accessToken = await refreshSessionAndGetAccessToken();
  }

  try {
    return await operation({ Authorization: `Bearer ${accessToken}` });
  } catch (error) {
    if (!(error instanceof HttpError) || !error.isUnauthorized) {
      throw error;
    }

    const refreshedAccessToken = await refreshSessionAndGetAccessToken();

    return await operation({
      Authorization: `Bearer ${refreshedAccessToken}`,
    });
  }
}

// ─── Auth mutations ───────────────────────────────────────────────────────────

/**
 * Authenticates a regular user.
 */
export async function loginUser(body: UserLoginRequest): Promise<AuthResult> {
  const contract = await apiClient.post<UserLoginContract, UserLoginRequest>(
    'auth/user/login',
    body
  );

  return toAuthResult(contract);
}

/**
 * Registers a new regular user.
 *
 * After successful signup, backend sends a verification OTP to the email.
 */
export async function signupUser(
  body: UserSignupRequest
): Promise<SignupResult> {
  const contract = await apiClient.post<UserAuthContract, UserSignupRequest>(
    'auth/user/signup',
    body
  );

  return toSignupResult(contract);
}

/**
 * Verifies the OTP sent to the user's email after signup.
 * On success, marks the user's email as verified.
 */
export async function verifySignupOtp(
  body: VerifySignupOtpRequest
): Promise<OtpVerificationResult> {
  const contract = await apiClient.post<
    OtpVerificationContract,
    VerifySignupOtpRequest
  >('otp/verify-signup', body);

  return toOtpVerificationResult(contract);
}

/**
 * Resends the signup verification OTP.
 * Rate limited to 5 attempts per 5 minutes by the backend.
 */
export async function resendSignupOtp(
  body: ResendSignupOtpRequest
): Promise<OtpResendResult> {
  const contract = await apiClient.post<
    OtpResendContract,
    ResendSignupOtpRequest
  >('otp/resend-signup', body);

  return toOtpResendResult(contract);
}

/**
 * Initiates the password reset flow by sending an OTP to the registered email.
 * Rate limited to 5 attempts per 5 minutes by the backend.
 */
export async function forgotPassword(
  body: ForgotPasswordRequest
): Promise<ForgotPasswordContract> {
  return apiClient.post<ForgotPasswordContract, ForgotPasswordRequest>(
    'auth/user/forgot-password',
    body
  );
}

/**
 * Verifies the password reset OTP.
 * Returns a short-lived reset token used in the next step.
 */
export async function verifyResetOtp(
  body: VerifyResetOtpRequest
): Promise<VerifyResetOtpContract> {
  return apiClient.post<VerifyResetOtpContract, VerifyResetOtpRequest>(
    'otp/verify-reset',
    body
  );
}

/**
 * Refreshes the authenticated regular user's access token using the refresh token.
 */
export async function refreshUserToken(
  body: RefreshTokenRequest
): Promise<AuthResult> {
  const contract = await apiClient.post<
    RefreshTokenContract,
    RefreshTokenRequest
  >('auth/user/refresh', body);

  return toAuthResult(contract);
}

/**
 * Sets a new password using the reset token obtained from verifyResetOtp.
 */
export async function resetPassword(
  body: ResetPasswordRequest
): Promise<ResetPasswordContract> {
  return apiClient.post<ResetPasswordContract, ResetPasswordRequest>(
    'auth/user/reset-password',
    body
  );
}

/**
 * Changes the password for an authenticated user.
 * Invalidates all sessions on success.
 */
export async function changePassword(
  body: ChangePasswordRequest
): Promise<ChangePasswordContract> {
  return executeAuthenticatedRequest((headers) =>
    apiClient.post<ChangePasswordContract, ChangePasswordRequest>(
      'auth/user/change-password',
      body,
      { headers }
    )
  );
}
