"use server";

import { revalidatePath } from "next/cache";
import {
  toFailureResult,
  type ActionFailureResult,
  type ActionResult,
} from "@/shared/action-result";
import type {
  CreateCvRequest,
  ImportLinkedInToCvRequest,
  ShareCvRequest,
  UpdateCvRequest,
  UpsertLayoutRequest,
  UpsertPersonalInfoRequest,
} from "./contracts";
import {
  createCv,
  deleteCv,
  duplicateCv,
  importCvFromFile,
  importLinkedInProfile,
  importLinkedInToCv,
  exportCvPdf,
  shareCv,
  unshareCv,
  updateCertifications,
  updateCv,
  updateCustomSections,
  updateCvLayout,
  updateEducation,
  updateExperiences,
  updateLanguages,
  updatePersonalInfo,
  updateProjects,
  updateSkills,
  assertSafeCvId,
} from "./mutations";
import { getCvShareInfo } from "./queries";
import type {
  Certification,
  CustomSection,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  SectionLayout,
  Skill,
  CvShareInfo,
} from "./mappers";
import type {
  CertificationItemRequest,
  CustomSectionItemRequest,
  EducationItemRequest,
  ExperienceItemRequest,
  LanguageItemRequest,
  ProjectItemRequest,
  SkillItemRequest,
} from "./contracts";

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
    revalidatePath("/dashboard");

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(error, "Unable to create your CV right now.");
  }
}

export async function updateCvAction(
  id: string,
  input: UpdateCvRequest
): Promise<ActionResult> {
  try {
    await updateCv(id, input);

    return { ok: true, message: "CV updated successfully." };
  } catch (error) {
    return toFailureResult(error, "Unable to update your CV right now.");
  }
}

export async function deleteCvAction(id: string): Promise<ActionResult> {
  try {
    await deleteCv(id);
    revalidatePath("/dashboard");

    return { ok: true, message: "CV deleted successfully." };
  } catch (error) {
    return toFailureResult(error, "Unable to delete your CV right now.");
  }
}

export async function duplicateCvAction(id: string): Promise<ActionResult> {
  try {
    const cv = await duplicateCv(id);
    revalidatePath("/dashboard");

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(error, "Unable to duplicate your CV right now.");
  }
}

// ─── Section actions ──────────────────────────────────────────────────────────

export async function updatePersonalInfoAction(
  cvId: string,
  data: UpsertPersonalInfoRequest
): Promise<ActionResult<PersonalInfo>> {
  try {
    const personalInfo = await updatePersonalInfo(cvId, data);

    return { ok: true, message: "Personal info updated.", data: personalInfo };
  } catch (error) {
    return toFailureResult(error, "Unable to update personal info right now.");
  }
}

type SectionName =
  | "experiences"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "languages"
  | "custom-sections";

type SectionDataMap = {
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  "custom-sections": CustomSection[];
};

export async function updateSectionAction<T extends SectionName>(
  cvId: string,
  section: T,
  items: unknown[]
): Promise<ActionResult<SectionDataMap[T]>> {
  try {
    let data: unknown;
    switch (section) {
      case "experiences":
        data = await updateExperiences(cvId, items as ExperienceItemRequest[]);
        break;
      case "education":
        data = await updateEducation(cvId, items as EducationItemRequest[]);
        break;
      case "skills":
        data = await updateSkills(cvId, items as SkillItemRequest[]);
        break;
      case "certifications":
        data = await updateCertifications(
          cvId,
          items as CertificationItemRequest[]
        );
        break;
      case "projects":
        data = await updateProjects(cvId, items as ProjectItemRequest[]);
        break;
      case "languages":
        data = await updateLanguages(cvId, items as LanguageItemRequest[]);
        break;
      case "custom-sections":
        data = await updateCustomSections(
          cvId,
          items as CustomSectionItemRequest[]
        );
        break;
      default: {
        const _exhaustive: never = section;
        return {
          ok: false,
          code: "unknown",
          message: `Unknown section: ${_exhaustive}`,
        };
      }
    }

    return {
      ok: true,
      message: "Section updated successfully.",
      data: data as SectionDataMap[T],
    };
  } catch (error) {
    return toFailureResult(error, "Unable to update this section right now.");
  }
}

// Full-replace of the section layout. Drives autosave from the editor — no
// revalidatePath: the editor owns optimistic state, and revalidating would fight
// it (the section actions follow the same no-revalidate model).
export async function updateCvLayoutAction(
  cvId: string,
  layout: UpsertLayoutRequest
): Promise<ActionResult<SectionLayout>> {
  try {
    const data = await updateCvLayout(cvId, layout);

    return { ok: true, message: "Layout saved.", data };
  } catch (error) {
    return toFailureResult(error, "Unable to save your layout right now.");
  }
}

// ─── Import actions ───────────────────────────────────────────────────────────

export async function importCvFromFileAction(
  file: File
): Promise<ActionResult<{ cvId: string }>> {
  try {
    const cv = await importCvFromFile(file);
    revalidatePath("/dashboard");

    return {
      ok: true,
      data: { cvId: cv.id },
      redirectTo: `/onboarding/select-template?cvId=${encodeURIComponent(cv.id)}`,
    };
  } catch (error) {
    return toFailureResult(
      error,
      "Could not import that file. Use PDF or DOCX under 5 MB, or try LinkedIn import."
    );
  }
}

export async function applyImportedCvTemplateAction(input: {
  cvId: string;
  templateId: string;
}): Promise<ActionResult> {
  try {
    assertSafeCvId(input.cvId);
    await updateCv(input.cvId, { templateId: input.templateId });
    revalidatePath("/dashboard");
    revalidatePath(`/cv/${input.cvId}/edit`);

    return { ok: true, redirectTo: `/cv/${input.cvId}/edit` };
  } catch (error) {
    return toFailureResult(
      error,
      "Unable to apply the template. Try again or open the CV from the dashboard."
    );
  }
}

export async function importLinkedInProfileAction(
  handleOrUrl: string
): Promise<ActionResult<{ importId: string }>> {
  try {
    const result = await importLinkedInProfile(handleOrUrl);
    return { ok: true, data: result };
  } catch (error) {
    return toFailureResult(
      error,
      "Unable to import your LinkedIn profile. Make sure your LinkedIn account is connected."
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
    revalidatePath("/dashboard");

    return { ok: true, redirectTo: `/cv/${cv.id}/edit` };
  } catch (error) {
    return toFailureResult(
      error,
      "Unable to import your LinkedIn data right now."
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
    return { ok: true, base64: buffer.toString("base64") };
  } catch (error) {
    return toFailureResult(error, "Unable to export PDF right now.");
  }
}

// ─── Share actions ───────────────────────────────────────────────────────────

export async function getCvShareInfoAction(
  cvId: string
): Promise<ActionResult<CvShareInfo | null>> {
  try {
    const data = await getCvShareInfo(cvId);
    return { ok: true, data };
  } catch (error) {
    return toFailureResult(error, "Unable to load share settings.");
  }
}

export async function shareCvAction(
  cvId: string,
  input: ShareCvRequest
): Promise<ActionResult<CvShareInfo>> {
  try {
    const data = await shareCv(cvId, input);
    return { ok: true, data };
  } catch (error) {
    return toFailureResult(error, "Unable to update sharing.");
  }
}

export async function unshareCvAction(cvId: string): Promise<ActionResult> {
  try {
    await unshareCv(cvId);
    return { ok: true };
  } catch (error) {
    return toFailureResult(error, "Unable to remove the share link.");
  }
}
