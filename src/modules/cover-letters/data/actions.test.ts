import { HttpError } from '@/shared/http/http-error';
import {
  createCoverLetterAction,
  deleteCoverLetterAction,
  generateCoverLetterAction,
  updateCoverLetterAction,
} from './actions';
import type { CoverLetter } from './mappers';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('./mutations', () => ({
  createCoverLetter: jest.fn(),
  updateCoverLetter: jest.fn(),
  deleteCoverLetter: jest.fn(),
  generateCoverLetter: jest.fn(),
}));

const mutations = jest.requireMock('./mutations') as {
  createCoverLetter: jest.Mock;
  updateCoverLetter: jest.Mock;
  deleteCoverLetter: jest.Mock;
  generateCoverLetter: jest.Mock;
};

const { revalidatePath } = jest.requireMock('next/cache') as {
  revalidatePath: jest.Mock;
};

const letter: CoverLetter = {
  id: 'cl_001',
  userId: 'user_001',
  cvId: 'cv_001',
  title: 'Application for Acme',
  content: 'Dear hiring manager...',
  jobTitle: 'Senior Engineer',
  company: 'Acme Corp',
  tone: 'professional',
  createdAt: new Date('2026-04-01T10:00:00.000Z'),
  updatedAt: new Date('2026-04-01T10:00:00.000Z'),
};

describe('cover-letters actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCoverLetterAction', () => {
    it('returns the created letter and revalidates the list', async () => {
      mutations.createCoverLetter.mockResolvedValueOnce(letter);

      const result = await createCoverLetterAction({
        title: 'Application for Acme',
      });

      expect(result).toEqual({ ok: true, data: letter });
      expect(revalidatePath).toHaveBeenCalledWith('/cover-letters');
    });

    it('maps a 401 HttpError to unauthorized and skips revalidation', async () => {
      mutations.createCoverLetter.mockRejectedValueOnce(
        new HttpError(401, 'Unauthorized', 'Session expired')
      );

      const result = await createCoverLetterAction({ title: 'x' });

      expect(result).toEqual({
        ok: false,
        code: 'unauthorized',
        message: 'Session expired',
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it('maps a generic error to the unknown fallback', async () => {
      mutations.createCoverLetter.mockRejectedValueOnce(new Error('boom'));

      const result = await createCoverLetterAction({ title: 'x' });

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Failed to create cover letter',
      });
    });
  });

  describe('updateCoverLetterAction', () => {
    it('returns the updated letter and revalidates both the list and detail pages', async () => {
      mutations.updateCoverLetter.mockResolvedValueOnce(letter);

      const result = await updateCoverLetterAction('cl_001', {
        title: 'Revised title',
      });

      expect(result).toEqual({ ok: true, data: letter });
      expect(revalidatePath).toHaveBeenCalledWith('/cover-letters');
      expect(revalidatePath).toHaveBeenCalledWith('/cover-letters/cl_001/edit');
    });

    it('maps a 404 HttpError to not_found', async () => {
      mutations.updateCoverLetter.mockRejectedValueOnce(
        new HttpError(404, 'Not Found', 'Cover letter not found')
      );

      const result = await updateCoverLetterAction('cl_missing', {});

      expect(result).toEqual({
        ok: false,
        code: 'not_found',
        message: 'Cover letter not found',
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe('deleteCoverLetterAction', () => {
    it('returns ok and revalidates the list', async () => {
      mutations.deleteCoverLetter.mockResolvedValueOnce(undefined);

      const result = await deleteCoverLetterAction('cl_001');

      expect(result).toEqual({ ok: true });
      expect(revalidatePath).toHaveBeenCalledWith('/cover-letters');
    });

    it('maps a 403 HttpError to forbidden', async () => {
      mutations.deleteCoverLetter.mockRejectedValueOnce(
        new HttpError(403, 'Forbidden', 'Not your cover letter')
      );

      const result = await deleteCoverLetterAction('cl_001');

      expect(result).toEqual({
        ok: false,
        code: 'forbidden',
        message: 'Not your cover letter',
      });
    });
  });

  describe('generateCoverLetterAction', () => {
    it('returns the generated content without revalidating', async () => {
      mutations.generateCoverLetter.mockResolvedValueOnce({
        content: 'Generated body',
        highlights: ['Tailored to the role'],
      });

      const result = await generateCoverLetterAction({
        cvId: 'cv_001',
        jobTitle: 'Senior Engineer',
        template: 'impact_story',
      });

      expect(result).toEqual({
        ok: true,
        data: {
          content: 'Generated body',
          highlights: ['Tailored to the role'],
        },
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it('maps a generic error to the generate fallback message', async () => {
      mutations.generateCoverLetter.mockRejectedValueOnce(
        new Error('Model timeout')
      );

      const result = await generateCoverLetterAction({ cvId: 'cv_001' });

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Failed to generate cover letter',
      });
    });
  });
});
