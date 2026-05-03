import { HttpError } from '@/shared/http/http-error';

export type ActionCode = 'not_found' | 'forbidden' | 'unauthorized' | 'unknown';

export interface ActionSuccessResult<T = undefined> {
  ok: true;
  data?: T;
  message?: string;
  redirectTo?: string;
}

export interface ActionFailureResult {
  ok: false;
  code: ActionCode;
  message: string;
}

export type ActionResult<T = undefined> =
  | ActionSuccessResult<T>
  | ActionFailureResult;

export function toFailureResult(
  error: unknown,
  fallbackMessage: string
): ActionFailureResult {
  if (error instanceof HttpError) {
    const message = error.serverMessage ?? error.message ?? fallbackMessage;

    if (error.isNotFound) return { ok: false, code: 'not_found', message };
    if (error.isForbidden) return { ok: false, code: 'forbidden', message };
    if (error.isUnauthorized)
      return { ok: false, code: 'unauthorized', message };
  }

  return { ok: false, code: 'unknown', message: fallbackMessage };
}
