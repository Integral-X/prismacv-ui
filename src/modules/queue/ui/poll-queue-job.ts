'use client';

import { getQueueJobStatusAction } from '@/modules/queue/data/actions';
import type { QueueJobStatus } from '@/modules/queue/data/mappers';

const DEFAULT_INTERVAL_MS = 1500;
const DEFAULT_TIMEOUT_MS = 120000;
const TERMINAL_STATES = new Set(['completed', 'failed']);

export interface PollQueueJobOptions {
  jobId: string;
  intervalMs?: number;
  timeoutMs?: number;
  onStatus?: (status: QueueJobStatus) => void;
}

export async function pollQueueJob({
  jobId,
  intervalMs = DEFAULT_INTERVAL_MS,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onStatus,
}: PollQueueJobOptions): Promise<QueueJobStatus> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await getQueueJobStatusAction(jobId);

    if (!response.ok) {
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error('Queue job status returned no data.');
    }

    onStatus?.(response.data);

    if (TERMINAL_STATES.has(response.data.state)) {
      return response.data;
    }

    await wait(intervalMs);
  }

  throw new Error('The job is taking longer than expected. Try again shortly.');
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
