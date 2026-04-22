// ─── Shared ──────────────────────────────────────────────────────────────────

export type UserRoleContract = "REGULAR" | "PLATFORM_ADMIN";

export interface UserProfileContract {
  id: string;
  email: string;
  name?: string;
  role: UserRoleContract;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Request contracts ────────────────────────────────────────────────────────

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserSignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifySignupOtpRequest {
  email: string;
  otp: string;
}

export interface ResendSignupOtpRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ─── Response contracts ───────────────────────────────────────────────────────

export interface TokenPairContract {
  accessToken: string;
  refreshToken: string;
}

export interface UserAuthContract {
  user: UserProfileContract;
}

export interface UserLoginContract extends TokenPairContract {
  user: UserProfileContract;
}

export interface OtpVerificationContract extends TokenPairContract {
  message: string;
  user: UserProfileContract;
}

export interface OtpResendContract {
  message: string;
  expiresAt: string;
}

export interface ForgotPasswordContract {
  message: string;
}

export interface ResetPasswordContract {
  message: string;
}

export interface ChangePasswordContract {
  message: string;
}

export interface VerifyResetOtpContract {
  resetToken: string;
}

export type RefreshTokenContract = UserLoginContract;
