import { apiClient } from '@/shared/http/api-client';
import {
  createCoverLetter,
  deleteCoverLetter,
  generateCoverLetter,
  updateCoverLetter,
} from './mutations';
import type { CoverLetterResponseContract } from './contracts';

jest.mock('@/shared/http/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/shared/auth/execute-authenticated-request', () => ({
  executeAuthenticatedRequest: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: 'Bearer test-token' })
  ),
}));

const postMock = jest.mocked(apiClient.post);
const patchMock = jest.mocked(apiClient.patch);
const deleteMock = jest.mocked(apiClient.delete);
const authHeaders = { Authorization: 'Bearer test-token' };

const letterContract: CoverLetterResponseContract = {
  id: 'cl_001',
  userId: 'user_001',
  cvId: 'cv_001',
  title: 'Application for Acme',
  content: 'Dear hiring manager...',
  jobTitle: 'Senior Engineer',
  company: 'Acme Corp',
  tone: 'professional',
  createdAt: '2026-04-01T10:00:00.000Z',
  updatedAt: '2026-04-01T10:00:00.000Z',
};

describe('cover-letters mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCoverLetter', () => {
    it('posts the body and maps the created cover letter', async () => {
      postMock.mockResolvedValueOnce(letterContract);

      const result = await createCoverLetter({ title: 'Application for Acme' });

      expect(postMock).toHaveBeenCalledWith(
        'cover-letters',
        { title: 'Application for Acme' },
        { headers: authHeaders }
      );
      expect(result.id).toBe('cl_001');
      expect(result.createdAt).toEqual(new Date('2026-04-01T10:00:00.000Z'));
    });
  });

  describe('updateCoverLetter', () => {
    it('patches the cover letter by id and maps the result', async () => {
      patchMock.mockResolvedValueOnce({
        ...letterContract,
        title: 'Revised title',
      });

      const result = await updateCoverLetter('cl_001', {
        title: 'Revised title',
      });

      expect(patchMock).toHaveBeenCalledWith(
        'cover-letters/cl_001',
        { title: 'Revised title' },
        { headers: authHeaders }
      );
      expect(result.title).toBe('Revised title');
    });
  });

  describe('deleteCoverLetter', () => {
    it('sends a delete request for the cover letter', async () => {
      deleteMock.mockResolvedValueOnce(undefined);

      await deleteCoverLetter('cl_001');

      expect(deleteMock).toHaveBeenCalledWith('cover-letters/cl_001', {
        headers: authHeaders,
      });
    });
  });

  describe('generateCoverLetter', () => {
    it('posts the generation request and returns the raw generated content', async () => {
      postMock.mockResolvedValueOnce({
        content: 'Generated body',
        highlights: ['Tailored to the role'],
      });

      const result = await generateCoverLetter({
        cvId: 'cv_001',
        jobTitle: 'Senior Engineer',
        template: 'impact_story',
      });

      expect(postMock).toHaveBeenCalledWith(
        'cover-letters/generate',
        {
          cvId: 'cv_001',
          jobTitle: 'Senior Engineer',
          template: 'impact_story',
        },
        { headers: authHeaders }
      );
      expect(result.content).toBe('Generated body');
      expect(result.highlights).toEqual(['Tailored to the role']);
    });
  });
});
