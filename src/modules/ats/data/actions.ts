'use server';

import { toFailureResult, type ActionResult } from '@/shared/action-result';
import { scoreAts } from './mutations';
import type { AtsScoreRequest } from './contracts';
import type { AtsScoreResult } from './mappers';

export async function scoreAtsAction(
  input: AtsScoreRequest
): Promise<ActionResult<AtsScoreResult>> {
  try {
    const data = await scoreAts(input);
    return { ok: true, data };
  } catch (error) {
    return toFailureResult(error, 'Unable to score this match-up right now.');
  }
}
