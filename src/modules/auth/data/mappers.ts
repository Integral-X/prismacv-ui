import type {
  OtpResendContract,
  OtpVerificationContract,
  UserAuthContract,
  UserProfileContract,
  UserRoleContract,
} from './contracts';

// ─── Domain types ─────────────────────────────────────────────────────────────

export type UserRole = 'regular' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string | undefined;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  user: UserProfile;
}

export interface OtpVerificationResult {
  message: string;
  user: UserProfile;
}

export interface OtpResendResult {
  message: string;
  expiresAt: Date;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toUserRole(role: UserRoleContract): UserRole {
  return role === 'PLATFORM_ADMIN' ? 'admin' : 'regular';
}

export function toUserProfile(contract: UserProfileContract): UserProfile {
  return {
    id: contract.id,
    email: contract.email,
    name: contract.name,
    role: toUserRole(contract.role),
    emailVerified: contract.emailVerified,
    createdAt: new Date(contract.createdAt),
    updatedAt: new Date(contract.updatedAt),
  };
}

export function toAuthResult(contract: UserAuthContract): AuthResult {
  return {
    user: toUserProfile(contract.user),
  };
}

export function toOtpVerificationResult(
  contract: OtpVerificationContract
): OtpVerificationResult {
  return {
    message: contract.message,
    user: toUserProfile(contract.user),
  };
}

export function toOtpResendResult(
  contract: OtpResendContract
): OtpResendResult {
  return {
    message: contract.message,
    expiresAt: new Date(contract.expiresAt),
  };
}
