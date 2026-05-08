import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type {
  CheckGrammarRequest,
  CheckGrammarResponseContract,
} from './contracts';
import { toGrammarCheckResult, type GrammarCheckResult } from './mappers';

export async function checkGrammar(
  body: CheckGrammarRequest
): Promise<GrammarCheckResult> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      CheckGrammarResponseContract,
      CheckGrammarRequest
    >('grammar/check', body, { headers });

    return toGrammarCheckResult(contract);
  });
}
