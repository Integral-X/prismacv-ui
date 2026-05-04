'use server';

import { revalidatePath } from 'next/cache';
import { HttpError } from '@/shared/http/http-error';
import type {
  CreateCvRequest,
  ImportLinkedInToCvRequest,
  UpdateCvRequest,
  UpsertPersonalInfoRequest,
} from './contracts';
import {
  createCv,
  deleteCv,
  duplicateCv,
  importLinkedInProfile,
  importLinkedInToCv,
  exportCvPdf,
  updateCertifications,
  updateCv,
  updateCustomSections,
  updateEducation,
  updateExperiences,
  updateLanguages,
  updatePersonalInfo,
  updateProjects,
  updateSkills,
} from './mutations';
import type {
  Certification,
  CustomSection,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  Skill,
} from './mappers';
import type {
  CertificationItemRequest,
  CustomSectionItemRequest,
  EducationItemRequest,
  ExperienceItemRequest,
  LanguageItemRequest,
  ProjectItemRequest,
  SkillItemRequest,
} from './contracts';

// ─── Action types ─────────────────────────────────────────────────────────────

export type CvActionCode =
  | 'not_found'
  | 'forbidden'
  | 'conflict'
  | 'unauthorized'
  | 'unknown';

export interface ActionSuccessResult<T = undefined> {
  ok: true;
  message?: string;
  redirectTo?: string;
  data?: T;
}

export interface ActionFailureResult {
  ok: false;
  code: CvActionCode;
  message: string;
}

export type ActionResult<T = undefined> =
  | ActionSuccessResult<T>
  | ActionFailureResult;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    return error.serverMessage ?? error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function toFailureResult(
  error: unknown,
  fallbackMessage: string
): ActionFailureResult {
  if (error instanceof HttpError) {
    const message = getErrorMessage(error, fallbackMessage);

    if (error.isNotFound) {
      return { ok: false, code: 'not_found', message };
    }

    if (error.isForbidden) {
      return { ok: false, code: 'forbidden', message };
    }

    if (error.isConflict) {
      return { ok: false, code: 'conflict', message };
    }

    if (error.isUnauthorized) {
      return { ok: false, code: 'unauthorized', message };
    }
  }

  return {
    ok: false,
    code: 'unknown',
    message: getErrorMessage(error, fallbackMessage),
  };
}

// ─── CV actions ───────────────────────────────────────────────────────────────

export async function createCvAction(input: {
  title: string;
  templateId?: string;
}): Promise<ActionResult> {
  try {
    const body: CreateCvRequest = {
      title: input.title,
      templateId: input.templateId,
    };
    const cv = await createCv(body);
    revalidatePath('/dashboard');

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(error, 'Unable to create your CV right now.');
  }
}

export async function updateCvAction(
  id: string,
  input: UpdateCvRequest
): Promise<ActionResult> {
  try {
    await updateCv(id, input);

    return { ok: true, message: 'CV updated successfully.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to update your CV right now.');
  }
}

export async function deleteCvAction(id: string): Promise<ActionResult> {
  try {
    await deleteCv(id);
    revalidatePath('/dashboard');

    return { ok: true, message: 'CV deleted successfully.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to delete your CV right now.');
  }
}

export async function duplicateCvAction(id: string): Promise<ActionResult> {
  try {
    const cv = await duplicateCv(id);
    revalidatePath('/dashboard');

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(error, 'Unable to duplicate your CV right now.');
  }
}

// ─── Section actions ──────────────────────────────────────────────────────────

export async function updatePersonalInfoAction(
  cvId: string,
  data: UpsertPersonalInfoRequest
): Promise<ActionResult<PersonalInfo>> {
  try {
    const personalInfo = await updatePersonalInfo(cvId, data);

    return { ok: true, message: 'Personal info updated.', data: personalInfo };
  } catch (error) {
    return toFailureResult(error, 'Unable to update personal info right now.');
  }
}

type SectionName =
  | 'experiences'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'languages'
  | 'custom-sections';

type SectionDataMap = {
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  'custom-sections': CustomSection[];
};

export async function updateSectionAction<T extends SectionName>(
  cvId: string,
  section: T,
  items: unknown[]
): Promise<ActionResult<SectionDataMap[T]>> {
  try {
    let data: unknown;
    switch (section) {
      case 'experiences':
        data = await updateExperiences(cvId, items as ExperienceItemRequest[]);
        break;
      case 'education':
        data = await updateEducation(cvId, items as EducationItemRequest[]);
        break;
      case 'skills':
        data = await updateSkills(cvId, items as SkillItemRequest[]);
        break;
      case 'certifications':
        data = await updateCertifications(
          cvId,
          items as CertificationItemRequest[]
        );
        break;
      case 'projects':
        data = await updateProjects(cvId, items as ProjectItemRequest[]);
        break;
      case 'languages':
        data = await updateLanguages(cvId, items as LanguageItemRequest[]);
        break;
      case 'custom-sections':
        data = await updateCustomSections(
          cvId,
          items as CustomSectionItemRequest[]
        );
        break;
      default: {
        const _exhaustive: never = section;
        return {
          ok: false,
          code: 'unknown',
          message: `Unknown section: ${_exhaustive}`,
        };
      }
    }

    return {
      ok: true,
      message: 'Section updated successfully.',
      data: data as SectionDataMap[T],
    };
  } catch (error) {
    return toFailureResult(error, 'Unable to update this section right now.');
  }
}

// ─── Import actions ───────────────────────────────────────────────────────────

export async function importLinkedInProfileAction(
  handleOrUrl: string
): Promise<ActionResult<{ importId: string }>> {
  try {
    const result = await importLinkedInProfile(handleOrUrl);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(
      error,
      'Unable to import your LinkedIn profile. Make sure your LinkedIn account is connected.'
    );
  }
}

export async function importLinkedInToCvAction(input: {
  importId: string;
  title?: string;
  templateId?: string;
}): Promise<ActionResult> {
  try {
    const body: ImportLinkedInToCvRequest = {
      importId: input.importId,
      title: input.title,
      templateId: input.templateId,
    };
    const cv = await importLinkedInToCv(body);
    revalidatePath('/dashboard');

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(
      error,
      'Unable to import your LinkedIn data right now.'
    );
  }
}

// ─── Export action ───────────────────────────────────────────────────────────

export interface PdfExportResult {
  ok: true;
  base64: string;
}

export async function exportCvPdfAction(
  cvId: string
): Promise<PdfExportResult | ActionFailureResult> {
  try {
    const blob = await exportCvPdf(cvId);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return { ok: true, base64: buffer.toString('base64') };
  } catch (error) {
    return toFailureResult(error, 'Unable to export PDF right now.');
  }
}
