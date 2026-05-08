'use client';

import { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { educationSchema } from '@/lib/validations/cv';
import type { Education } from '@/modules/cv/data/mappers';
import { GrammarCheckInline } from '@/components/common/grammar-check-inline';
import { updateSectionAction } from '@/modules/cv/data/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const formSchema = z.object({
  items: z.array(educationSchema),
});

type FormData = z.infer<typeof formSchema>;

interface EducationFormProps {
  cvId: string;
  initialData: Education[];
  onSaved: (items: Education[]) => void;
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return '';
  return date instanceof Date ? date.toISOString().split('T')[0] : '';
}

export function EducationForm({
  cvId,
  initialData,
  onSaved,
}: EducationFormProps) {
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
      items: initialData.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field ?? '',
        startDate: toDateString(edu.startDate),
        endDate: toDateString(edu.endDate),
        gpa: edu.gpa ?? '',
        description: edu.description ?? '',
        sortOrder: edu.sortOrder,
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
        institution: item.institution,
        degree: item.degree,
        field: item.field || undefined,
        startDate: new Date(item.startDate).toISOString(),
        endDate: item.endDate
          ? new Date(item.endDate).toISOString()
          : undefined,
        gpa: item.gpa || undefined,
        description: item.description || undefined,
        sortOrder: index,
      }));

      const result = await updateSectionAction(cvId, 'education', items);

      if (result.ok) {
        toast.success(result.message ?? 'Education saved.');
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
              label='Institution'
              error={errors.items?.[index]?.institution?.message}
            >
              <Input
                {...register(`items.${index}.institution`)}
                placeholder='University of...'
              />
            </FieldWrapper>

            <FieldWrapper
              label='Degree'
              error={errors.items?.[index]?.degree?.message}
            >
              <Input
                {...register(`items.${index}.degree`)}
                placeholder='B.Sc. Computer Science'
              />
            </FieldWrapper>

            <FieldWrapper
              label='Field of Study'
              error={errors.items?.[index]?.field?.message}
            >
              <Input
                {...register(`items.${index}.field`)}
                placeholder='Computer Science'
              />
            </FieldWrapper>

            <FieldWrapper
              label='GPA'
              error={errors.items?.[index]?.gpa?.message}
            >
              <Input
                {...register(`items.${index}.gpa`)}
                placeholder='3.8/4.0'
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
          </div>

          <FieldWrapper
            label='Description'
            error={errors.items?.[index]?.description?.message}
          >
            <Textarea
              {...register(`items.${index}.description`)}
              placeholder='Additional details...'
              rows={3}
            />
            <GrammarCheckInline
              getText={() => getValues(`items.${index}.description`) ?? ''}
              context='education'
              emptyMessage='Write a short description for this entry first.'
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
              institution: '',
              degree: '',
              field: '',
              startDate: '',
              endDate: undefined,
              gpa: '',
              description: '',
              sortOrder: fields.length,
            })
          }
        >
          <Plus className='size-4' />
          Add Education
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
