import type {
  CertificationResponseContract,
  CustomSectionResponseContract,
  CvListItemResponseContract,
  CvResponseContract,
  CvShareResponseContract,
  CvStatusContract,
  EducationResponseContract,
  ExperienceResponseContract,
  LanguageProficiencyContract,
  LanguageResponseContract,
  PaginatedCvListContract,
  PaginationMetaContract,
  PersonalInfoResponseContract,
  ProjectResponseContract,
  SectionLayoutContract,
  SkillLevelContract,
  SkillResponseContract,
  TemplateContract,
  TemplateCategory,
  TemplateLayout,
} from "./contracts";

// ─── Domain types ─────────────────────────────────────────────────────────────

export type CvStatus = "draft" | "published";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type LanguageProficiency =
  | "basic"
  | "intermediate"
  | "advanced"
  | "fluent"
  | "native";

export interface PersonalInfo {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedinUrl: string | null;
  summary: string | null;
  avatarUrl: string | null;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
  sortOrder: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startDate: Date;
  endDate: Date | null;
  gpa: string | null;
  description: string | null;
  sortOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string | null;
  sortOrder: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  credentialUrl: string | null;
  sortOrder: number;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  startDate: Date | null;
  endDate: Date | null;
  sortOrder: number;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
  sortOrder: number;
}

export interface CustomSection {
  id: string;
  title: string;
  entries: Record<string, unknown>[];
  sortOrder: number;
}

// Section keys are opaque strings (built-in keys + custom-section ids).
export interface SectionLayout {
  mainOrder: string[];
  sideOrder: string[];
  hidden: string[];
  titles: Record<string, string>;
}

export interface Cv {
  id: string;
  title: string;
  slug: string;
  status: CvStatus;
  templateId: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  personalInfo: PersonalInfo | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  customSections: CustomSection[];
  layout: SectionLayout | null;
}

export interface CvListItem {
  id: string;
  title: string;
  slug: string;
  status: CvStatus;
  templateId: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedCvList {
  items: CvListItem[];
  meta: PaginationMeta;
}

export interface CvTemplate {
  id: string;
  name: string;
  thumbnail: string;
  hasHeadshot: boolean;
  layout: TemplateLayout;
  category: TemplateCategory;
}

export interface CvShareInfo {
  id: string;
  cvId: string;
  shareSlug: string;
  isPublic: boolean;
  viewCount: number;
  downloadCount: number;
  lastViewedAt: Date | null;
  createdAt: Date;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toCvStatus(status: CvStatusContract): CvStatus {
  const map: Record<CvStatusContract, CvStatus> = {
    DRAFT: "draft",
    PUBLISHED: "published",
  };
  return map[status];
}

function toSkillLevel(level: SkillLevelContract): SkillLevel {
  const map: Record<SkillLevelContract, SkillLevel> = {
    BEGINNER: "beginner",
    INTERMEDIATE: "intermediate",
    ADVANCED: "advanced",
    EXPERT: "expert",
  };
  return map[level];
}

function toLanguageProficiency(
  proficiency: LanguageProficiencyContract
): LanguageProficiency {
  const map: Record<LanguageProficiencyContract, LanguageProficiency> = {
    BASIC: "basic",
    INTERMEDIATE: "intermediate",
    ADVANCED: "advanced",
    FLUENT: "fluent",
    NATIVE: "native",
  };
  return map[proficiency];
}

function toDateOrNull(value: string | undefined): Date | null {
  if (!value) return null;
  return new Date(value);
}

export function toPersonalInfo(
  contract: PersonalInfoResponseContract
): PersonalInfo {
  return {
    id: contract.id,
    fullName: contract.fullName ?? null,
    email: contract.email ?? null,
    phone: contract.phone ?? null,
    location: contract.location ?? null,
    website: contract.website ?? null,
    linkedinUrl: contract.linkedinUrl ?? null,
    summary: contract.summary ?? null,
    avatarUrl: contract.avatarUrl ?? null,
  };
}

export function toExperience(contract: ExperienceResponseContract): Experience {
  return {
    id: contract.id,
    company: contract.company,
    title: contract.title,
    location: contract.location ?? null,
    startDate: new Date(contract.startDate),
    endDate: toDateOrNull(contract.endDate),
    current: contract.current,
    description: contract.description ?? null,
    sortOrder: contract.sortOrder,
  };
}

export function toEducation(contract: EducationResponseContract): Education {
  return {
    id: contract.id,
    institution: contract.institution,
    degree: contract.degree,
    field: contract.field ?? null,
    startDate: new Date(contract.startDate),
    endDate: toDateOrNull(contract.endDate),
    gpa: contract.gpa ?? null,
    description: contract.description ?? null,
    sortOrder: contract.sortOrder,
  };
}

export function toSkill(contract: SkillResponseContract): Skill {
  return {
    id: contract.id,
    name: contract.name,
    level: toSkillLevel(contract.level),
    category: contract.category ?? null,
    sortOrder: contract.sortOrder,
  };
}

export function toCertification(
  contract: CertificationResponseContract
): Certification {
  return {
    id: contract.id,
    name: contract.name,
    issuer: contract.issuer ?? null,
    issueDate: toDateOrNull(contract.issueDate),
    expiryDate: toDateOrNull(contract.expiryDate),
    credentialUrl: contract.credentialUrl ?? null,
    sortOrder: contract.sortOrder,
  };
}

export function toProject(contract: ProjectResponseContract): Project {
  return {
    id: contract.id,
    name: contract.name,
    description: contract.description ?? null,
    url: contract.url ?? null,
    startDate: toDateOrNull(contract.startDate),
    endDate: toDateOrNull(contract.endDate),
    sortOrder: contract.sortOrder,
  };
}

export function toLanguage(contract: LanguageResponseContract): Language {
  return {
    id: contract.id,
    name: contract.name,
    proficiency: toLanguageProficiency(contract.proficiency),
    sortOrder: contract.sortOrder,
  };
}

export function toCustomSection(
  contract: CustomSectionResponseContract
): CustomSection {
  return {
    id: contract.id,
    title: contract.title,
    entries: contract.entries,
    sortOrder: contract.sortOrder,
  };
}

export function toSectionLayout(
  contract: SectionLayoutContract
): SectionLayout {
  return {
    mainOrder: [...contract.mainOrder],
    sideOrder: [...contract.sideOrder],
    hidden: [...contract.hidden],
    titles: { ...contract.titles },
  };
}

export function toCv(contract: CvResponseContract): Cv {
  return {
    id: contract.id,
    title: contract.title,
    slug: contract.slug,
    status: toCvStatus(contract.status),
    templateId: contract.templateId ?? null,
    isDefault: contract.isDefault,
    createdAt: new Date(contract.createdAt),
    updatedAt: new Date(contract.updatedAt),
    personalInfo: contract.personalInfo
      ? toPersonalInfo(contract.personalInfo)
      : null,
    experiences: contract.experiences.map(toExperience),
    education: contract.education.map(toEducation),
    skills: contract.skills.map(toSkill),
    certifications: contract.certifications.map(toCertification),
    projects: contract.projects.map(toProject),
    languages: contract.languages.map(toLanguage),
    customSections: contract.customSections.map(toCustomSection),
    layout: contract.layout ? toSectionLayout(contract.layout) : null,
  };
}

export function toCvShareInfo(contract: CvShareResponseContract): CvShareInfo {
  return {
    id: contract.id,
    cvId: contract.cvId,
    shareSlug: contract.shareSlug,
    isPublic: contract.isPublic,
    viewCount: contract.viewCount,
    downloadCount: contract.downloadCount,
    lastViewedAt: contract.lastViewedAt
      ? new Date(contract.lastViewedAt)
      : null,
    createdAt: new Date(contract.createdAt),
  };
}

export function toCvListItem(contract: CvListItemResponseContract): CvListItem {
  return {
    id: contract.id,
    title: contract.title,
    slug: contract.slug,
    status: toCvStatus(contract.status),
    templateId: contract.templateId ?? null,
    isDefault: contract.isDefault,
    createdAt: new Date(contract.createdAt),
    updatedAt: new Date(contract.updatedAt),
  };
}

function toPaginationMeta(contract: PaginationMetaContract): PaginationMeta {
  return {
    total: contract.total,
    page: contract.page,
    limit: contract.limit,
    totalPages: contract.totalPages,
    hasNext: contract.hasNext,
    hasPrev: contract.hasPrev,
  };
}

export function toPaginatedCvList(
  contract: PaginatedCvListContract
): PaginatedCvList {
  return {
    items: contract.data.map(toCvListItem),
    meta: toPaginationMeta(contract.meta),
  };
}

export function toTemplate(contract: TemplateContract): CvTemplate {
  return {
    id: contract.id,
    name: contract.name,
    thumbnail: contract.thumbnail,
    hasHeadshot: contract.hasHeadshot,
    layout: contract.layout,
    category: contract.category,
  };
}
