import { createStore } from 'zustand/vanilla';
import type {
  Certification,
  Cv,
  Education,
  Experience,
  Language,
  LanguageProficiency,
  PersonalInfo,
  Project,
  Skill,
} from '@/modules/cv/data/mappers';
import {
  emptyCertification,
  emptyEducation,
  emptyExperience,
  emptyLanguage,
  emptyPersonalInfo,
  emptyProject,
  emptySkill,
  SECTION_KEYS,
  toEditorDocument,
  type CertificationTextField,
  type EditorDocument,
  type EducationTextField,
  type ExperienceTextField,
  type PersonalInfoField,
  type ProjectTextField,
  type SectionKey,
  type SkillTextField,
} from './editor-model';

/**
 * Per-section save lifecycle. Blind last-write-wins for v1 (no version guard,
 * so no `conflict` state — see the editor plan): a section is `unsaved` the
 * moment it is edited, `saving` while its PUT is in flight, `saved` on success,
 * and `failed` when retries are exhausted or auth expired.
 */
export type SaveState = 'saved' | 'saving' | 'unsaved' | 'failed';

export interface EditorState {
  doc: EditorDocument;
  dirtySections: Set<SectionKey>;
  sectionSave: Record<SectionKey, SaveState>;

  /** Edit a personal-info field; marks the section dirty + unsaved. */
  setPersonalInfoField: (field: PersonalInfoField, value: string) => void;
  /** Reconcile from an authoritative server result (save echo / AI accept). */
  applyPersonalInfo: (info: PersonalInfo) => void;

  /** Edit a plain-text field of one experience entry. */
  setExperienceText: (
    entryId: string,
    field: ExperienceTextField,
    value: string
  ) => void;
  setExperienceStartDate: (entryId: string, value: Date) => void;
  setExperienceEndDate: (entryId: string, value: Date | null) => void;
  setExperienceCurrent: (entryId: string, value: boolean) => void;
  /** Append a blank experience entry and mark the section dirty. */
  addExperience: () => void;
  removeExperience: (entryId: string) => void;
  /** Reconcile experiences from an authoritative server result. */
  applyExperiences: (items: Experience[]) => void;

  /** Edit a plain-text field of one education entry. */
  setEducationText: (
    entryId: string,
    field: EducationTextField,
    value: string
  ) => void;
  setEducationStartDate: (entryId: string, value: Date) => void;
  setEducationEndDate: (entryId: string, value: Date | null) => void;
  addEducation: () => void;
  removeEducation: (entryId: string) => void;
  applyEducation: (items: Education[]) => void;

  setProjectText: (
    entryId: string,
    field: ProjectTextField,
    value: string
  ) => void;
  setProjectStartDate: (entryId: string, value: Date | null) => void;
  setProjectEndDate: (entryId: string, value: Date | null) => void;
  addProject: () => void;
  removeProject: (entryId: string) => void;
  applyProjects: (items: Project[]) => void;

  setCertificationText: (
    entryId: string,
    field: CertificationTextField,
    value: string
  ) => void;
  setCertificationIssueDate: (entryId: string, value: Date | null) => void;
  setCertificationExpiryDate: (entryId: string, value: Date | null) => void;
  addCertification: () => void;
  removeCertification: (entryId: string) => void;
  applyCertifications: (items: Certification[]) => void;

  setSkillText: (entryId: string, field: SkillTextField, value: string) => void;
  /** Append a blank skill, optionally pre-assigned to a category group. */
  addSkill: (category?: string | null) => void;
  removeSkill: (entryId: string) => void;
  applySkills: (items: Skill[]) => void;

  setLanguageName: (entryId: string, value: string) => void;
  setLanguageProficiency: (entryId: string, value: LanguageProficiency) => void;
  addLanguage: () => void;
  removeLanguage: (entryId: string) => void;
  applyLanguages: (items: Language[]) => void;

  /** Reorder an entry within a list section (drag-and-drop). */
  reorderExperiences: (from: number, to: number) => void;
  reorderEducation: (from: number, to: number) => void;
  reorderProjects: (from: number, to: number) => void;
  reorderCertifications: (from: number, to: number) => void;
  reorderLanguages: (from: number, to: number) => void;

  markSaving: (section: SectionKey) => void;
  markSaved: (section: SectionKey) => void;
  markUnsaved: (section: SectionKey) => void;
  markFailed: (section: SectionKey) => void;
}

function initialSaveState(): Record<SectionKey, SaveState> {
  return Object.fromEntries(
    SECTION_KEYS.map((section) => [section, 'saved'])
  ) as Record<SectionKey, SaveState>;
}

let localExperienceCount = 0;
function nextLocalExperienceId(): string {
  localExperienceCount += 1;
  return `experience-local-${localExperienceCount}`;
}

/** Replace the experiences array, marking the section dirty + unsaved. */
function withExperiences(
  state: EditorState,
  experiences: Experience[]
): Pick<EditorState, 'doc' | 'dirtySections' | 'sectionSave'> {
  const dirtySections = new Set(state.dirtySections);
  dirtySections.add('experiences');
  return {
    doc: { ...state.doc, experiences },
    dirtySections,
    sectionSave: { ...state.sectionSave, experiences: 'unsaved' },
  };
}

function mapExperience(
  state: EditorState,
  entryId: string,
  update: (experience: Experience) => Experience
) {
  return withExperiences(
    state,
    state.doc.experiences.map((experience) =>
      experience.id === entryId ? update(experience) : experience
    )
  );
}

let localEducationCount = 0;
function nextLocalEducationId(): string {
  localEducationCount += 1;
  return `education-local-${localEducationCount}`;
}

function withEducation(
  state: EditorState,
  education: Education[]
): Pick<EditorState, 'doc' | 'dirtySections' | 'sectionSave'> {
  const dirtySections = new Set(state.dirtySections);
  dirtySections.add('education');
  return {
    doc: { ...state.doc, education },
    dirtySections,
    sectionSave: { ...state.sectionSave, education: 'unsaved' },
  };
}

function mapEducation(
  state: EditorState,
  entryId: string,
  update: (entry: Education) => Education
) {
  return withEducation(
    state,
    state.doc.education.map((entry) =>
      entry.id === entryId ? update(entry) : entry
    )
  );
}

type ListSectionKey =
  | 'experiences'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'skills'
  | 'languages';

let localEntryCount = 0;
function nextLocalId(prefix: string): string {
  localEntryCount += 1;
  return `${prefix}-local-${localEntryCount}`;
}

/** Replace a list section's array, marking the section dirty + unsaved. */
function withList<K extends ListSectionKey>(
  state: EditorState,
  section: K,
  items: EditorDocument[K]
): Pick<EditorState, 'doc' | 'dirtySections' | 'sectionSave'> {
  const dirtySections = new Set(state.dirtySections);
  dirtySections.add(section);
  return {
    doc: { ...state.doc, [section]: items },
    dirtySections,
    sectionSave: { ...state.sectionSave, [section]: 'unsaved' },
  };
}

function mapById<T extends { id: string }>(
  items: T[],
  entryId: string,
  update: (entry: T) => T
): T[] {
  return items.map((entry) => (entry.id === entryId ? update(entry) : entry));
}

/** Move an array element from one index to another, returning a new array. */
function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return next;
  next.splice(to, 0, moved);
  return next;
}

export type EditorStore = ReturnType<typeof createEditorStore>;

/**
 * Route-scoped store factory. Created per edit session via the editor provider —
 * never a module-level singleton — so it tears down on navigation and never
 * leaks state across CVs.
 */
export function createEditorStore(cv: Cv) {
  return createStore<EditorState>((set) => ({
    doc: toEditorDocument(cv),
    dirtySections: new Set<SectionKey>(),
    sectionSave: initialSaveState(),

    setPersonalInfoField: (field, value) =>
      set((state) => {
        const base = state.doc.personalInfo ?? emptyPersonalInfo();
        const nextInfo: PersonalInfo = { ...base, [field]: value };
        const dirtySections = new Set(state.dirtySections);
        dirtySections.add('personalInfo');
        return {
          doc: { ...state.doc, personalInfo: nextInfo },
          dirtySections,
          sectionSave: { ...state.sectionSave, personalInfo: 'unsaved' },
        };
      }),

    applyPersonalInfo: (info) =>
      set((state) => ({ doc: { ...state.doc, personalInfo: info } })),

    setExperienceText: (entryId, field, value) =>
      set((state) =>
        mapExperience(state, entryId, (experience) => ({
          ...experience,
          [field]: value,
        }))
      ),

    setExperienceStartDate: (entryId, value) =>
      set((state) =>
        mapExperience(state, entryId, (experience) => ({
          ...experience,
          startDate: value,
        }))
      ),

    setExperienceEndDate: (entryId, value) =>
      set((state) =>
        mapExperience(state, entryId, (experience) => ({
          ...experience,
          endDate: value,
        }))
      ),

    setExperienceCurrent: (entryId, value) =>
      set((state) =>
        mapExperience(state, entryId, (experience) => ({
          ...experience,
          current: value,
          endDate: value ? null : experience.endDate,
        }))
      ),

    addExperience: () =>
      set((state) =>
        withExperiences(state, [
          ...state.doc.experiences,
          emptyExperience(
            nextLocalExperienceId(),
            state.doc.experiences.length
          ),
        ])
      ),

    removeExperience: (entryId) =>
      set((state) =>
        withExperiences(
          state,
          state.doc.experiences.filter(
            (experience) => experience.id !== entryId
          )
        )
      ),

    applyExperiences: (items) =>
      set((state) => ({ doc: { ...state.doc, experiences: items } })),

    setEducationText: (entryId, field, value) =>
      set((state) =>
        mapEducation(state, entryId, (entry) => ({ ...entry, [field]: value }))
      ),

    setEducationStartDate: (entryId, value) =>
      set((state) =>
        mapEducation(state, entryId, (entry) => ({
          ...entry,
          startDate: value,
        }))
      ),

    setEducationEndDate: (entryId, value) =>
      set((state) =>
        mapEducation(state, entryId, (entry) => ({ ...entry, endDate: value }))
      ),

    addEducation: () =>
      set((state) =>
        withEducation(state, [
          ...state.doc.education,
          emptyEducation(nextLocalEducationId(), state.doc.education.length),
        ])
      ),

    removeEducation: (entryId) =>
      set((state) =>
        withEducation(
          state,
          state.doc.education.filter((entry) => entry.id !== entryId)
        )
      ),

    applyEducation: (items) =>
      set((state) => ({ doc: { ...state.doc, education: items } })),

    setProjectText: (entryId, field, value) =>
      set((state) =>
        withList(
          state,
          'projects',
          mapById(state.doc.projects, entryId, (entry) => ({
            ...entry,
            [field]: value,
          }))
        )
      ),
    setProjectStartDate: (entryId, value) =>
      set((state) =>
        withList(
          state,
          'projects',
          mapById(state.doc.projects, entryId, (entry) => ({
            ...entry,
            startDate: value,
          }))
        )
      ),
    setProjectEndDate: (entryId, value) =>
      set((state) =>
        withList(
          state,
          'projects',
          mapById(state.doc.projects, entryId, (entry) => ({
            ...entry,
            endDate: value,
          }))
        )
      ),
    addProject: () =>
      set((state) =>
        withList(state, 'projects', [
          ...state.doc.projects,
          emptyProject(nextLocalId('project'), state.doc.projects.length),
        ])
      ),
    removeProject: (entryId) =>
      set((state) =>
        withList(
          state,
          'projects',
          state.doc.projects.filter((entry) => entry.id !== entryId)
        )
      ),
    applyProjects: (items) =>
      set((state) => ({ doc: { ...state.doc, projects: items } })),

    setCertificationText: (entryId, field, value) =>
      set((state) =>
        withList(
          state,
          'certifications',
          mapById(state.doc.certifications, entryId, (entry) => ({
            ...entry,
            [field]: value,
          }))
        )
      ),
    setCertificationIssueDate: (entryId, value) =>
      set((state) =>
        withList(
          state,
          'certifications',
          mapById(state.doc.certifications, entryId, (entry) => ({
            ...entry,
            issueDate: value,
          }))
        )
      ),
    setCertificationExpiryDate: (entryId, value) =>
      set((state) =>
        withList(
          state,
          'certifications',
          mapById(state.doc.certifications, entryId, (entry) => ({
            ...entry,
            expiryDate: value,
          }))
        )
      ),
    addCertification: () =>
      set((state) =>
        withList(state, 'certifications', [
          ...state.doc.certifications,
          emptyCertification(
            nextLocalId('certification'),
            state.doc.certifications.length
          ),
        ])
      ),
    removeCertification: (entryId) =>
      set((state) =>
        withList(
          state,
          'certifications',
          state.doc.certifications.filter((entry) => entry.id !== entryId)
        )
      ),
    applyCertifications: (items) =>
      set((state) => ({ doc: { ...state.doc, certifications: items } })),

    setSkillText: (entryId, field, value) =>
      set((state) =>
        withList(
          state,
          'skills',
          mapById(state.doc.skills, entryId, (entry) => ({
            ...entry,
            [field]: value,
          }))
        )
      ),
    addSkill: (category) =>
      set((state) =>
        withList(state, 'skills', [
          ...state.doc.skills,
          {
            ...emptySkill(nextLocalId('skill'), state.doc.skills.length),
            category: category ?? null,
          },
        ])
      ),
    removeSkill: (entryId) =>
      set((state) =>
        withList(
          state,
          'skills',
          state.doc.skills.filter((entry) => entry.id !== entryId)
        )
      ),
    applySkills: (items) =>
      set((state) => ({ doc: { ...state.doc, skills: items } })),

    setLanguageName: (entryId, value) =>
      set((state) =>
        withList(
          state,
          'languages',
          mapById(state.doc.languages, entryId, (entry) => ({
            ...entry,
            name: value,
          }))
        )
      ),
    setLanguageProficiency: (entryId, value) =>
      set((state) =>
        withList(
          state,
          'languages',
          mapById(state.doc.languages, entryId, (entry) => ({
            ...entry,
            proficiency: value,
          }))
        )
      ),
    addLanguage: () =>
      set((state) =>
        withList(state, 'languages', [
          ...state.doc.languages,
          emptyLanguage(nextLocalId('language'), state.doc.languages.length),
        ])
      ),
    removeLanguage: (entryId) =>
      set((state) =>
        withList(
          state,
          'languages',
          state.doc.languages.filter((entry) => entry.id !== entryId)
        )
      ),
    applyLanguages: (items) =>
      set((state) => ({ doc: { ...state.doc, languages: items } })),

    reorderExperiences: (from, to) =>
      set((state) =>
        withExperiences(state, moveItem(state.doc.experiences, from, to))
      ),
    reorderEducation: (from, to) =>
      set((state) =>
        withEducation(state, moveItem(state.doc.education, from, to))
      ),
    reorderProjects: (from, to) =>
      set((state) =>
        withList(state, 'projects', moveItem(state.doc.projects, from, to))
      ),
    reorderCertifications: (from, to) =>
      set((state) =>
        withList(
          state,
          'certifications',
          moveItem(state.doc.certifications, from, to)
        )
      ),
    reorderLanguages: (from, to) =>
      set((state) =>
        withList(state, 'languages', moveItem(state.doc.languages, from, to))
      ),

    markSaving: (section) =>
      set((state) => ({
        sectionSave: { ...state.sectionSave, [section]: 'saving' },
      })),

    markSaved: (section) =>
      set((state) => {
        const dirtySections = new Set(state.dirtySections);
        dirtySections.delete(section);
        return {
          dirtySections,
          sectionSave: { ...state.sectionSave, [section]: 'saved' },
        };
      }),

    markUnsaved: (section) =>
      set((state) => ({
        sectionSave: { ...state.sectionSave, [section]: 'unsaved' },
      })),

    markFailed: (section) =>
      set((state) => ({
        sectionSave: { ...state.sectionSave, [section]: 'failed' },
      })),
  }));
}
