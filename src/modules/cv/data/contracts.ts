// ─── Shared ──────────────────────────────────────────────────────────────────

export type CvStatusContract = "DRAFT" | "PUBLISHED";

export type SkillLevelContract =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT";

export type LanguageProficiencyContract =
  | "BASIC"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "FLUENT"
  | "NATIVE";

export type TemplateLayout = "single" | "two-column";

export type TemplateCategory = "professional" | "modern" | "creative";

// ─── Response contracts ─────────────────────────────────────────────────────

export interface PersonalInfoResponseContract {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  summary?: string;
  avatarUrl?: string;
}

export interface ExperienceResponseContract {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  sortOrder: number;
}

export interface EducationResponseContract {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  sortOrder: number;
}

export interface SkillResponseContract {
  id: string;
  name: string;
  level: SkillLevelContract;
  category?: string;
  sortOrder: number;
}

export interface CertificationResponseContract {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  sortOrder: number;
}

export interface ProjectResponseContract {
  id: string;
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  sortOrder: number;
}

export interface LanguageResponseContract {
  id: string;
  name: string;
  proficiency: LanguageProficiencyContract;
  sortOrder: number;
}

export interface CustomSectionResponseContract {
  id: string;
  title: string;
  entries: Record<string, unknown>[];
  sortOrder: number;
}

// Per-CV section layout. Keys are opaque strings (built-in section keys +
// custom-section ids). See docs/backend-support-cv-editor.md § "Phase 0 — FROZEN
// contract". Backend column is nullable; `null` = never customized.
export interface SectionLayoutContract {
  mainOrder: string[];
  sideOrder: string[];
  hidden: string[];
  titles: Record<string, string>;
}

export interface CvResponseContract {
  id: string;
  title: string;
  slug: string;
  status: CvStatusContract;
  templateId?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  personalInfo?: PersonalInfoResponseContract;
  experiences: ExperienceResponseContract[];
  education: EducationResponseContract[];
  skills: SkillResponseContract[];
  certifications: CertificationResponseContract[];
  projects: ProjectResponseContract[];
  languages: LanguageResponseContract[];
  customSections: CustomSectionResponseContract[];
  layout?: SectionLayoutContract;
}

export interface CvListItemResponseContract {
  id: string;
  title: string;
  slug: string;
  status: CvStatusContract;
  templateId?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetaContract {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedCvListContract {
  data: CvListItemResponseContract[];
  meta: PaginationMetaContract;
}

export interface TemplateContract {
  id: string;
  name: string;
  thumbnail: string;
  hasHeadshot: boolean;
  layout: TemplateLayout;
  category: TemplateCategory;
}

// ─── Request contracts ──────────────────────────────────────────────────────

export interface CreateCvRequest {
  title: string;
  templateId?: string;
}

export interface UpdateCvRequest {
  title?: string;
  templateId?: string;
  status?: CvStatusContract;
  isDefault?: boolean;
}

export interface ImportLinkedInToCvRequest {
  importId: string;
  title?: string;
  templateId?: string;
}

export interface ImportLinkedInProfileRequest {
  handleOrUrl: string;
}

export interface LinkedInImportSourceContract {
  provider: string;
  importId?: string;
  handle?: string | null;
  url?: string | null;
  fetchedAt: string;
  dataScope: string[];
  warnings?: string[];
}

export interface LinkedInImportProfileContract {
  fullName?: string | null;
  headline?: string | null;
  email?: string | null;
}

export interface LinkedInImportResponseContract {
  source: LinkedInImportSourceContract;
  profile: LinkedInImportProfileContract;
}

export interface UpsertPersonalInfoRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  summary?: string;
  avatarUrl?: string;
}

export interface ExperienceItemRequest {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  sortOrder?: number;
}

export interface BulkUpsertExperiencesRequest {
  items: ExperienceItemRequest[];
}

export interface EducationItemRequest {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  sortOrder?: number;
}

export interface BulkUpsertEducationRequest {
  items: EducationItemRequest[];
}

export interface SkillItemRequest {
  name: string;
  level?: SkillLevelContract;
  category?: string;
  sortOrder?: number;
}

export interface BulkUpsertSkillsRequest {
  items: SkillItemRequest[];
}

export interface CertificationItemRequest {
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  sortOrder?: number;
}

export interface BulkUpsertCertificationsRequest {
  items: CertificationItemRequest[];
}

export interface ProjectItemRequest {
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
}

export interface BulkUpsertProjectsRequest {
  items: ProjectItemRequest[];
}

export interface LanguageItemRequest {
  name: string;
  proficiency?: LanguageProficiencyContract;
  sortOrder?: number;
}

export interface BulkUpsertLanguagesRequest {
  items: LanguageItemRequest[];
}

export interface CustomSectionItemRequest {
  title: string;
  entries: Record<string, unknown>[];
  sortOrder?: number;
}

export interface BulkUpsertCustomSectionsRequest {
  items: CustomSectionItemRequest[];
}

// Full replace of the section layout — all four fields required (send [] / {}
// when empty). Mirrors `PUT cv/:id/layout`.
export interface UpsertLayoutRequest {
  mainOrder: string[];
  sideOrder: string[];
  hidden: string[];
  titles: Record<string, string>;
}

// ─── Share ───────────────────────────────────────────────────────────────────

export interface CvShareResponseContract {
  id: string;
  cvId: string;
  shareSlug: string;
  isPublic: boolean;
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: string;
  createdAt: string;
}

export interface ShareCvRequest {
  isPublic?: boolean;
}
