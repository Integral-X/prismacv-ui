'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import type { Cv } from '@/modules/cv/data/mappers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SaveStatusIndicator } from './save-status-indicator';
import {
  ArrowLeft,
  LayoutTemplate,
  Pencil,
  Sparkles,
  SlidersHorizontal,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type EditorPanel = 'edit' | 'analyze' | 'optimize' | 'share';

interface EditorHeaderProps {
  cv: Cv;
  onTitleChange: (title: string) => void;
  onStatusToggle: () => void;
  isPending: boolean;
  activePanel: EditorPanel | null;
  onTogglePanel: (panel: EditorPanel) => void;
}

export function EditorHeader({
  cv,
  onTitleChange,
  onStatusToggle,
  isPending,
  activePanel,
  onTogglePanel,
}: EditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(cv.title);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    setTitleDraft(cv.title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commitTitle() {
    setIsEditing(false);
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== cv.title) {
      onTitleChange(trimmed);
    } else {
      setTitleDraft(cv.title);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') commitTitle();
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTitleDraft(cv.title);
    }
  }

  return (
    <header className='sticky top-0 z-30 border-b border-subtle bg-surface-primary'>
      <div className='grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-4'>
        <div className='flex min-w-0 items-center gap-2'>
          <Button variant='ghost' size='icon' className='shrink-0' asChild>
            <Link href='/dashboard' aria-label='Back to dashboard'>
              <ArrowLeft className='size-5' />
            </Link>
          </Button>

          <div className='flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
            {isEditing ? (
              <Input
                ref={inputRef}
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={commitTitle}
                onKeyDown={handleKeyDown}
                className='h-8 w-full min-w-0 text-sm font-semibold sm:w-64'
              />
            ) : (
              <button
                type='button'
                onClick={startEditing}
                className={cn(
                  'flex min-w-0 cursor-pointer items-center gap-1.5 rounded px-2 py-1',
                  'text-content-primary hover:bg-surface-elevated',
                  'text-sm font-semibold transition-colors'
                )}
              >
                <span className='truncate'>{cv.title}</span>
                <Pencil className='size-3.5 shrink-0 opacity-50' />
              </button>
            )}
            <SaveStatusIndicator />
          </div>
        </div>

        <nav className='col-span-2 flex min-w-0 items-center gap-1 overflow-x-auto lg:col-span-1 lg:justify-center'>
          <ToolbarButton
            icon={SlidersHorizontal}
            label='Content'
            active={activePanel === 'edit'}
            onClick={() => onTogglePanel('edit')}
          />
          <ToolbarButton
            icon={Sparkles}
            label='Analyze'
            active={activePanel === 'analyze'}
            onClick={() => onTogglePanel('analyze')}
          />
          <ToolbarButton
            icon={Target}
            label='Optimize'
            active={activePanel === 'optimize'}
            onClick={() => onTogglePanel('optimize')}
          />
          <ToolbarLink
            icon={LayoutTemplate}
            label='Templates'
            href={`/cv/${cv.id}/templates`}
          />
        </nav>

        <div className='flex items-center justify-end gap-2 lg:order-3'>
          <Badge
            variant={cv.status === 'published' ? 'success' : 'secondary'}
            className='hidden sm:inline-flex'
          >
            {cv.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
          <Button
            variant='outline'
            size='sm'
            onClick={onStatusToggle}
            disabled={isPending}
          >
            {cv.status === 'draft' ? 'Publish' : 'Unpublish'}
          </Button>
        </div>
      </div>
    </header>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-surface-elevated text-content-primary'
          : 'text-content-secondary hover:bg-surface-elevated'
      )}
    >
      <Icon className='size-4' />
      <span className='hidden sm:inline'>{label}</span>
    </button>
  );
}

function ToolbarLink({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className='flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-content-secondary transition-colors hover:bg-surface-elevated'
    >
      <Icon className='size-4' />
      <span className='hidden sm:inline'>{label}</span>
    </Link>
  );
}
