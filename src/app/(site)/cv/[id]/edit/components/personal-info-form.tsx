'use client';

import type { ReactNode } from 'react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from '@/lib/validations/cv';
import type { PersonalInfo } from '@/modules/cv/data/mappers';
import { updatePersonalInfoAction } from '@/modules/cv/data/actions';
import { GrammarCheckInline } from '@/components/common/grammar-check-inline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface PersonalInfoFormProps {
  cvId: string;
  initialData: PersonalInfo | null;
  onSaved: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({
  cvId,
  initialData,
  onSaved,
}: PersonalInfoFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: initialData?.fullName ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      location: initialData?.location ?? '',
      website: initialData?.website ?? '',
      linkedinUrl: initialData?.linkedinUrl ?? '',
      summary: initialData?.summary ?? '',
      avatarUrl: initialData?.avatarUrl ?? '',
    },
  });

  function onSubmit(data: PersonalInfoFormData) {
    startTransition(async () => {
      const result = await updatePersonalInfoAction(cvId, data);
      if (result.ok) {
        toast.success(result.message ?? 'Personal info saved.');
        if (result.data) {
          onSaved(result.data);
        }
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <FieldWrapper label='Full Name' error={errors.fullName?.message}>
          <Input {...register('fullName')} placeholder='John Doe' />
        </FieldWrapper>

        <FieldWrapper label='Email' error={errors.email?.message}>
          <Input
            type='email'
            {...register('email')}
            placeholder='john@example.com'
          />
        </FieldWrapper>

        <FieldWrapper label='Phone' error={errors.phone?.message}>
          <Input {...register('phone')} placeholder='+1 234 567 890' />
        </FieldWrapper>

        <FieldWrapper label='Location' error={errors.location?.message}>
          <Input {...register('location')} placeholder='New York, NY' />
        </FieldWrapper>

        <FieldWrapper label='Website' error={errors.website?.message}>
          <Input {...register('website')} placeholder='https://example.com' />
        </FieldWrapper>

        <FieldWrapper label='LinkedIn URL' error={errors.linkedinUrl?.message}>
          <Input
            {...register('linkedinUrl')}
            placeholder='https://linkedin.com/in/johndoe'
          />
        </FieldWrapper>
      </div>

      <FieldWrapper label='Summary' error={errors.summary?.message}>
        <Textarea
          {...register('summary')}
          placeholder='A brief professional summary...'
          rows={4}
        />
        <GrammarCheckInline
          getText={() => getValues('summary') ?? ''}
          context='summary'
          emptyMessage='Write a few sentences in your summary first.'
        />
      </FieldWrapper>

      <div className='flex justify-end'>
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
  children: ReactNode;
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
