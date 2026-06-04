import { HttpError } from '@/shared/http/http-error';

export type ActionCode =
  | 'not_found'
  | 'forbidden'
  | 'conflict'
  | 'unauthorized'
  | 'validation'
  | 'unknown';

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
    if (error.isConflict) return { ok: false, code: 'conflict', message };
    if (error.isUnauthorized)
      return { ok: false, code: 'unauthorized', message };

    // Unmapped HTTP status (e.g. 500) — preserve the server message.
    return { ok: false, code: 'unknown', message };
  }

  return { ok: false, code: 'unknown', message: fallbackMessage };
}
