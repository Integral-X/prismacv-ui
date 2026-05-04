export interface UserProfileResponseContract {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  emailVerified: boolean;
  avatarUrl?: string | null;
  provider?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatarUrl?: string;
}

export interface AvatarUploadResponseContract {
  avatarUrl: string;
}
