'use server';

import { revalidatePath } from 'next/cache';
import { HttpError } from '@/shared/http/http-error';
import { refreshUnleashFeaturesFromServer } from './mutations';

export type RefreshFeaturesActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function refreshUnleashFeaturesAction(): Promise<RefreshFeaturesActionResult> {
  try {
    const payload = await refreshUnleashFeaturesFromServer();
    revalidatePath('/admin');
    return {
      ok: true,
      message: payload.message ?? 'Feature flags refresh initiated.',
    };
  } catch (error) {
    const message =
      error instanceof HttpError
        ? (error.serverMessage ?? error.message)
        : error instanceof Error && error.message
          ? error.message
          : 'Unable to refresh flags. Sign in with a platform admin session that can call the refresh API.';
    return { ok: false, message };
  }
}
