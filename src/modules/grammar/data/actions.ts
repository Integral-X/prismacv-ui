'use server';

import { HttpError } from '@/shared/http/http-error';
import { checkGrammar } from './mutations';
import type { CheckGrammarRequest } from './contracts';
import type { GrammarCheckResult } from './mappers';

export type GrammarActionCode = 'unauthorized' | 'unknown';

export interface GrammarActionSuccess {
  ok: true;
  data: GrammarCheckResult;
}

export interface GrammarActionFailure {
  ok: false;
  code: GrammarActionCode;
  message: string;
}

export type GrammarCheckActionResult =
  | GrammarActionSuccess
  | GrammarActionFailure;

function toFailure(error: unknown, fallback: string): GrammarActionFailure {
  if (error instanceof HttpError && error.isUnauthorized) {
    return {
      ok: false,
      code: 'unauthorized',
      message: error.serverMessage ?? error.message,
    };
  }
  return {
    ok: false,
    code: 'unknown',
    message: error instanceof Error && error.message ? error.message : fallback,
  };
}

export async function checkGrammarAction(
  input: CheckGrammarRequest
): Promise<GrammarCheckActionResult> {
  try {
    const data = await checkGrammar(input);
    return { ok: true, data };
  } catch (error) {
    return toFailure(error, 'Unable to check grammar right now.');
  }
}
