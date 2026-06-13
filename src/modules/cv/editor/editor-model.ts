import type {
  Certification,
  Cv,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  Skill,
} from '@/modules/cv/data/mappers';
import type {
  CertificationItemRequest,
  EducationItemRequest,
  ExperienceItemRequest,
  LanguageItemRequest,
  LanguageProficiencyContract,
  ProjectItemRequest,
  SkillItemRequest,
  SkillLevelContract,
  UpsertPersonalInfoRequest,
} from '@/modules/cv/data/contracts';

/**
 * The editor document model — a form-draft view of a CV held in the editor
 * store for the duration of an edit session. It is NOT a server cache: the
 * backend stays authoritative, and every section maps back 1:1 to its existing
 * section PUT payload. Reorder/normalisation of entries arrives with drag
 * (roadmap Phase 5); until a consumer needs it, sections stay as domain arrays.
 */

export type SectionKey =
  | 'personalInfo'
  | 'experiences'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'languages';

export const SECTION_KEYS: readonly SectionKey[] = [
  'personalInfo',
  'experiences',
  'education',
  'skills',
  'certifications',
  'projects',
  'languages',
];

export interface EditorDocument {
  cvId: string;
  templateId: string | null;
  personalInfo: PersonalInfo | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
}

/** Editable scalar fields of personal info (everything except the id). */
export type PersonalInfoField = Exclude<keyof PersonalInfo, 'id'>;

/** Plain-text editable fields of an experience entry. */
export type ExperienceTextField =
  | 'company'
  | 'title'
  | 'location'
  | 'description';

/** Plain-text editable fields of an education entry. */
export type EducationTextField =
  | 'institution'
  | 'degree'
  | 'field'
  | 'gpa'
  | 'description';

/** Plain-text editable fields of a project entry. */
export type ProjectTextField = 'name' | 'url' | 'description';

/** Plain-text editable fields of a certification entry. */
export type CertificationTextField = 'name' | 'issuer' | 'credentialUrl';

/** Plain-text editable fields of a skill entry. */
export type SkillTextField = 'name' | 'category';

export function toEditorDocument(cv: Cv): EditorDocument {
  return {
    cvId: cv.id,
    templateId: cv.templateId,
    personalInfo: cv.personalInfo,
    experiences: cv.experiences,
    education: cv.education,
    skills: cv.skills,
    certifications: cv.certifications,
    projects: cv.projects,
    languages: cv.languages,
  };
}

/**
 * Project the live editor document back onto the source CV so the preview can
 * render in-progress inline edits. Fields the editor doesn't own (title, slug,
 * status, customSections, …) pass through from `cv` untouched.
 */
export function toLiveCv(cv: Cv, doc: EditorDocument): Cv {
  return {
    ...cv,
    templateId: doc.templateId,
    personalInfo: doc.personalInfo,
    experiences: doc.experiences,
    education: doc.education,
    skills: doc.skills,
    certifications: doc.certifications,
    projects: doc.projects,
    languages: doc.languages,
  };
}

export function emptyPersonalInfo(): PersonalInfo {
  return {
    id: '',
    fullName: null,
    email: null,
    phone: null,
    location: null,
    website: null,
    linkedinUrl: null,
    summary: null,
    avatarUrl: null,
  };
}

export function emptyExperience(id: string, sortOrder: number): Experience {
  return {
    id,
    company: '',
    title: '',
    location: null,
    startDate: new Date(),
    endDate: null,
    current: false,
    description: null,
    sortOrder,
  };
}

export function emptyEducation(id: string, sortOrder: number): Education {
  return {
    id,
    institution: '',
    degree: '',
    field: null,
    startDate: new Date(),
    endDate: null,
    gpa: null,
    description: null,
    sortOrder,
  };
}

export function emptyProject(id: string, sortOrder: number): Project {
  return {
    id,
    name: '',
    description: null,
    url: null,
    startDate: null,
    endDate: null,
    sortOrder,
  };
}

export function emptyCertification(
  id: string,
  sortOrder: number
): Certification {
  return {
    id,
    name: '',
    issuer: null,
    issueDate: null,
    expiryDate: null,
    credentialUrl: null,
    sortOrder,
  };
}

export function emptySkill(id: string, sortOrder: number): Skill {
  return { id, name: '', level: 'intermediate', category: null, sortOrder };
}

export function emptyLanguage(id: string, sortOrder: number): Language {
  return { id, name: '', proficiency: 'intermediate', sortOrder };
}

function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/** Denormalise the draft's personal info back into its section PUT payload. */
export function toPersonalInfoRequest(
  info: PersonalInfo | null
): UpsertPersonalInfoRequest {
  if (!info) return {};
  return {
    fullName: nullToUndefined(info.fullName),
    email: nullToUndefined(info.email),
    phone: nullToUndefined(info.phone),
    location: nullToUndefined(info.location),
    website: nullToUndefined(info.website),
    linkedinUrl: nullToUndefined(info.linkedinUrl),
    summary: nullToUndefined(info.summary),
    avatarUrl: nullToUndefined(info.avatarUrl),
  };
}

/** Whether an experience entry has the fields the backend requires to persist. */
export function isExperienceComplete(experience: Experience): boolean {
  return (
    experience.company.trim().length > 0 && experience.title.trim().length > 0
  );
}

/**
 * Denormalise the draft's experiences into the section PUT payload. Entries
 * still missing the required company/title are dropped so a half-typed draft
 * can't fail the whole-array PUT; they persist once completed. The array index
 * of the kept entries becomes the persisted sortOrder.
 */
export function toExperienceRequests(
  experiences: Experience[]
): ExperienceItemRequest[] {
  return experiences.filter(isExperienceComplete).map((experience, index) => ({
    company: experience.company,
    title: experience.title,
    location: nullToUndefined(experience.location),
    startDate: experience.startDate.toISOString(),
    endDate: experience.endDate ? experience.endDate.toISOString() : undefined,
    current: experience.current,
    description: nullToUndefined(experience.description),
    sortOrder: index,
  }));
}

/** Whether an education entry has the fields the backend requires to persist. */
export function isEducationComplete(education: Education): boolean {
  return (
    education.institution.trim().length > 0 &&
    education.degree.trim().length > 0
  );
}

/** Denormalise the draft's education into the section PUT payload. Incomplete
 *  entries are dropped; the array index becomes the persisted sortOrder. */
export function toEducationRequests(
  education: Education[]
): EducationItemRequest[] {
  return education.filter(isEducationComplete).map((entry, index) => ({
    institution: entry.institution,
    degree: entry.degree,
    field: nullToUndefined(entry.field),
    startDate: entry.startDate.toISOString(),
    endDate: entry.endDate ? entry.endDate.toISOString() : undefined,
    gpa: nullToUndefined(entry.gpa),
    description: nullToUndefined(entry.description),
    sortOrder: index,
  }));
}

/** A name is the only field the backend requires for these list sections. */
function isNamed(entry: { name: string }): boolean {
  return entry.name.trim().length > 0;
}

export function toProjectRequests(projects: Project[]): ProjectItemRequest[] {
  return projects.filter(isNamed).map((entry, index) => ({
    name: entry.name,
    description: nullToUndefined(entry.description),
    url: nullToUndefined(entry.url),
    startDate: entry.startDate ? entry.startDate.toISOString() : undefined,
    endDate: entry.endDate ? entry.endDate.toISOString() : undefined,
    sortOrder: index,
  }));
}

export function toCertificationRequests(
  certifications: Certification[]
): CertificationItemRequest[] {
  return certifications.filter(isNamed).map((entry, index) => ({
    name: entry.name,
    issuer: nullToUndefined(entry.issuer),
    issueDate: entry.issueDate ? entry.issueDate.toISOString() : undefined,
    expiryDate: entry.expiryDate ? entry.expiryDate.toISOString() : undefined,
    credentialUrl: nullToUndefined(entry.credentialUrl),
    sortOrder: index,
  }));
}

export function toSkillRequests(skills: Skill[]): SkillItemRequest[] {
  return skills.filter(isNamed).map((entry, index) => ({
    name: entry.name,
    level: entry.level.toUpperCase() as SkillLevelContract,
    category: nullToUndefined(entry.category),
    sortOrder: index,
  }));
}

export function toLanguageRequests(
  languages: Language[]
): LanguageItemRequest[] {
  return languages.filter(isNamed).map((entry, index) => ({
    name: entry.name,
    proficiency: entry.proficiency.toUpperCase() as LanguageProficiencyContract,
    sortOrder: index,
  }));
}
