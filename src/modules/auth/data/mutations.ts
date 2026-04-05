import { cookies } from 'next/headers';
import { apiClient } from '@/shared/http/api-client';
import type {
  ChangePasswordContract,
  ChangePasswordRequest,
  ForgotPasswordContract,
  ForgotPasswordRequest,
  OtpResendContract,
  OtpVerificationContract,
  ResetPasswordContract,
  ResetPasswordRequest,
  ResendSignupOtpRequest,
  UserAuthContract,
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
  type AuthResult,
  type OtpResendResult,
  type OtpVerificationResult,
} from './mappers';

// ─── Token helpers ────────────────────────────────────────────────────────────

async function readAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access-token')?.value;

  if (!accessToken) return {};

  return { Authorization: `Bearer ${accessToken}` };
}

// ─── Auth mutations ───────────────────────────────────────────────────────────

/**
 * Authenticates a regular user.
 *
 * NOTE: The backend currently does not mark this endpoint as @Public(),
 * so it requires a Bearer token to call — which regular users cannot
 * obtain yet. This will work once the backend is fixed.
 */
export async function loginUser(body: UserLoginRequest): Promise<AuthResult> {
  const contract = await apiClient.post<UserAuthContract, UserLoginRequest>(
    'auth/user/login',
    body
  );

  return toAuthResult(contract);
}

/**
 * Registers a new regular user.
 *
 * NOTE: Same @Public() issue as loginUser — backend fix required.
 * After successful signup, backend sends a verification OTP to the email.
 */
export async function signupUser(body: UserSignupRequest): Promise<AuthResult> {
  const contract = await apiClient.post<UserAuthContract, UserSignupRequest>(
    'auth/user/signup',
    body
  );

  return toAuthResult(contract);
}

/**
 * Verifies the OTP sent to the user's email after signup.
 * On success, marks the user's email as verified.
 */
export async function verifySignupOtp(
  body: VerifySignupOtpRequest
): Promise<OtpVerificationResult> {
  const headers = await readAuthHeader();

  const contract = await apiClient.post<
    OtpVerificationContract,
    VerifySignupOtpRequest
  >('otp/verify-signup', body, { headers });

  return toOtpVerificationResult(contract);
}

/**
 * Resends the signup verification OTP.
 * Rate limited to 5 attempts per 5 minutes by the backend.
 */
export async function resendSignupOtp(
  body: ResendSignupOtpRequest
): Promise<OtpResendResult> {
  const headers = await readAuthHeader();

  const contract = await apiClient.post<
    OtpResendContract,
    ResendSignupOtpRequest
  >('otp/resend-signup', body, { headers });

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
  const headers = await readAuthHeader();

  return apiClient.post<VerifyResetOtpContract, VerifyResetOtpRequest>(
    'otp/verify-reset',
    body,
    { headers }
  );
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
  const headers = await readAuthHeader();

  return apiClient.post<ChangePasswordContract, ChangePasswordRequest>(
    'auth/user/change-password',
    body,
    { headers }
  );
}
