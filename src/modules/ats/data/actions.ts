'use server';

import { HttpError } from '@/shared/http/http-error';
import { scoreAts } from './mutations';
import type { AtsScoreRequest } from './contracts';
import type { AtsScoreResult } from './mappers';

export type AtsActionCode = 'unauthorized' | 'validation' | 'unknown';

export interface AtsActionSuccess {
  ok: true;
  data: AtsScoreResult;
}

export interface AtsActionFailure {
  ok: false;
  code: AtsActionCode;
  message: string;
}

export type AtsScoreActionResult = AtsActionSuccess | AtsActionFailure;

function toFailure(error: unknown, fallback: string): AtsActionFailure {
  if (error instanceof HttpError) {
    if (error.isUnauthorized) {
      return {
        ok: false,
        code: 'unauthorized',
        message: error.serverMessage ?? error.message,
      };
    }
  }
  return {
    ok: false,
    code: 'unknown',
    message: error instanceof Error && error.message ? error.message : fallback,
  };
}

export async function scoreAtsAction(
  input: AtsScoreRequest
): Promise<AtsScoreActionResult> {
  try {
    const data = await scoreAts(input);
    return { ok: true, data };
  } catch (error) {
    return toFailure(error, 'Unable to score this match-up right now.');
  }
}
