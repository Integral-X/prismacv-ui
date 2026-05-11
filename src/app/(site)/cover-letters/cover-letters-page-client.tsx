'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, FileText, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CoverLetter } from '@/modules/cover-letters/data/mappers';
import {
  createCoverLetterAction,
  deleteCoverLetterAction,
} from '@/modules/cover-letters/data/actions';

interface CoverLettersPageClientProps {
  initialCoverLetters: CoverLetter[];
}

export function CoverLettersPageClient({
  initialCoverLetters,
}: CoverLettersPageClientProps) {
  const [coverLetters, setCoverLetters] =
    useState<CoverLetter[]>(initialCoverLetters);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate() {
    startTransition(async () => {
      try {
        const result = await createCoverLetterAction({
          title: 'Untitled Cover Letter',
        });

        if (result.ok && result.data) {
          setCoverLetters((prev) => [result.data!, ...prev]);
          router.push(`/cover-letters/${result.data.id}/edit`);
        } else if (result.ok) {
          toast.error('Something went wrong. Please try again.');
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error('Something went wrong. Please try again.');
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        const result = await deleteCoverLetterAction(id);

        if (result.ok) {
          setCoverLetters((prev) => prev.filter((cl) => cl.id !== id));
          toast.success('Cover letter deleted');
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error('Something went wrong. Please try again.');
      }
    });
  }

  return (
    <div className='mx-auto max-w-5xl px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-content-primary'>
            Cover Letters
          </h1>
          <p className='text-sm text-content-secondary'>
            Create tailored cover letters from your CV data
          </p>
        </div>
        <Button onClick={handleCreate} disabled={isPending}>
          <Plus className='size-4' />
          New Cover Letter
        </Button>
      </div>

      {coverLetters.length === 0 ? (
        <div className='rounded-lg border border-border-subtle bg-surface-card p-12 text-center'>
          <FileText className='mx-auto mb-4 size-12 text-content-tertiary' />
          <h2 className='text-lg font-medium text-content-primary'>
            No cover letters yet
          </h2>
          <p className='mb-4 text-sm text-content-secondary'>
            Create your first cover letter to get started
          </p>
          <Button onClick={handleCreate} disabled={isPending}>
            <Plus className='size-4' />
            Create Cover Letter
          </Button>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {coverLetters.map((cl) => (
            <div
              key={cl.id}
              className='rounded-lg border border-border-subtle bg-surface-card p-4 transition-shadow hover:shadow-md'
            >
              <div className='mb-2 flex items-start justify-between'>
                <h3 className='line-clamp-1 font-medium text-content-primary'>
                  {cl.title}
                </h3>
                <div className='flex gap-1'>
                  <Link href={`/cover-letters/${cl.id}/edit`}>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-7'
                      aria-label='Edit cover letter'
                    >
                      <Pencil className='size-3.5' />
                    </Button>
                  </Link>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-7 text-destructive'
                    onClick={() => handleDelete(cl.id)}
                    disabled={isPending}
                    aria-label='Delete cover letter'
                  >
                    <Trash2 className='size-3.5' />
                  </Button>
                </div>
              </div>
              {cl.company && (
                <p className='text-xs text-content-secondary'>
                  {cl.jobTitle ? `${cl.jobTitle} at ` : ''}
                  {cl.company}
                </p>
              )}
              <p className='mt-1 line-clamp-2 text-xs text-content-tertiary'>
                {cl.content || 'Empty'}
              </p>
              <p className='mt-2 text-xs text-content-tertiary'>
                Updated{' '}
                {cl.updatedAt.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
