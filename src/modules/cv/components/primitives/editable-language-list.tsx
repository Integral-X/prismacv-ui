"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  useLanguageActions,
  useLanguageName,
  useLanguages,
} from "@/modules/cv/editor/editor-provider";
import type { Language, LanguageProficiency } from "@/modules/cv/data/mappers";
import { InlineEditableText } from "./inline-editable-text";
import { SortableEntryList } from "./sortable-entry-list";

const PROFICIENCY_OPTIONS: LanguageProficiency[] = [
  "basic",
  "intermediate",
  "advanced",
  "fluent",
  "native",
];

/** Inline editor for the language list. */
export function EditableLanguageList() {
  const languages = useLanguages();
  const { addLanguage, reorder } = useLanguageActions();

  return (
    <div>
      <SortableEntryList
        items={languages}
        onReorder={reorder}
        className="space-y-1.5"
        renderItem={(language) => <LanguageEditor language={language} />}
      />

      <button
        type="button"
        onClick={addLanguage}
        className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-medium text-primary transition duration-150 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
      >
        <Plus className="size-3.5" />
        Add language
      </button>
    </div>
  );
}

function LanguageEditor({ language }: { language: Language }) {
  const { value, setValue } = useLanguageName(language.id);
  const { removeLanguage, setProficiency } = useLanguageActions();

  return (
    <div className="group flex items-center gap-2">
      <InlineEditableText
        value={value}
        onChange={setValue}
        ariaLabel="Language"
        placeholder="Language"
        className="text-xs font-medium text-content-secondary"
      />
      <select
        aria-label="Proficiency"
        value={language.proficiency}
        onChange={(event) =>
          setProficiency(language.id, event.target.value as LanguageProficiency)
        }
        className="cursor-pointer rounded-full border border-subtle bg-surface-card px-2 py-0.5 text-[10px] capitalize text-content-secondary outline-none transition duration-150 hover:border-primary/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
      >
        {PROFICIENCY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => removeLanguage(language.id)}
        aria-label="Remove language"
        className="ml-auto shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-all duration-150 hover:scale-110 hover:text-feedback-error active:scale-90 group-hover:opacity-100"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}
