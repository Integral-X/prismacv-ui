"use server";

import { clearAuthSession } from "@/modules/auth/data/session";
import { toFailureResult, type ActionResult } from "@/shared/action-result";
import { deleteAccount, updateProfile, uploadAvatar } from "./mutations";

export async function updateProfileAction(input: {
  name?: string;
  avatarUrl?: string;
}): Promise<ActionResult> {
  try {
    await updateProfile(input);
    return { ok: true, message: "Profile updated successfully" };
  } catch (error) {
    return toFailureResult(error, "Failed to update profile");
  }
}

export async function uploadAvatarAction(
  formData: FormData
): Promise<ActionResult> {
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      code: "unknown",
      message: "Please choose an image to upload.",
    };
  }

  try {
    const avatarUrl = await uploadAvatar(file);
    await updateProfile({ avatarUrl });
    return { ok: true, message: "Profile photo updated successfully" };
  } catch (error) {
    return toFailureResult(error, "Failed to upload profile photo");
  }
}

export async function removeAvatarAction(): Promise<ActionResult> {
  try {
    await updateProfile({ avatarUrl: "" });
    return { ok: true, message: "Profile photo removed successfully" };
  } catch (error) {
    return toFailureResult(error, "Failed to remove profile photo");
  }
}

export async function deleteAccountAction(): Promise<ActionResult> {
  try {
    await deleteAccount();
    await clearAuthSession();
    return { ok: true, redirectTo: "/" };
  } catch (error) {
    return toFailureResult(error, "Failed to delete account");
  }
}
