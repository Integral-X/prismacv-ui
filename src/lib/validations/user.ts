import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string().max(50, 'Last name must be less than 50 characters'),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export function splitDisplayName(name: string | null): {
  firstName: string;
  lastName: string;
} {
  if (!name?.trim()) {
    return { firstName: '', lastName: '' };
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export function joinDisplayName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const AVATAR_ACCEPTED_TYPES = ['image/jpeg', 'image/png'] as const;
