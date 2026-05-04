import type {
  OtpResendContract,
  OtpVerificationContract,
  UserAuthContract,
  UserLoginContract,
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
  accessToken: string;
  refreshToken: string;
}

export interface SignupResult {
  user: UserProfile;
}

export interface OtpVerificationResult {
  message: string;
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface OtpResendResult {
  message: string;
  expiresAt: Date;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function parseDateField(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function parseUserRole(value: unknown): UserRole | null {
  if (value === 'regular' || value === 'admin') return value;
  if (value === 'REGULAR') return 'regular';
  if (value === 'PLATFORM_ADMIN') return 'admin';
  return null;
}

/**
 * Restores a `UserProfile` from `JSON.parse` output (e.g. session cookie).
 * `Date` instances are not preserved by JSON — this converts date fields explicitly.
 */
export function parseUserProfileFromJson(value: unknown): UserProfile | null {
  if (typeof value !== 'object' || value === null) return null;
  const o = value as Record<string, unknown>;

  if (typeof o.id !== 'string' || typeof o.email !== 'string') return null;
  if (typeof o.emailVerified !== 'boolean') return null;

  const role = parseUserRole(o.role);
  if (!role) return null;

  const createdAt = parseDateField(o.createdAt);
  const updatedAt = parseDateField(o.updatedAt);
  if (!createdAt || !updatedAt) return null;

  return {
    id: o.id,
    email: o.email,
    name: typeof o.name === 'string' ? o.name : undefined,
    role,
    emailVerified: o.emailVerified,
    createdAt,
    updatedAt,
  };
}

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

export function toSignupResult(contract: UserAuthContract): SignupResult {
  return {
    user: toUserProfile(contract.user),
  };
}

export function toAuthResult(contract: UserLoginContract): AuthResult {
  return {
    user: toUserProfile(contract.user),
    accessToken: contract.accessToken,
    refreshToken: contract.refreshToken,
  };
}

export function toOtpVerificationResult(
  contract: OtpVerificationContract
): OtpVerificationResult {
  return {
    message: contract.message,
    user: toUserProfile(contract.user),
    accessToken: contract.accessToken,
    refreshToken: contract.refreshToken,
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
