import "server-only";

import { apiClient } from "@/shared/http/api-client";
import { executeAuthenticatedRequest } from "@/shared/auth/execute-authenticated-request";
import type {
  CreateJobNoteRequest,
  CreateJobRequest,
  JobNoteResponseContract,
  JobResponseContract,
  UpdateJobRequest,
  UpdateJobStatusRequest,
} from "./contracts";
import { toJob, toJobNote, type Job, type JobNote } from "./mappers";

export async function createJob(body: CreateJobRequest): Promise<Job> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      JobResponseContract,
      CreateJobRequest
    >("jobs", body, { headers });

    return toJob(contract);
  });
}

export async function updateJob(
  id: string,
  body: UpdateJobRequest
): Promise<Job> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.patch<
      JobResponseContract,
      UpdateJobRequest
    >(`jobs/${id}`, body, { headers });

    return toJob(contract);
  });
}

export async function updateJobStatus(
  id: string,
  body: UpdateJobStatusRequest
): Promise<Job> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.patch<
      JobResponseContract,
      UpdateJobStatusRequest
    >(`jobs/${id}/status`, body, { headers });

    return toJob(contract);
  });
}

export async function deleteJob(id: string): Promise<void> {
  return executeAuthenticatedRequest(async (headers) => {
    await apiClient.delete(`jobs/${id}`, { headers });
  });
}

export async function createJobNote(
  jobId: string,
  body: CreateJobNoteRequest
): Promise<JobNote> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      JobNoteResponseContract,
      CreateJobNoteRequest
    >(`jobs/${jobId}/notes`, body, { headers });

    return toJobNote(contract);
  });
}

export async function deleteJobNote(
  jobId: string,
  noteId: string
): Promise<void> {
  return executeAuthenticatedRequest(async (headers) => {
    await apiClient.delete(`jobs/${jobId}/notes/${noteId}`, { headers });
  });
}
