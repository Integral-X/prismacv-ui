'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  useSkillActions,
  useSkillField,
  useSkills,
} from '@/modules/cv/editor/editor-provider';
import type { Skill } from '@/modules/cv/data/mappers';
import { groupSkillsByCategory } from '@/modules/cv/components/templates/resume-sections';
import { InlineEditableText } from './inline-editable-text';

/**
 * Inline editor for skills, rendered on the document in edit mode. Mirrors the
 * read-only preview: skills are click-to-edit chips grouped under an editable
 * category label, so editing matches what the finished CV shows.
 */
export function EditableSkillList({ accentColor }: { accentColor: string }) {
  const skills = useSkills();
  const { addSkill } = useSkillActions();
  const groups = groupSkillsByCategory(skills);

  return (
    <div className='space-y-3'>
      {groups.map(([category, items]) => (
        <SkillGroupEditor
          // Re-key on the category so a committed rename remounts the group
          // (and its label editor) onto the regrouped skills.
          key={category ?? '__uncategorized__'}
          category={category}
          skills={items}
          accentColor={accentColor}
        />
      ))}

      <button
        type='button'
        onClick={() => addSkill(null)}
        className='flex cursor-pointer items-center gap-1.5 text-xs font-medium text-interactive-link hover:underline'
      >
        <Plus className='size-3.5' />
        Add skill
      </button>
    </div>
  );
}

function SkillGroupEditor({
  category,
  skills,
  accentColor,
}: {
  category: string | null;
  skills: Skill[];
  accentColor: string;
}) {
  const { addSkill, renameCategory } = useSkillActions();
  const entryIds = skills.map((skill) => skill.id);

  return (
    <div>
      <CategoryLabelEditor
        category={category}
        accentColor={accentColor}
        onCommit={(value) => renameCategory(entryIds, value)}
      />
      <div className='flex flex-wrap items-center gap-1.5'>
        {skills.map((skill) => (
          <SkillChip key={skill.id} skill={skill} />
        ))}
        <button
          type='button'
          onClick={() => addSkill(category)}
          aria-label='Add skill to this category'
          className='flex cursor-pointer items-center rounded border border-dashed border-subtle px-1.5 py-0.5 text-content-tertiary hover:text-content-secondary'
        >
          <Plus className='size-3' />
        </button>
      </div>
    </div>
  );
}

/**
 * A single editable skill chip: click the name to edit in place, hover to
 * reveal the remove control. Styling tracks the read-only chip in `SkillGroups`.
 */
function SkillChip({ skill }: { skill: Skill }) {
  const { value, setValue } = useSkillField(skill.id, 'name');
  const { removeSkill } = useSkillActions();

  return (
    <span className='group/chip inline-flex items-center gap-1 rounded border border-subtle px-2 py-0.5 text-xs text-content-secondary'>
      <InlineEditableText
        value={value}
        onChange={setValue}
        ariaLabel='Skill name'
        placeholder='Skill'
        className='text-xs'
      />
      <button
        type='button'
        onClick={() => removeSkill(skill.id)}
        aria-label='Remove skill'
        className='shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-opacity hover:text-feedback-error group-hover/chip:opacity-100'
      >
        <X className='size-3' />
      </button>
    </span>
  );
}

/**
 * The category heading for a chip group. Holds a local draft and commits on blur
 * — the grouping is derived from the category, so committing per keystroke would
 * regroup mid-edit and steal focus. Remounts (via the group key) reset the draft
 * from the canonical value.
 */
function CategoryLabelEditor({
  category,
  accentColor,
  onCommit,
}: {
  category: string | null;
  accentColor: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(category ?? '');

  return (
    <input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft.trim() !== (category ?? '')) onCommit(draft);
      }}
      placeholder='Category'
      aria-label='Skill category'
      className='mb-1.5 w-full bg-transparent text-xs font-semibold outline-none placeholder:font-normal placeholder:text-content-tertiary'
      style={{ color: accentColor }}
    />
  );
}
