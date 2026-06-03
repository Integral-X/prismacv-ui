'use server';

import { HttpError } from '@/shared/http/http-error';
import { clearAuthSession } from '@/modules/auth/data/session';
import { deleteAccount, updateProfile, uploadAvatar } from './mutations';

type UserActionCode = 'not_found' | 'unauthorized' | 'unknown';

interface ActionSuccessResult {
  ok: true;
  message?: string;
  redirectTo?: string;
}

interface ActionFailureResult {
  ok: false;
  code: UserActionCode;
  message: string;
}

export type UserActionResult = ActionSuccessResult | ActionFailureResult;

function toUserFailureResult(
  error: unknown,
  fallbackMessage: string
): ActionFailureResult {
  if (error instanceof HttpError) {
    const message = error.serverMessage ?? error.message;

    if (error.isNotFound) {
      return { ok: false, code: 'not_found', message };
    }

    if (error.isUnauthorized) {
      return { ok: false, code: 'unauthorized', message };
    }
  }

  const message =
    error instanceof Error && error.message ? error.message : fallbackMessage;

  return { ok: false, code: 'unknown', message };
}

export async function updateProfileAction(input: {
  name?: string;
  avatarUrl?: string;
}): Promise<UserActionResult> {
  try {
    await updateProfile(input);
    return { ok: true, message: 'Profile updated successfully' };
  } catch (error) {
    return toUserFailureResult(error, 'Failed to update profile');
  }
}

export async function uploadAvatarAction(
  formData: FormData
): Promise<UserActionResult> {
  const file = formData.get('avatar');

  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      code: 'unknown',
      message: 'Please choose an image to upload.',
    };
  }

  try {
    const avatarUrl = await uploadAvatar(file);
    await updateProfile({ avatarUrl });
    return { ok: true, message: 'Profile photo updated successfully' };
  } catch (error) {
    return toUserFailureResult(error, 'Failed to upload profile photo');
  }
}

export async function removeAvatarAction(): Promise<UserActionResult> {
  try {
    await updateProfile({ avatarUrl: '' });
    return { ok: true, message: 'Profile photo removed successfully' };
  } catch (error) {
    return toUserFailureResult(error, 'Failed to remove profile photo');
  }
}

export async function deleteAccountAction(): Promise<UserActionResult> {
  try {
    await deleteAccount();
    await clearAuthSession();
    return { ok: true, redirectTo: '/' };
  } catch (error) {
    return toUserFailureResult(error, 'Failed to delete account');
  }
}
