import type { UserProfileResponseContract } from "./contracts";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  provider: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserProfile(
  contract: UserProfileResponseContract
): UserProfile {
  return {
    id: contract.id,
    email: contract.email,
    name: contract.name ?? null,
    role: contract.role.toLowerCase(),
    emailVerified: contract.emailVerified,
    avatarUrl: contract.avatarUrl ?? null,
    provider: contract.provider ?? null,
    createdAt: new Date(contract.createdAt),
    updatedAt: new Date(contract.updatedAt),
  };
}
