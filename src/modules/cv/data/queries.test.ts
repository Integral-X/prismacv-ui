import { apiClient } from '@/shared/http/api-client';
import { getUserCvs, getCvById, getTemplates } from './queries';
import {
  cvContract,
  paginatedCvListContract,
  templateContract,
} from './__fixtures__/cv-contracts';

jest.mock('@/shared/http/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock('@/shared/auth/execute-authenticated-request', () => ({
  executeAuthenticatedRead: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: 'Bearer test-token' })
  ),
}));

const getMock = jest.mocked(apiClient.get);

describe('cv queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserCvs', () => {
    it('fetches paginated CV list with auth headers', async () => {
      getMock.mockResolvedValueOnce(paginatedCvListContract);

      const result = await getUserCvs();

      expect(getMock).toHaveBeenCalledWith('cv', {
        headers: { Authorization: 'Bearer test-token' },
        params: {},
      });
      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe('cv_001');
      expect(result.items[0].status).toBe('draft');
      expect(result.items[0].createdAt).toEqual(
        new Date('2026-04-01T10:00:00.000Z')
      );
      expect(result.meta.total).toBe(2);
    });

    it('passes page and limit params when provided', async () => {
      getMock.mockResolvedValueOnce(paginatedCvListContract);

      await getUserCvs(2, 5);

      expect(getMock).toHaveBeenCalledWith('cv', {
        headers: { Authorization: 'Bearer test-token' },
        params: { page: 2, limit: 5 },
      });
    });
  });

  describe('getCvById', () => {
    it('fetches a full CV and maps all sections', async () => {
      getMock.mockResolvedValueOnce(cvContract);

      const result = await getCvById('cv_001');

      expect(getMock).toHaveBeenCalledWith('cv/cv_001', {
        headers: { Authorization: 'Bearer test-token' },
      });
      expect(result.id).toBe('cv_001');
      expect(result.status).toBe('draft');
      expect(result.personalInfo?.fullName).toBe('John Doe');
      expect(result.experiences).toHaveLength(1);
      expect(result.experiences[0].company).toBe('Acme Corp');
      expect(result.experiences[0].startDate).toEqual(
        new Date('2022-01-15T00:00:00.000Z')
      );
      expect(result.skills[0].level).toBe('advanced');
    });
  });

  describe('getTemplates', () => {
    it('fetches templates without auth headers', async () => {
      getMock.mockResolvedValueOnce([templateContract]);

      const result = await getTemplates();

      expect(getMock).toHaveBeenCalledWith('cv/templates');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'classic',
        name: 'Classic',
        thumbnail: '/images/templates/classic.png',
        hasHeadshot: true,
        layout: 'single',
        category: 'professional',
      });
    });
  });
});
