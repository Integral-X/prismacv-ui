import { apiClient } from '@/shared/http/api-client';
import type { PaginatedResponse } from '@/shared/http/paginated-response';
import { getJobById, getJobStats, getJobs } from './queries';
import type {
  JobResponseContract,
  JobStatsResponseContract,
} from './contracts';

jest.mock('@/shared/http/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock('@/shared/auth/execute-authenticated-request', () => ({
  executeAuthenticatedRequest: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: 'Bearer test-token' })
  ),
}));

const getMock = jest.mocked(apiClient.get);

const jobContract: JobResponseContract = {
  id: 'job_001',
  title: 'Senior Engineer',
  company: 'Acme Corp',
  isRemote: true,
  status: 'APPLIED',
  createdAt: '2026-04-01T10:00:00.000Z',
  updatedAt: '2026-04-12T14:00:00.000Z',
};

function paginated(
  items: JobResponseContract[]
): PaginatedResponse<JobResponseContract> {
  return {
    data: items,
    meta: {
      total: items.length,
      page: 1,
      limit: 100,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}

describe('jobs queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getJobs', () => {
    it('fetches jobs with a default limit and maps them to domain jobs', async () => {
      getMock.mockResolvedValueOnce(paginated([jobContract]));

      const result = await getJobs();

      expect(getMock).toHaveBeenCalledWith('jobs', {
        headers: { Authorization: 'Bearer test-token' },
        params: { limit: 100 },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('job_001');
      expect(result[0].status).toBe('applied');
    });

    it('forwards a status filter as a query param', async () => {
      getMock.mockResolvedValueOnce(paginated([]));

      await getJobs('APPLIED');

      expect(getMock).toHaveBeenCalledWith('jobs', {
        headers: { Authorization: 'Bearer test-token' },
        params: { limit: 100, status: 'APPLIED' },
      });
    });
  });

  describe('getJobById', () => {
    it('fetches a single job by id and maps it', async () => {
      getMock.mockResolvedValueOnce(jobContract);

      const result = await getJobById('job_001');

      expect(getMock).toHaveBeenCalledWith('jobs/job_001', {
        headers: { Authorization: 'Bearer test-token' },
      });
      expect(result.company).toBe('Acme Corp');
    });
  });

  describe('getJobStats', () => {
    it('fetches and returns the job statistics', async () => {
      const stats: JobStatsResponseContract = {
        total: 7,
        byStatus: { saved: 3, applied: 4 },
        appliedThisWeek: 2,
        pendingInterviews: 1,
        activeOffers: 0,
      };
      getMock.mockResolvedValueOnce(stats);

      const result = await getJobStats();

      expect(getMock).toHaveBeenCalledWith('jobs/stats', {
        headers: { Authorization: 'Bearer test-token' },
      });
      expect(result.total).toBe(7);
      expect(result.appliedThisWeek).toBe(2);
    });
  });
});
