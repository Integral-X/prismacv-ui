import type { CvSuggestion } from '@/modules/ai/data/mappers';
import type { EditorDocument } from './editor-model';

/**
 * A resolved, applicable AI suggestion: the exact draft location its
 * `suggestedText` should be written to. The summary is the one single-value
 * text field; description suggestions are matched to a specific entry by their
 * `originalText` so we never guess which entry the AI meant.
 */
export type SuggestionTarget =
  | { kind: 'summary' }
  | {
      kind: 'description';
      section: 'experiences' | 'projects' | 'education';
      entryId: string;
    };

/** Collapse whitespace + case so AI-echoed originals match the stored text. */
function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Map an AI suggestion to a concrete draft field, or return `null` when it
 * cannot be applied deterministically (no suggested text, or a description whose
 * original does not match any entry). The caller only offers an Apply control
 * when this resolves — unresolvable suggestions stay informational.
 */
export function resolveSuggestionTarget(
  doc: EditorDocument,
  suggestion: CvSuggestion
): SuggestionTarget | null {
  if (!suggestion.suggestedText || !suggestion.suggestedText.trim()) {
    return null;
  }

  const section = suggestion.section.toLowerCase();
  if (section.includes('summary') || section.includes('profile')) {
    return { kind: 'summary' };
  }

  // Description rewrites carry the original text; match it to an entry so the
  // rewrite lands on the right one rather than the first of its section.
  if (!suggestion.originalText || !suggestion.originalText.trim()) {
    return null;
  }
  const original = normalize(suggestion.originalText);

  const lists = [
    { section: 'experiences', entries: doc.experiences },
    { section: 'projects', entries: doc.projects },
    { section: 'education', entries: doc.education },
  ] as const;

  for (const list of lists) {
    const match = list.entries.find(
      (entry) => entry.description && normalize(entry.description) === original
    );
    if (match) {
      return { kind: 'description', section: list.section, entryId: match.id };
    }
  }

  return null;
}
