'use server';

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
  importLinkedInToCv,
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

export interface ActionSuccessResult {
  ok: true;
  message?: string;
  redirectTo?: string;
}

export interface ActionFailureResult {
  ok: false;
  code: CvActionCode;
  message: string;
}

export type ActionResult = ActionSuccessResult | ActionFailureResult;

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

    return { ok: true, message: 'CV deleted successfully.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to delete your CV right now.');
  }
}

export async function duplicateCvAction(id: string): Promise<ActionResult> {
  try {
    const cv = await duplicateCv(id);

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(error, 'Unable to duplicate your CV right now.');
  }
}

// ─── Section actions ──────────────────────────────────────────────────────────

export async function updatePersonalInfoAction(
  cvId: string,
  data: UpsertPersonalInfoRequest
): Promise<ActionResult> {
  try {
    await updatePersonalInfo(cvId, data);

    return { ok: true, message: 'Personal info updated.' };
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

export async function updateSectionAction(
  cvId: string,
  section: SectionName,
  items: unknown[]
): Promise<ActionResult> {
  try {
    switch (section) {
      case 'experiences':
        await updateExperiences(cvId, items as ExperienceItemRequest[]);
        break;
      case 'education':
        await updateEducation(cvId, items as EducationItemRequest[]);
        break;
      case 'skills':
        await updateSkills(cvId, items as SkillItemRequest[]);
        break;
      case 'certifications':
        await updateCertifications(cvId, items as CertificationItemRequest[]);
        break;
      case 'projects':
        await updateProjects(cvId, items as ProjectItemRequest[]);
        break;
      case 'languages':
        await updateLanguages(cvId, items as LanguageItemRequest[]);
        break;
      case 'custom-sections':
        await updateCustomSections(cvId, items as CustomSectionItemRequest[]);
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

    return { ok: true, message: 'Section updated successfully.' };
  } catch (error) {
    return toFailureResult(error, 'Unable to update this section right now.');
  }
}

// ─── Import action ────────────────────────────────────────────────────────────

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

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(
      error,
      'Unable to import your LinkedIn data right now.'
    );
  }
}
