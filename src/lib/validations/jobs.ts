import { z } from 'zod';

const jobStatusSchema = z.enum([
  'SAVED',
  'APPLIED',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
]);

export const createJobSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required')
    .max(200, 'Job title must be 200 characters or fewer'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be 200 characters or fewer'),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  status: jobStatusSchema,
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;
