import type {
  CreateJobRequest,
  UpdateJobRequest,
} from '@/modules/jobs/data/contracts';
import type {
  ManualCreateJobFormData,
  UpdateJobDetailFormData,
} from '@/lib/validations/jobs';

import type { JobSourceOption } from './job-form-constants';

interface JobNotesInput {
  expertise?: string;
  appliedDate?: string;
  applicationDeadline?: string;
  jobType: 'remote' | 'onsite' | 'hybrid';
  description?: string;
}

function sourceToUrlHint(
  source: JobSourceOption,
  url: string
): string | undefined {
  if (url.trim().length > 0) return url;
  return undefined;
}

function buildNotes(data: JobNotesInput): string | undefined {
  const parts: string[] = [];

  if (data.expertise) {
    parts.push(
      `Expertise: ${data.expertise.charAt(0).toUpperCase()}${data.expertise.slice(1)}`
    );
  }
  if (data.appliedDate) {
    parts.push(`Applied: ${data.appliedDate}`);
  }
  if (data.applicationDeadline) {
    parts.push(`Deadline: ${data.applicationDeadline}`);
  }
  if (data.jobType === 'hybrid') {
    parts.push('Work type: Hybrid');
  }
  if (data.description?.trim()) {
    parts.push(data.description.trim());
  }

  return parts.length > 0 ? parts.join('\n\n') : undefined;
}

export function mapManualFormToCreateRequest(
  data: ManualCreateJobFormData
): CreateJobRequest {
  return {
    title: data.title,
    company: data.company,
    location: data.location || undefined,
    url: sourceToUrlHint(data.source, data.url ?? ''),
    status: data.status,
    isRemote: data.jobType === 'remote',
    notes: buildNotes(data),
  };
}

export function mapDetailFormToUpdateRequest(
  data: UpdateJobDetailFormData
): UpdateJobRequest {
  return {
    title: data.title,
    company: data.company,
    location: data.location || undefined,
    url: data.url || undefined,
    isRemote: data.jobType === 'remote',
    notes: buildNotes(data),
  };
}
