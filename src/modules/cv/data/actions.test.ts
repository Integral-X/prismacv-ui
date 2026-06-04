import { HttpError } from '@/shared/http/http-error';
import {
  createCvAction,
  deleteCvAction,
  duplicateCvAction,
  exportCvPdfAction,
  importLinkedInToCvAction,
  updateCvAction,
  updatePersonalInfoAction,
  updateSectionAction,
} from './actions';
import type { Cv, PersonalInfo, Skill } from './mappers';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('./mutations', () => ({
  createCv: jest.fn(),
  updateCv: jest.fn(),
  deleteCv: jest.fn(),
  duplicateCv: jest.fn(),
  updatePersonalInfo: jest.fn(),
  updateExperiences: jest.fn(),
  updateEducation: jest.fn(),
  updateSkills: jest.fn(),
  updateCertifications: jest.fn(),
  updateProjects: jest.fn(),
  updateLanguages: jest.fn(),
  updateCustomSections: jest.fn(),
  importLinkedInToCv: jest.fn(),
  exportCvPdf: jest.fn(),
}));

const mutations = jest.requireMock('./mutations') as {
  createCv: jest.Mock;
  updateCv: jest.Mock;
  deleteCv: jest.Mock;
  duplicateCv: jest.Mock;
  updatePersonalInfo: jest.Mock;
  updateExperiences: jest.Mock;
  updateEducation: jest.Mock;
  updateSkills: jest.Mock;
  updateCertifications: jest.Mock;
  updateProjects: jest.Mock;
  updateLanguages: jest.Mock;
  updateCustomSections: jest.Mock;
  importLinkedInToCv: jest.Mock;
  exportCvPdf: jest.Mock;
};

const { revalidatePath } = jest.requireMock('next/cache') as {
  revalidatePath: jest.Mock;
};

const mockCv: Cv = {
  id: 'cv_001',
  title: 'My CV',
  slug: 'my-cv',
  status: 'draft',
  templateId: 'classic',
  isDefault: false,
  createdAt: new Date('2026-04-01T10:00:00.000Z'),
  updatedAt: new Date('2026-04-15T14:30:00.000Z'),
  personalInfo: null,
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  customSections: [],
};

const mockPersonalInfo: PersonalInfo = {
  id: 'pi_001',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: null,
  location: null,
  website: null,
  linkedinUrl: null,
  summary: null,
  avatarUrl: null,
};

const mockSkills: Skill[] = [
  {
    id: 'skill_001',
    name: 'TypeScript',
    level: 'advanced',
    category: 'Frontend',
    sortOrder: 0,
  },
  {
    id: 'skill_002',
    name: 'React',
    level: 'expert',
    category: 'Frontend',
    sortOrder: 1,
  },
];

describe('cv actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCvAction', () => {
    it('returns redirect on success and revalidates dashboard', async () => {
      mutations.createCv.mockResolvedValueOnce(mockCv);

      const result = await createCvAction({
        title: 'My CV',
        templateId: 'classic',
      });

      expect(result).toEqual({ ok: true, redirectTo: '/cv/cv_001/edit' });
      expect(mutations.createCv).toHaveBeenCalledWith({
        title: 'My CV',
        templateId: 'classic',
      });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    });

    it('maps 404 HttpError to not_found code', async () => {
      mutations.createCv.mockRejectedValueOnce(
        new HttpError(404, 'Not Found', 'CV not found')
      );

      const result = await createCvAction({ title: 'My CV' });

      expect(result).toEqual({
        ok: false,
        code: 'not_found',
        message: 'CV not found',
      });
    });

    it('maps 403 HttpError to forbidden code', async () => {
      mutations.createCv.mockRejectedValueOnce(
        new HttpError(403, 'Forbidden', 'Access denied')
      );

      const result = await createCvAction({ title: 'My CV' });

      expect(result).toEqual({
        ok: false,
        code: 'forbidden',
        message: 'Access denied',
      });
    });

    it('maps 409 HttpError to conflict code', async () => {
      mutations.createCv.mockRejectedValueOnce(
        new HttpError(409, 'Conflict', 'Already exists')
      );

      const result = await createCvAction({ title: 'My CV' });

      expect(result).toEqual({
        ok: false,
        code: 'conflict',
        message: 'Already exists',
      });
    });

    it('maps 401 HttpError to unauthorized code', async () => {
      mutations.createCv.mockRejectedValueOnce(
        new HttpError(401, 'Unauthorized', 'Token expired')
      );

      const result = await createCvAction({ title: 'My CV' });

      expect(result).toEqual({
        ok: false,
        code: 'unauthorized',
        message: 'Token expired',
      });
    });

    it('maps generic Error to unknown code with fallback message', async () => {
      mutations.createCv.mockRejectedValueOnce(new Error('Network failure'));

      const result = await createCvAction({ title: 'My CV' });

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Unable to create your CV right now.',
      });
    });

    it('uses fallback message for non-Error throws', async () => {
      mutations.createCv.mockRejectedValueOnce('string error');

      const result = await createCvAction({ title: 'My CV' });

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Unable to create your CV right now.',
      });
    });
  });

  describe('updateCvAction', () => {
    it('returns success message on update', async () => {
      mutations.updateCv.mockResolvedValueOnce(mockCv);

      const result = await updateCvAction('cv_001', { title: 'Updated' });

      expect(result).toEqual({ ok: true, message: 'CV updated successfully.' });
      expect(mutations.updateCv).toHaveBeenCalledWith('cv_001', {
        title: 'Updated',
      });
    });
  });

  describe('deleteCvAction', () => {
    it('returns success and revalidates dashboard', async () => {
      mutations.deleteCv.mockResolvedValueOnce(undefined);

      const result = await deleteCvAction('cv_001');

      expect(result).toEqual({ ok: true, message: 'CV deleted successfully.' });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('duplicateCvAction', () => {
    it('returns redirect to new CV on success', async () => {
      mutations.duplicateCv.mockResolvedValueOnce({ ...mockCv, id: 'cv_002' });

      const result = await duplicateCvAction('cv_001');

      expect(result).toEqual({ ok: true, redirectTo: '/cv/cv_002/edit' });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('updatePersonalInfoAction', () => {
    it('returns server data with real ID on success', async () => {
      mutations.updatePersonalInfo.mockResolvedValueOnce(mockPersonalInfo);

      const result = await updatePersonalInfoAction('cv_001', {
        fullName: 'John Doe',
      });

      expect(result).toEqual({
        ok: true,
        message: 'Personal info updated.',
        data: mockPersonalInfo,
      });
    });
  });

  describe('updateSectionAction', () => {
    it('returns updated skills array with server IDs', async () => {
      mutations.updateSkills.mockResolvedValueOnce(mockSkills);

      const result = await updateSectionAction('cv_001', 'skills', [
        { name: 'TypeScript', level: 'ADVANCED', sortOrder: 0 },
        { name: 'React', level: 'EXPERT', sortOrder: 1 },
      ]);

      expect(result).toEqual({
        ok: true,
        message: 'Section updated successfully.',
        data: mockSkills,
      });
    });

    it('maps errors from experience updates correctly', async () => {
      mutations.updateExperiences.mockRejectedValueOnce(
        new HttpError(404, 'Not Found', 'CV not found')
      );

      const result = await updateSectionAction('cv_001', 'experiences', []);

      expect(result).toEqual({
        ok: false,
        code: 'not_found',
        message: 'CV not found',
      });
    });
  });

  describe('importLinkedInToCvAction', () => {
    it('returns redirect on success and revalidates', async () => {
      mutations.importLinkedInToCv.mockResolvedValueOnce(mockCv);

      const result = await importLinkedInToCvAction({ importId: 'import_001' });

      expect(result).toEqual({ ok: true, redirectTo: '/cv/cv_001/edit' });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('exportCvPdfAction', () => {
    it('returns base64-encoded PDF on success', async () => {
      const pdfContent = 'PDF binary content';
      const buf = Buffer.from(pdfContent);
      const arrayBuffer = buf.buffer.slice(
        buf.byteOffset,
        buf.byteOffset + buf.byteLength
      );
      const mockBlob = { arrayBuffer: () => Promise.resolve(arrayBuffer) };
      mutations.exportCvPdf.mockResolvedValueOnce(mockBlob);

      const result = await exportCvPdfAction('cv_001');

      expect(result.ok).toBe(true);
      if (result.ok) {
        const decoded = Buffer.from(result.base64, 'base64').toString();
        expect(decoded).toBe(pdfContent);
      }
    });

    it('maps export errors to failure result', async () => {
      mutations.exportCvPdf.mockRejectedValueOnce(
        new HttpError(500, 'Internal', 'PDF generation failed')
      );

      const result = await exportCvPdfAction('cv_001');

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'PDF generation failed',
      });
    });
  });
});
