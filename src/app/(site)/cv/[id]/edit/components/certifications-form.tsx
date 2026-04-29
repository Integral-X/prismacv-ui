'use client';

import { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { certificationSchema } from '@/lib/validations/cv';
import type { Certification } from '@/modules/cv/data/mappers';
import { updateSectionAction } from '@/modules/cv/data/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const formSchema = z.object({
  items: z.array(certificationSchema),
});

type FormData = z.infer<typeof formSchema>;

interface CertificationsFormProps {
  cvId: string;
  initialData: Certification[];
  onSaved: (items: Certification[]) => void;
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return '';
  return date instanceof Date ? date.toISOString().split('T')[0] : '';
}

export function CertificationsForm({
  cvId,
  initialData,
  onSaved,
}: CertificationsFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: initialData.map((cert) => ({
        name: cert.name,
        issuer: cert.issuer ?? '',
        issueDate: toDateString(cert.issueDate),
        expiryDate: toDateString(cert.expiryDate),
        credentialUrl: cert.credentialUrl ?? '',
        sortOrder: cert.sortOrder,
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
        issuer: item.issuer || undefined,
        issueDate: item.issueDate
          ? new Date(item.issueDate).toISOString()
          : undefined,
        expiryDate: item.expiryDate
          ? new Date(item.expiryDate).toISOString()
          : undefined,
        credentialUrl: item.credentialUrl || undefined,
        sortOrder: index,
      }));

      const result = await updateSectionAction(cvId, 'certifications', items);

      if (result.ok) {
        toast.success(result.message ?? 'Certifications saved.');
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
              Certification {index + 1}
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
              label='Name'
              error={errors.items?.[index]?.name?.message}
            >
              <Input
                {...register(`items.${index}.name`)}
                placeholder='AWS Solutions Architect'
              />
            </FieldWrapper>

            <FieldWrapper
              label='Issuer'
              error={errors.items?.[index]?.issuer?.message}
            >
              <Input
                {...register(`items.${index}.issuer`)}
                placeholder='Amazon Web Services'
              />
            </FieldWrapper>

            <FieldWrapper
              label='Issue Date'
              error={errors.items?.[index]?.issueDate?.message}
            >
              <Input type='date' {...register(`items.${index}.issueDate`)} />
            </FieldWrapper>

            <FieldWrapper
              label='Expiry Date'
              error={errors.items?.[index]?.expiryDate?.message}
            >
              <Input type='date' {...register(`items.${index}.expiryDate`)} />
            </FieldWrapper>

            <FieldWrapper
              label='Credential URL'
              error={errors.items?.[index]?.credentialUrl?.message}
              className='sm:col-span-2'
            >
              <Input
                {...register(`items.${index}.credentialUrl`)}
                placeholder='https://verify.example.com/...'
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
              issuer: '',
              issueDate: undefined,
              expiryDate: undefined,
              credentialUrl: '',
              sortOrder: fields.length,
            })
          }
        >
          <Plus className='size-4' />
          Add Certification
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
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <label className='text-sm font-medium text-content-primary'>
        {label}
      </label>
      {children}
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}
