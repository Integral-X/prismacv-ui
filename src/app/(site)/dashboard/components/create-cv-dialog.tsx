'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateCvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string) => void;
  isPending: boolean;
}

export function CreateCvDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateCvDialogProps) {
  const [title, setTitle] = useState('Untitled CV');

  useEffect(() => {
    if (open) setTitle('Untitled CV');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isPending) {
        onOpenChange(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isPending, onOpenChange]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='create-cv-dialog-title'
        aria-describedby='create-cv-dialog-description'
        className='bg-surface-card mx-4 w-full max-w-md rounded-lg p-6 shadow-xl'
      >
        <h2
          id='create-cv-dialog-title'
          className='text-content-primary mb-4 text-lg font-semibold'
        >
          Create New CV
        </h2>
        <p
          id='create-cv-dialog-description'
          className='text-content-secondary mb-4 text-sm'
        >
          Give your CV a title now. You can rename it later in the editor.
        </p>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor='cv-title'
            className='text-content-secondary mb-1 block text-sm'
          >
            CV Title
          </label>
          <Input
            id='cv-title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='My CV'
            disabled={isPending}
          />
          <div className='mt-6 flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending || !title.trim()}>
              {isPending ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
