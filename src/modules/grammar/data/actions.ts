"use server";

import { toFailureResult, type ActionResult } from "@/shared/action-result";
import { checkGrammar } from "./mutations";
import type { CheckGrammarRequest } from "./contracts";
import type { GrammarCheckResult } from "./mappers";

export async function checkGrammarAction(
  input: CheckGrammarRequest
): Promise<ActionResult<GrammarCheckResult>> {
  try {
    const data = await checkGrammar(input);
    return { ok: true, data };
  } catch (error) {
    return toFailureResult(error, "Unable to check grammar right now.");
  }
}
