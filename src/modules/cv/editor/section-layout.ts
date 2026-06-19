import type { SectionLayout } from "@/modules/cv/data/mappers";

/**
 * Section-layout constants and pure helpers for the two-column editor. The
 * layout itself lives in the editor store and autosaves through the same engine
 * as every other section (see `editor-provider`). Backend contract:
 * docs/backend-support-cv-editor.md § "Phase 0 — FROZEN contract".
 *
 * The editor renders the seven built-in sections only; custom-section layout
 * entries are out of scope until the custom-sections editor lands (roadmap
 * Phase 3). Unknown keys in a stored layout are dropped on reconcile.
 */

export type LayoutSectionKey =
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "languages";

export const SECTION_TITLES: Record<LayoutSectionKey, string> = {
  summary: "Summary",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  certifications: "Certifications",
  languages: "Languages",
};

export const DEFAULT_MAIN_ORDER: LayoutSectionKey[] = [
  "summary",
  "experience",
  "projects",
];
export const DEFAULT_SIDE_ORDER: LayoutSectionKey[] = [
  "skills",
  "education",
  "certifications",
  "languages",
];

/**
 * Editor-local layout shape. Orders/hidden are the known section keys; `titles`
 * holds heading overrides keyed by section. Invariant maintained by the store
 * and `reconcileSectionLayout`: every known key appears exactly once across
 * `mainOrder` / `sideOrder` / `hidden`.
 */
export interface EditorSectionLayout {
  mainOrder: LayoutSectionKey[];
  sideOrder: LayoutSectionKey[];
  hidden: LayoutSectionKey[];
  titles: Record<string, string>;
}

const KNOWN_KEYS = new Set<string>([
  ...DEFAULT_MAIN_ORDER,
  ...DEFAULT_SIDE_ORDER,
]);

export function isLayoutSectionKey(key: string): key is LayoutSectionKey {
  return KNOWN_KEYS.has(key);
}

export function defaultSectionLayout(): EditorSectionLayout {
  return {
    mainOrder: [...DEFAULT_MAIN_ORDER],
    sideOrder: [...DEFAULT_SIDE_ORDER],
    hidden: [],
    titles: {},
  };
}

/**
 * Build the editor's layout from a stored blob (or `null`). Filters to known
 * keys, drops duplicates, removes hidden keys from the columns, and appends any
 * built-in section the blob didn't mention to its default column — so a section
 * can never vanish from the editor.
 */
export function reconcileSectionLayout(
  stored: SectionLayout | null | undefined
): EditorSectionLayout {
  if (!stored) return defaultSectionLayout();

  const hidden = dedupeKnown(stored.hidden);
  const hiddenSet = new Set(hidden);
  const seen = new Set<LayoutSectionKey>(hidden);

  const take = (keys: string[]): LayoutSectionKey[] => {
    const out: LayoutSectionKey[] = [];
    for (const key of keys) {
      if (isLayoutSectionKey(key) && !hiddenSet.has(key) && !seen.has(key)) {
        seen.add(key);
        out.push(key);
      }
    }
    return out;
  };

  const mainOrder = take(stored.mainOrder);
  const sideOrder = take(stored.sideOrder);

  for (const key of DEFAULT_MAIN_ORDER) {
    if (!seen.has(key)) {
      seen.add(key);
      mainOrder.push(key);
    }
  }
  for (const key of DEFAULT_SIDE_ORDER) {
    if (!seen.has(key)) {
      seen.add(key);
      sideOrder.push(key);
    }
  }

  const titles: Record<string, string> = {};
  for (const [key, value] of Object.entries(stored.titles ?? {})) {
    if (isLayoutSectionKey(key) && typeof value === "string") {
      titles[key] = value;
    }
  }

  return { mainOrder, sideOrder, hidden, titles };
}

function dedupeKnown(keys: string[]): LayoutSectionKey[] {
  const seen = new Set<LayoutSectionKey>();
  const out: LayoutSectionKey[] = [];
  for (const key of keys) {
    if (isLayoutSectionKey(key) && !seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}
