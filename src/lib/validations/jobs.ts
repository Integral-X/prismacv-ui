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

const jobTypeSchema = z.enum(['remote', 'onsite', 'hybrid']);
const jobExpertiseSchema = z.enum(['intern', 'junior', 'mid', 'senior']);
const jobSourceSchema = z.enum(['linkedin', 'facebook', 'instagram', 'other']);

export const manualCreateJobSchema = createJobSchema.extend({
  jobType: jobTypeSchema,
  expertise: jobExpertiseSchema.optional(),
  appliedDate: z.string().optional().or(z.literal('')),
  applicationDeadline: z.string().optional().or(z.literal('')),
  source: jobSourceSchema,
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or fewer')
    .optional()
    .or(z.literal('')),
  cvId: z.string().optional().or(z.literal('')),
});

export type ManualCreateJobFormData = z.infer<typeof manualCreateJobSchema>;

export const updateJobDetailSchema = z.object({
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
  jobType: jobTypeSchema,
  source: jobSourceSchema,
  appliedDate: z.string().optional().or(z.literal('')),
  applicationDeadline: z.string().optional().or(z.literal('')),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or fewer')
    .optional()
    .or(z.literal('')),
});

export type UpdateJobDetailFormData = z.infer<typeof updateJobDetailSchema>;

export const quickAddJobSchema = z.object({
  url: z.string().url('Please enter a valid job post URL'),
});

export type QuickAddJobFormData = z.infer<typeof quickAddJobSchema>;
