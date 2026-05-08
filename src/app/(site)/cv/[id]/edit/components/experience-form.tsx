'use client';

import { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { experienceSchema } from '@/lib/validations/cv';
import type { Experience } from '@/modules/cv/data/mappers';
import { GrammarCheckInline } from '@/components/common/grammar-check-inline';
import { updateSectionAction } from '@/modules/cv/data/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const formSchema = z.object({
  items: z.array(experienceSchema),
});

type FormData = z.infer<typeof formSchema>;

interface ExperienceFormProps {
  cvId: string;
  initialData: Experience[];
  onSaved: (items: Experience[]) => void;
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return '';
  return date instanceof Date ? date.toISOString().split('T')[0] : '';
}

export function ExperienceForm({
  cvId,
  initialData,
  onSaved,
}: ExperienceFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: initialData.map((exp) => ({
        company: exp.company,
        title: exp.title,
        location: exp.location ?? '',
        startDate: toDateString(exp.startDate),
        endDate: toDateString(exp.endDate),
        current: exp.current,
        description: exp.description ?? '',
        sortOrder: exp.sortOrder,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const items = data.items.map((item, index) => ({
        company: item.company,
        title: item.title,
        location: item.location || undefined,
        startDate: new Date(item.startDate).toISOString(),
        endDate: item.endDate
          ? new Date(item.endDate).toISOString()
          : undefined,
        current: item.current,
        description: item.description || undefined,
        sortOrder: index,
      }));

      const result = await updateSectionAction(cvId, 'experiences', items);

      if (result.ok) {
        toast.success(result.message ?? 'Experiences saved.');
        if (result.data) {
          onSaved(result.data);
        }
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className='space-y-4 rounded-lg border border-subtle p-4'
        >
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-content-primary'>
              Entry {index + 1}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => remove(index)}
            >
              <Trash2 className='size-4 text-destructive' />
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <FieldWrapper
              label='Company'
              error={errors.items?.[index]?.company?.message}
            >
              <Input
                {...register(`items.${index}.company`)}
                placeholder='Acme Corp'
              />
            </FieldWrapper>

            <FieldWrapper
              label='Title'
              error={errors.items?.[index]?.title?.message}
            >
              <Input
                {...register(`items.${index}.title`)}
                placeholder='Software Engineer'
              />
            </FieldWrapper>

            <FieldWrapper
              label='Location'
              error={errors.items?.[index]?.location?.message}
            >
              <Input
                {...register(`items.${index}.location`)}
                placeholder='Remote'
              />
            </FieldWrapper>

            <FieldWrapper
              label='Start Date'
              error={errors.items?.[index]?.startDate?.message}
            >
              <Input type='date' {...register(`items.${index}.startDate`)} />
            </FieldWrapper>

            <FieldWrapper
              label='End Date'
              error={errors.items?.[index]?.endDate?.message}
            >
              <Input type='date' {...register(`items.${index}.endDate`)} />
            </FieldWrapper>

            <div className='flex items-end gap-2 pb-1'>
              <label className='flex items-center gap-2 text-sm text-content-primary'>
                <input
                  type='checkbox'
                  {...register(`items.${index}.current`)}
                  className='size-4 rounded border-subtle'
                />
                Currently working here
              </label>
            </div>
          </div>

          <FieldWrapper
            label='Description'
            error={errors.items?.[index]?.description?.message}
          >
            <Textarea
              {...register(`items.${index}.description`)}
              placeholder='Describe your responsibilities...'
              rows={3}
            />
            <GrammarCheckInline
              getText={() => getValues(`items.${index}.description`) ?? ''}
              context='experience'
              emptyMessage='Write a short description for this role first.'
            />
          </FieldWrapper>
        </div>
      ))}

      <div className='flex items-center justify-between'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() =>
            append({
              company: '',
              title: '',
              location: '',
              startDate: '',
              endDate: undefined,
              current: false,
              description: '',
              sortOrder: fields.length,
            })
          }
        >
          <Plus className='size-4' />
          Add Experience
        </Button>

        <Button type='submit' size='sm' disabled={isPending}>
          {isPending && <Loader2 className='size-4 animate-spin' />}
          Save
        </Button>
      </div>
    </form>
  );
}

function FieldWrapper({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-1.5'>
      <label className='text-sm font-medium text-content-primary'>
        {label}
      </label>
      {children}
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}
