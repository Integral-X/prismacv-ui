import { apiClient } from '@/shared/http/api-client';
import { env } from '@/shared/config/env';
import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';
import type {
  BulkUpsertCertificationsRequest,
  BulkUpsertCustomSectionsRequest,
  BulkUpsertEducationRequest,
  BulkUpsertExperiencesRequest,
  BulkUpsertLanguagesRequest,
  BulkUpsertProjectsRequest,
  BulkUpsertSkillsRequest,
  CertificationItemRequest,
  CertificationResponseContract,
  CreateCvRequest,
  CustomSectionItemRequest,
  CustomSectionResponseContract,
  CvResponseContract,
  EducationItemRequest,
  EducationResponseContract,
  ExperienceItemRequest,
  ExperienceResponseContract,
  ImportLinkedInToCvRequest,
  LanguageItemRequest,
  LanguageResponseContract,
  PersonalInfoResponseContract,
  ProjectItemRequest,
  ProjectResponseContract,
  SkillItemRequest,
  SkillResponseContract,
  UpdateCvRequest,
  UpsertPersonalInfoRequest,
} from './contracts';
import {
  toCertification,
  toCv,
  toCustomSection,
  toEducation,
  toExperience,
  toLanguage,
  toPersonalInfo,
  toProject,
  toSkill,
  type Certification,
  type CustomSection,
  type Cv,
  type Education,
  type Experience,
  type Language,
  type PersonalInfo,
  type Project,
  type Skill,
} from './mappers';

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function executeAuthenticatedRequest<T>(
  operation: (headers: Record<string, string>) => Promise<T>
): Promise<T> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new HttpError(401, 'Unauthorized', 'Authentication required');
  }

  try {
    return await operation({ Authorization: `Bearer ${accessToken}` });
  } catch (error) {
    if (!(error instanceof HttpError) || !error.isUnauthorized) {
      throw error;
    }

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearAuthSession();
      throw error;
    }

    try {
      const { refreshUserToken } =
        await import('@/modules/auth/data/mutations');
      const refreshedSession = await refreshUserToken({ refreshToken });

      await persistAuthSession(refreshedSession, await shouldPersistSession());

      return await operation({
        Authorization: `Bearer ${refreshedSession.accessToken}`,
      });
    } catch (refreshError) {
      await clearAuthSession();
      throw refreshError;
    }
  }
}

// ─── CV mutations ─────────────────────────────────────────────────────────────

export async function createCv(body: CreateCvRequest): Promise<Cv> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<CvResponseContract, CreateCvRequest>(
      'cv',
      body,
      { headers }
    );

    return toCv(contract);
  });
}

export async function updateCv(id: string, body: UpdateCvRequest): Promise<Cv> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.patch<CvResponseContract, UpdateCvRequest>(
      `cv/${id}`,
      body,
      { headers }
    );

    return toCv(contract);
  });
}

export async function deleteCv(id: string): Promise<void> {
  return executeAuthenticatedRequest(async (headers) => {
    await apiClient.delete<void>(`cv/${id}`, { headers });
  });
}

export async function duplicateCv(id: string): Promise<Cv> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      CvResponseContract,
      Record<string, never>
    >(`cv/${id}/duplicate`, {}, { headers });

    return toCv(contract);
  });
}

// ─── Section mutations ────────────────────────────────────────────────────────

export async function updatePersonalInfo(
  cvId: string,
  body: UpsertPersonalInfoRequest
): Promise<PersonalInfo> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.put<
      PersonalInfoResponseContract,
      UpsertPersonalInfoRequest
    >(`cv/${cvId}/personal-info`, body, { headers });

    return toPersonalInfo(contract);
  });
}

export async function updateExperiences(
  cvId: string,
  items: ExperienceItemRequest[]
): Promise<Experience[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const contracts = await apiClient.put<
      ExperienceResponseContract[],
      BulkUpsertExperiencesRequest
    >(`cv/${cvId}/experiences`, { items }, { headers });

    return contracts.map(toExperience);
  });
}

export async function updateEducation(
  cvId: string,
  items: EducationItemRequest[]
): Promise<Education[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const contracts = await apiClient.put<
      EducationResponseContract[],
      BulkUpsertEducationRequest
    >(`cv/${cvId}/education`, { items }, { headers });

    return contracts.map(toEducation);
  });
}

export async function updateSkills(
  cvId: string,
  items: SkillItemRequest[]
): Promise<Skill[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const contracts = await apiClient.put<
      SkillResponseContract[],
      BulkUpsertSkillsRequest
    >(`cv/${cvId}/skills`, { items }, { headers });

    return contracts.map(toSkill);
  });
}

export async function updateCertifications(
  cvId: string,
  items: CertificationItemRequest[]
): Promise<Certification[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const contracts = await apiClient.put<
      CertificationResponseContract[],
      BulkUpsertCertificationsRequest
    >(`cv/${cvId}/certifications`, { items }, { headers });

    return contracts.map(toCertification);
  });
}

export async function updateProjects(
  cvId: string,
  items: ProjectItemRequest[]
): Promise<Project[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const contracts = await apiClient.put<
      ProjectResponseContract[],
      BulkUpsertProjectsRequest
    >(`cv/${cvId}/projects`, { items }, { headers });

    return contracts.map(toProject);
  });
}

export async function updateLanguages(
  cvId: string,
  items: LanguageItemRequest[]
): Promise<Language[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const contracts = await apiClient.put<
      LanguageResponseContract[],
      BulkUpsertLanguagesRequest
    >(`cv/${cvId}/languages`, { items }, { headers });

    return contracts.map(toLanguage);
  });
}

export async function updateCustomSections(
  cvId: string,
  items: CustomSectionItemRequest[]
): Promise<CustomSection[]> {
  return executeAuthenticatedRequest(async (headers) => {
    const contracts = await apiClient.put<
      CustomSectionResponseContract[],
      BulkUpsertCustomSectionsRequest
    >(`cv/${cvId}/custom-sections`, { items }, { headers });

    return contracts.map(toCustomSection);
  });
}

// ─── Import / Export ──────────────────────────────────────────────────────────

export async function importLinkedInToCv(
  body: ImportLinkedInToCvRequest
): Promise<Cv> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      CvResponseContract,
      ImportLinkedInToCvRequest
    >('cv/import/linkedin', body, { headers });

    return toCv(contract);
  });
}

export async function exportCvPdf(cvId: string): Promise<Blob> {
  return executeAuthenticatedRequest(async (headers) => {
    const baseUrl = env.apiBaseUrl.endsWith('/')
      ? env.apiBaseUrl
      : `${env.apiBaseUrl}/`;
    const url = `${baseUrl}cv/${cvId}/export/pdf`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...headers,
        Accept: 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new HttpError(
        response.status,
        response.statusText,
        'Failed to export PDF'
      );
    }

    return response.blob();
  });
}
