'use server';

import { revalidatePath } from 'next/cache';
import { type ActionResult, toFailureResult } from '@/shared/action-result';
import type {
  CreateJobNoteRequest,
  CreateJobRequest,
  UpdateJobRequest,
  UpdateJobStatusRequest,
} from './contracts';
import {
  createJob,
  createJobNote,
  deleteJob,
  deleteJobNote,
  updateJob,
  updateJobStatus,
} from './mutations';
import type { Job, JobNote } from './mappers';

// ─── Job actions ──────────────────────────────────────────────────────────────

export async function createJobAction(
  input: CreateJobRequest
): Promise<ActionResult<Job>> {
  try {
    const job = await createJob(input);
    revalidatePath('/jobs');

    return { ok: true, data: job, message: 'Job added successfully.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to add the job.');
  }
}

export async function updateJobAction(
  id: string,
  input: UpdateJobRequest
): Promise<ActionResult<Job>> {
  try {
    const job = await updateJob(id, input);
    revalidatePath('/jobs');

    return { ok: true, data: job, message: 'Job updated.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to update the job.');
  }
}

export async function updateJobStatusAction(
  id: string,
  input: UpdateJobStatusRequest
): Promise<ActionResult<Job>> {
  try {
    const job = await updateJobStatus(id, input);
    revalidatePath('/jobs');

    return { ok: true, data: job, message: 'Status updated.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to update the job status.');
  }
}

export async function deleteJobAction(id: string): Promise<ActionResult> {
  try {
    await deleteJob(id);
    revalidatePath('/jobs');

    return { ok: true, message: 'Job deleted.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to delete the job.');
  }
}

export async function createJobNoteAction(
  jobId: string,
  input: CreateJobNoteRequest
): Promise<ActionResult<JobNote>> {
  try {
    const note = await createJobNote(jobId, input);
    revalidatePath(`/jobs/${jobId}`);

    return { ok: true, data: note, message: 'Note added.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to add the note.');
  }
}

export async function deleteJobNoteAction(
  jobId: string,
  noteId: string
): Promise<ActionResult> {
  try {
    await deleteJobNote(jobId, noteId);
    revalidatePath(`/jobs/${jobId}`);

    return { ok: true, message: 'Note deleted.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to delete the note.');
  }
}
