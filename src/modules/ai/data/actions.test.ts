import { HttpError } from '@/shared/http/http-error';
import { analyzeCvAction, optimizeCvAction } from './actions';
import type { CvAnalysisResult, CvOptimizationResult } from './mappers';

jest.mock('./mutations', () => ({
  analyzeCv: jest.fn(),
  optimizeCvForJob: jest.fn(),
}));

const mutations = jest.requireMock('./mutations') as {
  analyzeCv: jest.Mock;
  optimizeCvForJob: jest.Mock;
};

const analysis: CvAnalysisResult = {
  overallScore: 80,
  grammarScore: 85,
  readabilityScore: 75,
  atsScore: 70,
  issues: [],
  suggestions: [],
};

const optimization: CvOptimizationResult = {
  matchScore: 88,
  missingKeywords: ['GraphQL'],
  suggestions: [],
  sectionRecommendations: [],
};

describe('ai actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeCvAction', () => {
    it('returns the analysis result on success', async () => {
      mutations.analyzeCv.mockResolvedValueOnce(analysis);

      const result = await analyzeCvAction('cv_001');

      expect(result).toEqual({ ok: true, data: analysis });
      expect(mutations.analyzeCv).toHaveBeenCalledWith('cv_001');
    });

    it('maps a 404 HttpError to not_found with the server message', async () => {
      mutations.analyzeCv.mockRejectedValueOnce(
        new HttpError(404, 'Not Found', 'CV not found')
      );

      const result = await analyzeCvAction('cv_404');

      expect(result).toEqual({
        ok: false,
        code: 'not_found',
        message: 'CV not found',
      });
    });

    it('maps a 403 HttpError to forbidden', async () => {
      mutations.analyzeCv.mockRejectedValueOnce(
        new HttpError(403, 'Forbidden', 'Access denied')
      );

      const result = await analyzeCvAction('cv_001');

      expect(result).toEqual({
        ok: false,
        code: 'forbidden',
        message: 'Access denied',
      });
    });

    it('maps a 401 HttpError to unauthorized', async () => {
      mutations.analyzeCv.mockRejectedValueOnce(
        new HttpError(401, 'Unauthorized', 'Token expired')
      );

      const result = await analyzeCvAction('cv_001');

      expect(result).toEqual({
        ok: false,
        code: 'unauthorized',
        message: 'Token expired',
      });
    });

    it('maps a generic error to unknown with the fallback message', async () => {
      mutations.analyzeCv.mockRejectedValueOnce(new Error('Network failure'));

      const result = await analyzeCvAction('cv_001');

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Unable to analyze your CV.',
      });
    });
  });

  describe('optimizeCvAction', () => {
    it('passes the job description through and returns the result', async () => {
      mutations.optimizeCvForJob.mockResolvedValueOnce(optimization);

      const result = await optimizeCvAction('cv_001', {
        jobDescription: 'Senior backend engineer',
      });

      expect(result).toEqual({ ok: true, data: optimization });
      expect(mutations.optimizeCvForJob).toHaveBeenCalledWith('cv_001', {
        jobDescription: 'Senior backend engineer',
      });
    });

    it('maps failures to the unknown fallback for optimization', async () => {
      mutations.optimizeCvForJob.mockRejectedValueOnce(
        new HttpError(500, 'Internal', 'Model timeout')
      );

      const result = await optimizeCvAction('cv_001', {
        jobDescription: 'x',
      });

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Unable to optimize your CV.',
      });
    });
  });
});
