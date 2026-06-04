import { apiClient } from '@/shared/http/api-client';
import {
  getQueueJobStatus,
  queueAiAnalyze,
  queueAiOptimize,
  queuePdfExport,
} from './mutations';
import type {
  QueueJobAcceptedContract,
  QueueJobStatusContract,
} from './contracts';

jest.mock('@/shared/http/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('@/shared/auth/execute-authenticated-request', () => ({
  executeAuthenticatedRequest: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: 'Bearer test-token' })
  ),
}));

const getMock = jest.mocked(apiClient.get);
const postMock = jest.mocked(apiClient.post);
const authHeaders = { Authorization: 'Bearer test-token' };

describe('queue mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queues a PDF export job', async () => {
    const accepted: QueueJobAcceptedContract = {
      jobId: 'job_pdf',
      statusUrl: '/api/v1/queue/jobs/job_pdf',
    };
    postMock.mockResolvedValueOnce(accepted);

    await expect(queuePdfExport({ cvId: 'cv_001' })).resolves.toEqual(accepted);
    expect(postMock).toHaveBeenCalledWith(
      'queue/jobs/pdf-export',
      { cvId: 'cv_001' },
      { headers: authHeaders }
    );
  });

  it('queues an AI analysis job', async () => {
    const accepted: QueueJobAcceptedContract = {
      jobId: 'job_analyze',
      statusUrl: '/api/v1/queue/jobs/job_analyze',
    };
    postMock.mockResolvedValueOnce(accepted);

    await expect(queueAiAnalyze({ cvId: 'cv_001' })).resolves.toEqual(accepted);
    expect(postMock).toHaveBeenCalledWith(
      'queue/jobs/ai/analyze',
      { cvId: 'cv_001' },
      { headers: authHeaders }
    );
  });

  it('queues an AI optimization job', async () => {
    const accepted: QueueJobAcceptedContract = {
      jobId: 'job_optimize',
      statusUrl: '/api/v1/queue/jobs/job_optimize',
    };
    postMock.mockResolvedValueOnce(accepted);

    await expect(
      queueAiOptimize({
        cvId: 'cv_001',
        jobDescription: 'Senior TypeScript engineer',
      })
    ).resolves.toEqual(accepted);
    expect(postMock).toHaveBeenCalledWith(
      'queue/jobs/ai/optimize',
      {
        cvId: 'cv_001',
        jobDescription: 'Senior TypeScript engineer',
      },
      { headers: authHeaders }
    );
  });

  it('fetches queue job status', async () => {
    const status: QueueJobStatusContract = {
      id: 'job_001',
      state: 'completed',
      type: 'pdf_export',
      result: {
        filename: 'cv.pdf',
        contentType: 'application/pdf',
        base64: 'JVBERi0=',
      },
      processedOn: '2026-06-01T10:00:00.000Z',
      finishedOn: '2026-06-01T10:00:05.000Z',
    };
    getMock.mockResolvedValueOnce(status);

    await expect(getQueueJobStatus('job_001')).resolves.toEqual(status);
    expect(getMock).toHaveBeenCalledWith('queue/jobs/job_001', {
      headers: authHeaders,
    });
  });
});
