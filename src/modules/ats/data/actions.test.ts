import { scoreAts } from './mutations';
import { scoreAtsAction } from './actions';
import type { AtsScoreResult } from './mappers';
import { HttpError } from '@/shared/http/http-error';

jest.mock('./mutations', () => ({ scoreAts: jest.fn() }));

const mockResult: AtsScoreResult = {
  overallScore: 85,
  keywordMatches: [
    { keyword: 'TypeScript', found: true, importance: 'required' },
  ],
  sectionScores: [{ name: 'Skills', score: 80, feedback: 'Good coverage.' }],
  missingKeywords: ['GraphQL'],
  suggestions: ['Add GraphQL experience'],
  keywordMatchRate: 0.9,
};

beforeEach(() => jest.clearAllMocks());

describe('scoreAtsAction', () => {
  it('returns ok:true with the ATS score result on success', async () => {
    jest.mocked(scoreAts).mockResolvedValue(mockResult);

    const result = await scoreAtsAction({
      cvText: 'My CV text',
      jobDescription: 'Job description text',
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(mockResult);
  });

  it('returns ok:false with code:unauthorized on a 401 error', async () => {
    jest
      .mocked(scoreAts)
      .mockRejectedValue(new HttpError(401, 'Unauthorized', 'Token expired'));

    const result = await scoreAtsAction({
      cvText: 'cv',
      jobDescription: 'jd',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('unauthorized');
      expect(result.message).toBe('Token expired');
    }
  });

  it('returns ok:false with code:unknown on an unexpected error', async () => {
    jest.mocked(scoreAts).mockRejectedValue(new Error('Network failure'));

    const result = await scoreAtsAction({
      cvText: 'cv',
      jobDescription: 'jd',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('unknown');
  });
});
