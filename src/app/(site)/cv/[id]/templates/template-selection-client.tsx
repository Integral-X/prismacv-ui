'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Cv, CvTemplate } from '@/modules/cv/data/mappers';
import { updateCvAction } from '@/modules/cv/data/actions';

type CategoryFilter = 'all' | 'professional' | 'modern' | 'creative';

interface TemplateSelectionClientProps {
  cv: Cv;
  templates: CvTemplate[];
}

export function TemplateSelectionClient({
  cv,
  templates,
}: TemplateSelectionClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filtered =
    activeFilter === 'all'
      ? templates
      : templates.filter((t) => t.category === activeFilter);

  function handleSelect(templateId: string) {
    if (templateId === cv.templateId) return;

    startTransition(async () => {
      const result = await updateCvAction(cv.id, { templateId });
      if (result.ok) {
        toast.success('Template updated.');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  const filters: { label: string; value: CategoryFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Professional', value: 'professional' },
    { label: 'Modern', value: 'modern' },
    { label: 'Creative', value: 'creative' },
  ];

  return (
    <div className='min-h-screen bg-surface-primary'>
      <div className='mx-auto max-w-5xl px-4 py-8'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-4'>
          <Link href={`/cv/${cv.id}/edit`}>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='mr-1 h-4 w-4' />
              Back to Editor
            </Button>
          </Link>
          <h1 className='text-xl font-semibold text-content-primary'>
            Choose a Template
          </h1>
        </div>

        {/* Filter tabs */}
        <div className='mb-6 flex gap-2'>
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={activeFilter === f.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Template grid */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((template) => {
            const isSelected = cv.templateId === template.id;

            return (
              <div
                key={template.id}
                role='button'
                tabIndex={0}
                aria-label={`Select ${template.name} template`}
                aria-pressed={isSelected ? 'true' : 'false'}
                onClick={() => handleSelect(template.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(template.id);
                  }
                }}
                className={cn(
                  'cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-md',
                  isPending && 'pointer-events-none opacity-60',
                  isSelected
                    ? 'border-brand-primary shadow-md'
                    : 'border-subtle hover:border-content-secondary'
                )}
              >
                {/* Thumbnail placeholder */}
                <div className='relative flex aspect-[210/297] items-center justify-center rounded bg-gray-200'>
                  <span className='text-sm font-medium text-gray-500'>
                    {template.name}
                  </span>
                  {isSelected && (
                    <div className='absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white'>
                      <Check className='h-3.5 w-3.5' />
                    </div>
                  )}
                </div>
                <div className='mt-2 flex items-center justify-between'>
                  <span className='text-sm font-medium text-content-primary'>
                    {template.name}
                  </span>
                  <Badge variant='outline' className='text-xs'>
                    {template.layout}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
