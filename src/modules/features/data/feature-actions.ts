"use server";

import { revalidatePath } from "next/cache";
import { HttpError } from "@/shared/http/http-error";
import { refreshUnleashFeaturesFromServer } from "./mutations";

export type FeatureActionFailure = {
  ok: false;
  message: string;
};

export type FeatureActionSuccess = {
  ok: true;
  message: string;
};

export type RefreshFeaturesActionResult =
  | FeatureActionSuccess
  | FeatureActionFailure;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    return error.serverMessage ?? error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export async function refreshUnleashFeaturesAction(): Promise<RefreshFeaturesActionResult> {
  try {
    const payload = await refreshUnleashFeaturesFromServer();
    revalidatePath("/admin");
    return {
      ok: true,
      message: payload.message ?? "Feature flags refresh initiated.",
    };
  } catch (error) {
    return {
      ok: false,
      message: getErrorMessage(
        error,
        "Unable to refresh flags. Sign in with a platform admin session that can call the refresh API."
      ),
    };
  }
}
