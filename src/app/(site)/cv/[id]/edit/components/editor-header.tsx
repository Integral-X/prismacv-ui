'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import type { Cv } from '@/modules/cv/data/mappers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Loader2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorHeaderProps {
  cv: Cv;
  onTitleChange: (title: string) => void;
  onStatusToggle: () => void;
  onExport: () => void;
  isPending: boolean;
}

export function EditorHeader({
  cv,
  onTitleChange,
  onStatusToggle,
  onExport,
  isPending,
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      commitTitle();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTitleDraft(cv.title);
    }
  }

  return (
    <header className='sticky top-0 z-30 border-b border-subtle bg-surface-primary'>
      <div className='mx-auto flex max-w-7xl items-center gap-4 px-4 py-3'>
        <Button variant='ghost' size='icon' asChild>
          <Link href='/dashboard'>
            <ArrowLeft className='size-5' />
          </Link>
        </Button>

        <div className='flex min-w-0 flex-1 items-center gap-2'>
          {isEditing ? (
            <Input
              ref={inputRef}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={handleKeyDown}
              className='h-8 max-w-xs text-sm font-semibold'
            />
          ) : (
            <button
              type='button'
              onClick={startEditing}
              className={cn(
                'flex items-center gap-1.5 rounded px-2 py-1',
                'text-content-primary hover:bg-surface-card',
                'text-sm font-semibold transition-colors'
              )}
            >
              <span className='truncate'>{cv.title}</span>
              <Pencil className='size-3.5 shrink-0 opacity-50' />
            </button>
          )}

          <Badge variant={cv.status === 'published' ? 'success' : 'secondary'}>
            {cv.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        </div>

        <div className='flex items-center gap-2'>
          {isPending && (
            <Loader2 className='size-4 animate-spin text-content-secondary' />
          )}

          <Button
            variant='outline'
            size='sm'
            onClick={onStatusToggle}
            disabled={isPending}
          >
            {cv.status === 'draft' ? 'Publish' : 'Unpublish'}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={onExport}
            disabled={isPending}
          >
            <Download className='size-4' />
            Export PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
