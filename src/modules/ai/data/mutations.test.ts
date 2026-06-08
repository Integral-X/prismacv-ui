import { apiClient } from '@/shared/http/api-client';
import type {
  CvAnalysisResultContract,
  CvOptimizationResultContract,
} from './contracts';
import { analyzeCv, optimizeCvForJob } from './mutations';

jest.mock('@/shared/http/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock('@/shared/auth/execute-authenticated-request', () => ({
  executeAuthenticatedRequest: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: 'Bearer test-token' })
  ),
}));

const postMock = jest.mocked(apiClient.post);
const authHeaders = { Authorization: 'Bearer test-token' };

const analysisContract = {
  overallScore: 78,
  grammarScore: 90,
  readabilityScore: 72,
  atsScore: 65,
  issues: [],
  suggestions: [],
} satisfies CvAnalysisResultContract;

const optimizationContract = {
  matchScore: 84,
  missingKeywords: ['Kubernetes'],
  suggestions: [],
  sectionRecommendations: [],
} satisfies CvOptimizationResultContract;

describe('ai mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeCv', () => {
    it('posts to the cv analyze endpoint and maps the result', async () => {
      postMock.mockResolvedValueOnce(analysisContract);

      const result = await analyzeCv('cv_001');

      expect(postMock).toHaveBeenCalledWith(
        'ai/cv/cv_001/analyze',
        {},
        { headers: authHeaders }
      );
      expect(result.overallScore).toBe(78);
      expect(result.issues).toEqual([]);
    });

    it('includes the cv id in the endpoint path', async () => {
      postMock.mockResolvedValueOnce(analysisContract);

      await analyzeCv('cv_abc');

      expect(postMock).toHaveBeenCalledWith(
        'ai/cv/cv_abc/analyze',
        {},
        expect.anything()
      );
    });
  });

  describe('optimizeCvForJob', () => {
    it('posts the job description to the optimize endpoint and maps the result', async () => {
      postMock.mockResolvedValueOnce(optimizationContract);

      const result = await optimizeCvForJob('cv_001', {
        jobDescription: 'Senior backend engineer',
      });

      expect(postMock).toHaveBeenCalledWith(
        'ai/cv/cv_001/optimize',
        { jobDescription: 'Senior backend engineer' },
        { headers: authHeaders }
      );
      expect(result.matchScore).toBe(84);
      expect(result.missingKeywords).toEqual(['Kubernetes']);
    });
  });
});
