'use server';

import { revalidatePath } from 'next/cache';
import type {
  CreateCoverLetterRequest,
  UpdateCoverLetterRequest,
  GenerateCoverLetterRequest,
  GeneratedCoverLetterResponseContract,
} from './contracts';
import {
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
  generateCoverLetter,
} from './mutations';
import type { CoverLetter } from './mappers';
import { type ActionResult, toFailureResult } from '@/shared/action-result';

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createCoverLetterAction(
  input: CreateCoverLetterRequest
): Promise<ActionResult<CoverLetter>> {
  try {
    const coverLetter = await createCoverLetter(input);
    revalidatePath('/cover-letters');
    return { ok: true, data: coverLetter };
  } catch (error) {
    return toFailureResult(error, 'Failed to create cover letter');
  }
}

export async function updateCoverLetterAction(
  id: string,
  input: UpdateCoverLetterRequest
): Promise<ActionResult<CoverLetter>> {
  try {
    const coverLetter = await updateCoverLetter(id, input);
    revalidatePath('/cover-letters');
    revalidatePath(`/cover-letters/${id}/edit`);
    return { ok: true, data: coverLetter };
  } catch (error) {
    return toFailureResult(error, 'Failed to update cover letter');
  }
}

export async function deleteCoverLetterAction(
  id: string
): Promise<ActionResult> {
  try {
    await deleteCoverLetter(id);
    revalidatePath('/cover-letters');
    return { ok: true };
  } catch (error) {
    return toFailureResult(error, 'Failed to delete cover letter');
  }
}

export async function generateCoverLetterAction(
  input: GenerateCoverLetterRequest
): Promise<ActionResult<GeneratedCoverLetterResponseContract>> {
  try {
    const result = await generateCoverLetter(input);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(error, 'Failed to generate cover letter');
  }
}
