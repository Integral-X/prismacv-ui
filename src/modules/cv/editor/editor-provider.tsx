"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { toast } from "sonner";
import type {
  Certification,
  Cv,
  Education,
  Experience,
  Language,
  LanguageProficiency,
  Project,
  Skill,
} from "@/modules/cv/data/mappers";
import {
  updateCvLayoutAction,
  updatePersonalInfoAction,
  updateSectionAction,
} from "@/modules/cv/data/actions";
import type { ActionResult } from "@/shared/action-result";
import type { CvSuggestion } from "@/modules/ai/data/mappers";
import {
  createEditorStore,
  type EditorState,
  type EditorStore,
} from "./editor-store";
import { resolveSuggestionTarget } from "./apply-suggestion";
import {
  createAutosaveController,
  type AutosaveController,
  type AutosaveOutcome,
} from "./autosave-engine";
import {
  toCertificationRequests,
  toEducationRequests,
  toExperienceRequests,
  toLanguageRequests,
  toLayoutRequest,
  toLiveCv,
  toPersonalInfoRequest,
  toProjectRequests,
  toSkillRequests,
  type CertificationTextField,
  type EducationTextField,
  type ExperienceTextField,
  type PersonalInfoField,
  type ProjectTextField,
  type SectionKey,
  type SkillTextField,
} from "./editor-model";
import {
  DEFAULT_MAIN_ORDER,
  DEFAULT_SIDE_ORDER,
  SECTION_TITLES,
  type LayoutSectionKey,
} from "./section-layout";

interface EditorContextValue {
  store: EditorStore;
  controller: AutosaveController;
}

const EditorContext = createContext<EditorContextValue | null>(null);

/**
 * Persist one section through its existing Server Action. Optimistic by design:
 * on success we keep the local draft rather than echoing the server result, so
 * edits that landed while the PUT was in flight are never clobbered. The
 * authoritative reconciliation seam (`applyPersonalInfo`) is reserved for the
 * AI review-diff accept flow, not routine saves.
 */
function toAutosaveOutcome(result: ActionResult<unknown>): AutosaveOutcome {
  if (result.ok) return { ok: true };
  if (result.code === "unauthorized") return { ok: false, kind: "auth" };
  if (result.code === "unknown") return { ok: false, kind: "retryable" };
  return { ok: false, kind: "fatal" };
}

async function saveSection(
  section: SectionKey,
  store: EditorStore
): Promise<AutosaveOutcome> {
  const { doc } = store.getState();

  if (section === "personalInfo") {
    return toAutosaveOutcome(
      await updatePersonalInfoAction(
        doc.cvId,
        toPersonalInfoRequest(doc.personalInfo)
      )
    );
  }

  if (section === "experiences") {
    return toAutosaveOutcome(
      await updateSectionAction(
        doc.cvId,
        "experiences",
        toExperienceRequests(doc.experiences)
      )
    );
  }

  if (section === "education") {
    return toAutosaveOutcome(
      await updateSectionAction(
        doc.cvId,
        "education",
        toEducationRequests(doc.education)
      )
    );
  }

  if (section === "projects") {
    return toAutosaveOutcome(
      await updateSectionAction(
        doc.cvId,
        "projects",
        toProjectRequests(doc.projects)
      )
    );
  }

  if (section === "certifications") {
    return toAutosaveOutcome(
      await updateSectionAction(
        doc.cvId,
        "certifications",
        toCertificationRequests(doc.certifications)
      )
    );
  }

  if (section === "skills") {
    return toAutosaveOutcome(
      await updateSectionAction(doc.cvId, "skills", toSkillRequests(doc.skills))
    );
  }

  if (section === "languages") {
    return toAutosaveOutcome(
      await updateSectionAction(
        doc.cvId,
        "languages",
        toLanguageRequests(doc.languages)
      )
    );
  }

  if (section === "layout") {
    return toAutosaveOutcome(
      await updateCvLayoutAction(doc.cvId, toLayoutRequest(doc.layout))
    );
  }

  return { ok: true };
}

export function EditorProvider({
  cv,
  children,
}: {
  cv: Cv;
  children: ReactNode;
}) {
  const storeRef = useRef<EditorStore | null>(null);
  if (!storeRef.current) storeRef.current = createEditorStore(cv);
  const store = storeRef.current;

  const controllerRef = useRef<AutosaveController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = createAutosaveController({
      save: (section) => saveSection(section, store),
      onStateChange: (section, state) => {
        const actions = store.getState();
        if (state === "saving") actions.markSaving(section);
        else if (state === "saved") actions.markSaved(section);
        else if (state === "failed") actions.markFailed(section);
        else actions.markUnsaved(section);
      },
      onAuthExpired: () => {
        toast.error(
          "Your session expired. Sign in again to save your changes."
        );
      },
    });
  }
  const controller = controllerRef.current;

  // Warn before leaving with unsaved work (crash/navigation guard — no local
  // persistence, since a CV is PII and we accept losing unsaved edits on crash).
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (store.getState().dirtySections.size > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [store]);

  useEffect(() => () => controller.dispose(), [controller]);

  return (
    <EditorContext.Provider value={{ store, controller }}>
      {children}
    </EditorContext.Provider>
  );
}

function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("Editor hooks must be used within an EditorProvider.");
  }
  return context;
}

export function useEditorSelector<T>(selector: (state: EditorState) => T): T {
  const { store } = useEditorContext();
  return useStore(store, selector);
}

export function useEditorController(): AutosaveController {
  return useEditorContext().controller;
}

/**
 * The source CV with the live editor draft merged in. Subscribed to the store,
 * so the read-only preview (toggle to Preview) reflects in-progress inline edits
 * immediately rather than the last server-echoed state.
 */
export function useLiveCv(cv: Cv): Cv {
  const doc = useEditorSelector((state) => state.doc);
  return toLiveCv(cv, doc);
}

/**
 * Returns a function that flushes every dirty section's pending save. Call it
 * before a server-side read of the CV (e.g. AI analyze/optimize) so the backend
 * sees the latest inline edits rather than the last-debounced state.
 */
export function useFlushPendingEdits(): () => Promise<void> {
  const { store, controller } = useEditorContext();
  return async () => {
    const dirty = Array.from(store.getState().dirtySections);
    await Promise.all(dirty.map((section) => controller.flush(section)));
  };
}

/**
 * Returns a function that applies one AI suggestion's `suggestedText` to the
 * draft (the review-diff accept path). It writes through the same mutations as
 * manual edits — marking the section dirty and scheduling autosave — so the
 * document updates live and persists. Returns `false` when the suggestion can't
 * be mapped to a concrete field, letting the panel keep it informational.
 */
export function useApplySuggestion(): (suggestion: CvSuggestion) => boolean {
  const { store, controller } = useEditorContext();

  return (suggestion: CvSuggestion) => {
    const state = store.getState();
    const target = resolveSuggestionTarget(state.doc, suggestion);
    if (!target || !suggestion.suggestedText) return false;

    const text = suggestion.suggestedText;
    if (target.kind === "summary") {
      state.setPersonalInfoField("summary", text);
      controller.schedule("personalInfo");
      return true;
    }

    if (target.section === "experiences") {
      state.setExperienceText(target.entryId, "description", text);
    } else if (target.section === "projects") {
      state.setProjectText(target.entryId, "description", text);
    } else {
      state.setEducationText(target.entryId, "description", text);
    }
    controller.schedule(target.section);
    return true;
  };
}

/**
 * Reactively reports whether a suggestion can be applied to the current draft.
 * Re-evaluates as the document changes (e.g. after an apply rewrites the matched
 * text), so the panel can hide the Apply control once it no longer resolves.
 */
export function useCanApplySuggestion(suggestion: CvSuggestion): boolean {
  const { store } = useEditorContext();
  return useStore(
    store,
    (state) => resolveSuggestionTarget(state.doc, suggestion) !== null
  );
}

/**
 * Bind one personal-info field to the draft. Reads stay live (subscribed to the
 * store) so the document reflects keystrokes immediately; writes mark the
 * section dirty and schedule a debounced autosave.
 */
export function usePersonalInfoField(field: PersonalInfoField) {
  const { store, controller } = useEditorContext();
  const value = useStore(
    store,
    (state) => state.doc.personalInfo?.[field] ?? ""
  );

  function setValue(next: string) {
    store.getState().setPersonalInfoField(field, next);
    controller.schedule("personalInfo");
  }

  return { value, setValue };
}

/** The live experiences list from the draft. */
export function useExperiences(): Experience[] {
  const { store } = useEditorContext();
  return useStore(store, (state) => state.doc.experiences);
}

/** Bind one text field of an experience entry to the draft. */
export function useExperienceField(
  entryId: string,
  field: ExperienceTextField
) {
  const { store, controller } = useEditorContext();
  const value = useStore(store, (state) => {
    const entry = state.doc.experiences.find((item) => item.id === entryId);
    return entry ? (entry[field] ?? "") : "";
  });

  function setValue(next: string) {
    store.getState().setExperienceText(entryId, field, next);
    controller.schedule("experiences");
  }

  return { value, setValue };
}

/**
 * Structural experience edits (dates, current flag, add/remove). Adding a blank
 * entry is intentionally not scheduled — it has nothing to persist yet and would
 * only flash a no-op save; the first text edit triggers autosave.
 */
export function useExperienceActions() {
  const { store, controller } = useEditorContext();

  return {
    addExperience: () => store.getState().addExperience(),
    removeExperience: (entryId: string) => {
      store.getState().removeExperience(entryId);
      controller.schedule("experiences");
    },
    setStartDate: (entryId: string, value: Date) => {
      store.getState().setExperienceStartDate(entryId, value);
      controller.schedule("experiences");
    },
    setEndDate: (entryId: string, value: Date | null) => {
      store.getState().setExperienceEndDate(entryId, value);
      controller.schedule("experiences");
    },
    setCurrent: (entryId: string, value: boolean) => {
      store.getState().setExperienceCurrent(entryId, value);
      controller.schedule("experiences");
    },
    reorder: (from: number, to: number) => {
      store.getState().reorderExperiences(from, to);
      controller.schedule("experiences");
    },
  };
}

/** The live education list from the draft. */
export function useEducation(): Education[] {
  const { store } = useEditorContext();
  return useStore(store, (state) => state.doc.education);
}

/** Bind one text field of an education entry to the draft. */
export function useEducationField(entryId: string, field: EducationTextField) {
  const { store, controller } = useEditorContext();
  const value = useStore(store, (state) => {
    const entry = state.doc.education.find((item) => item.id === entryId);
    return entry ? (entry[field] ?? "") : "";
  });

  function setValue(next: string) {
    store.getState().setEducationText(entryId, field, next);
    controller.schedule("education");
  }

  return { value, setValue };
}

/** Structural education edits (dates, add/remove). See `useExperienceActions`. */
export function useEducationActions() {
  const { store, controller } = useEditorContext();

  return {
    addEducation: () => store.getState().addEducation(),
    removeEducation: (entryId: string) => {
      store.getState().removeEducation(entryId);
      controller.schedule("education");
    },
    setStartDate: (entryId: string, value: Date) => {
      store.getState().setEducationStartDate(entryId, value);
      controller.schedule("education");
    },
    setEndDate: (entryId: string, value: Date | null) => {
      store.getState().setEducationEndDate(entryId, value);
      controller.schedule("education");
    },
    reorder: (from: number, to: number) => {
      store.getState().reorderEducation(from, to);
      controller.schedule("education");
    },
  };
}

// ─── Projects ───────────────────────────────────────────────────────────────

export function useProjects(): Project[] {
  const { store } = useEditorContext();
  return useStore(store, (state) => state.doc.projects);
}

export function useProjectField(entryId: string, field: ProjectTextField) {
  const { store, controller } = useEditorContext();
  const value = useStore(store, (state) => {
    const entry = state.doc.projects.find((item) => item.id === entryId);
    return entry ? (entry[field] ?? "") : "";
  });
  function setValue(next: string) {
    store.getState().setProjectText(entryId, field, next);
    controller.schedule("projects");
  }
  return { value, setValue };
}

export function useProjectActions() {
  const { store, controller } = useEditorContext();
  return {
    addProject: () => store.getState().addProject(),
    removeProject: (entryId: string) => {
      store.getState().removeProject(entryId);
      controller.schedule("projects");
    },
    setStartDate: (entryId: string, value: Date | null) => {
      store.getState().setProjectStartDate(entryId, value);
      controller.schedule("projects");
    },
    setEndDate: (entryId: string, value: Date | null) => {
      store.getState().setProjectEndDate(entryId, value);
      controller.schedule("projects");
    },
    reorder: (from: number, to: number) => {
      store.getState().reorderProjects(from, to);
      controller.schedule("projects");
    },
  };
}

// ─── Certifications ──────────────────────────────────────────────────────────

export function useCertifications(): Certification[] {
  const { store } = useEditorContext();
  return useStore(store, (state) => state.doc.certifications);
}

export function useCertificationField(
  entryId: string,
  field: CertificationTextField
) {
  const { store, controller } = useEditorContext();
  const value = useStore(store, (state) => {
    const entry = state.doc.certifications.find((item) => item.id === entryId);
    return entry ? (entry[field] ?? "") : "";
  });
  function setValue(next: string) {
    store.getState().setCertificationText(entryId, field, next);
    controller.schedule("certifications");
  }
  return { value, setValue };
}

export function useCertificationActions() {
  const { store, controller } = useEditorContext();
  return {
    addCertification: () => store.getState().addCertification(),
    removeCertification: (entryId: string) => {
      store.getState().removeCertification(entryId);
      controller.schedule("certifications");
    },
    setIssueDate: (entryId: string, value: Date | null) => {
      store.getState().setCertificationIssueDate(entryId, value);
      controller.schedule("certifications");
    },
    setExpiryDate: (entryId: string, value: Date | null) => {
      store.getState().setCertificationExpiryDate(entryId, value);
      controller.schedule("certifications");
    },
    reorder: (from: number, to: number) => {
      store.getState().reorderCertifications(from, to);
      controller.schedule("certifications");
    },
  };
}

// ─── Skills ─────────────────────────────────────────────────────────────────

export function useSkills(): Skill[] {
  const { store } = useEditorContext();
  return useStore(store, (state) => state.doc.skills);
}

export function useSkillField(entryId: string, field: SkillTextField) {
  const { store, controller } = useEditorContext();
  const value = useStore(store, (state) => {
    const entry = state.doc.skills.find((item) => item.id === entryId);
    return entry ? (entry[field] ?? "") : "";
  });
  function setValue(next: string) {
    store.getState().setSkillText(entryId, field, next);
    controller.schedule("skills");
  }
  return { value, setValue };
}

export function useSkillActions() {
  const { store, controller } = useEditorContext();
  return {
    addSkill: (category?: string | null) => store.getState().addSkill(category),
    removeSkill: (entryId: string) => {
      store.getState().removeSkill(entryId);
      controller.schedule("skills");
    },
    /** Re-assign a category label across every skill in a chip group. */
    renameCategory: (entryIds: string[], category: string) => {
      const state = store.getState();
      const next = category.trim() || null;
      for (const entryId of entryIds) {
        state.setSkillText(entryId, "category", next ?? "");
      }
      controller.schedule("skills");
    },
  };
}

// ─── Languages ──────────────────────────────────────────────────────────────

export function useLanguages(): Language[] {
  const { store } = useEditorContext();
  return useStore(store, (state) => state.doc.languages);
}

export function useLanguageName(entryId: string) {
  const { store, controller } = useEditorContext();
  const value = useStore(store, (state) => {
    const entry = state.doc.languages.find((item) => item.id === entryId);
    return entry ? entry.name : "";
  });
  function setValue(next: string) {
    store.getState().setLanguageName(entryId, next);
    controller.schedule("languages");
  }
  return { value, setValue };
}

export function useLanguageActions() {
  const { store, controller } = useEditorContext();
  return {
    addLanguage: () => store.getState().addLanguage(),
    removeLanguage: (entryId: string) => {
      store.getState().removeLanguage(entryId);
      controller.schedule("languages");
    },
    setProficiency: (entryId: string, value: LanguageProficiency) => {
      store.getState().setLanguageProficiency(entryId, value);
      controller.schedule("languages");
    },
    reorder: (from: number, to: number) => {
      store.getState().reorderLanguages(from, to);
      controller.schedule("languages");
    },
  };
}

// ─── Section layout ───────────────────────────────────────────────────────────

/**
 * Section layout (column order, hidden sections) bound to the draft. Reads stay
 * live; every mutation is optimistic and schedules a debounced autosave through
 * the same engine as the section forms — so reorder/hide feels instant and a
 * failed save surfaces `failed` for retry rather than rolling back.
 */
export function useSectionLayout() {
  const { store, controller } = useEditorContext();
  const layout = useStore(store, (state) => state.doc.layout);

  function save() {
    controller.schedule("layout");
  }

  return {
    mainOrder: layout.mainOrder,
    sideOrder: layout.sideOrder,
    hiddenInMain: layout.hidden.filter((key) =>
      DEFAULT_MAIN_ORDER.includes(key)
    ),
    hiddenInSide: layout.hidden.filter((key) =>
      DEFAULT_SIDE_ORDER.includes(key)
    ),
    reorderMain: (from: number, to: number) => {
      store.getState().reorderLayoutColumn("main", from, to);
      save();
    },
    reorderSide: (from: number, to: number) => {
      store.getState().reorderLayoutColumn("side", from, to);
      save();
    },
    hideSection: (key: LayoutSectionKey) => {
      store.getState().hideLayoutSection(key);
      save();
    },
    showSection: (key: LayoutSectionKey) => {
      store.getState().showLayoutSection(key);
      save();
    },
  };
}

/** Bind one section's heading override to the draft (click-to-rename). */
export function useSectionTitle(key: LayoutSectionKey) {
  const { store, controller } = useEditorContext();
  const title = useStore(
    store,
    (state) => state.doc.layout.titles[key] ?? SECTION_TITLES[key]
  );

  function setTitle(next: string) {
    store.getState().setSectionTitle(key, next);
    controller.schedule("layout");
  }

  return { title, setTitle };
}
