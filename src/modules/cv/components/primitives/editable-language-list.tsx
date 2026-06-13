'use client';

import { Plus, Trash2 } from 'lucide-react';
import {
  useLanguageActions,
  useLanguageName,
  useLanguages,
} from '@/modules/cv/editor/editor-provider';
import type { Language, LanguageProficiency } from '@/modules/cv/data/mappers';
import { InlineEditableText } from './inline-editable-text';
import { SortableEntryList } from './sortable-entry-list';

const PROFICIENCY_OPTIONS: LanguageProficiency[] = [
  'basic',
  'intermediate',
  'advanced',
  'fluent',
  'native',
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
        className='space-y-1.5'
        renderItem={(language) => <LanguageEditor language={language} />}
      />

      <button
        type='button'
        onClick={addLanguage}
        className='mt-1.5 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-interactive-link hover:underline'
      >
        <Plus className='size-3.5' />
        Add language
      </button>
    </div>
  );
}

function LanguageEditor({ language }: { language: Language }) {
  const { value, setValue } = useLanguageName(language.id);
  const { removeLanguage, setProficiency } = useLanguageActions();

  return (
    <div className='group flex items-center gap-2'>
      <InlineEditableText
        value={value}
        onChange={setValue}
        ariaLabel='Language'
        placeholder='Language'
        className='text-xs font-medium text-content-secondary'
      />
      <select
        aria-label='Proficiency'
        value={language.proficiency}
        onChange={(event) =>
          setProficiency(language.id, event.target.value as LanguageProficiency)
        }
        className='rounded border border-subtle bg-transparent text-[10px] text-content-tertiary'
      >
        {PROFICIENCY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        type='button'
        onClick={() => removeLanguage(language.id)}
        aria-label='Remove language'
        className='ml-auto shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-opacity hover:text-feedback-error group-hover:opacity-100'
      >
        <Trash2 className='size-3' />
      </button>
    </div>
  );
}
