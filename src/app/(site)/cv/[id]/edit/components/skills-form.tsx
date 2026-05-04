'use client';

import { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { skillSchema } from '@/lib/validations/cv';
import type { Skill } from '@/modules/cv/data/mappers';
import { updateSectionAction } from '@/modules/cv/data/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  items: z.array(skillSchema),
});

type FormData = z.infer<typeof formSchema>;

const LEVEL_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
] as const;

interface SkillsFormProps {
  cvId: string;
  initialData: Skill[];
  onSaved: (items: Skill[]) => void;
}

export function SkillsForm({ cvId, initialData, onSaved }: SkillsFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: initialData.map((skill) => ({
        name: skill.name,
        level: skill.level.toUpperCase() as
          | 'BEGINNER'
          | 'INTERMEDIATE'
          | 'ADVANCED'
          | 'EXPERT',
        category: skill.category ?? '',
        sortOrder: skill.sortOrder,
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
        name: item.name,
        level: item.level,
        category: item.category || undefined,
        sortOrder: index,
      }));

      const result = await updateSectionAction(cvId, 'skills', items);

      if (result.ok) {
        toast.success(result.message ?? 'Skills saved.');
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
              Skill {index + 1}
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

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <FieldWrapper
              label='Name'
              error={errors.items?.[index]?.name?.message}
            >
              <Input {...register(`items.${index}.name`)} placeholder='React' />
            </FieldWrapper>

            <FieldWrapper
              label='Level'
              error={errors.items?.[index]?.level?.message}
            >
              <select
                {...register(`items.${index}.level`)}
                className={cn(
                  'flex h-9 w-full rounded-md border border-input',
                  'bg-transparent px-3 py-1 text-sm shadow-xs',
                  'focus-visible:border-ring',
                  'focus-visible:ring-ring/50',
                  'focus-visible:ring-[3px]'
                )}
              >
                <option value=''>Select level</option>
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldWrapper>

            <FieldWrapper
              label='Category'
              error={errors.items?.[index]?.category?.message}
            >
              <Input
                {...register(`items.${index}.category`)}
                placeholder='Frontend'
              />
            </FieldWrapper>
          </div>
        </div>
      ))}

      <div className='flex items-center justify-between'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() =>
            append({
              name: '',
              level: undefined,
              category: '',
              sortOrder: fields.length,
            })
          }
        >
          <Plus className='size-4' />
          Add Skill
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
