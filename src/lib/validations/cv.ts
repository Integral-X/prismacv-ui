import { z } from 'zod';

const optionalUrl = z
  .string()
  .transform((v) => v.trim())
  .pipe(z.union([z.literal(''), z.string().url()]))
  .optional();

// ─── Personal info ────────────────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  fullName: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  website: optionalUrl,
  linkedinUrl: optionalUrl,
  summary: z.string().max(5000).optional(),
  avatarUrl: z.string().optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// ─── Experience ───────────────────────────────────────────────────────────────

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200),
  title: z.string().min(1, 'Title is required').max(200),
  location: z.string().max(200).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().max(5000).optional(),
  sortOrder: z.number().min(0).optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// ─── Education ────────────────────────────────────────────────────────────────

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(200),
  field: z.string().max(200).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  gpa: z.string().max(10).optional(),
  description: z.string().max(5000).optional(),
  sortOrder: z.number().min(0).optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// ─── Skill ────────────────────────────────────────────────────────────────────

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  category: z.string().max(100).optional(),
  sortOrder: z.number().min(0).optional(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// ─── Certification ────────────────────────────────────────────────────────────

export const certificationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  issuer: z.string().max(200).optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialUrl: optionalUrl,
  sortOrder: z.number().min(0).optional(),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

// ─── Project ──────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(5000).optional(),
  url: optionalUrl,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortOrder: z.number().min(0).optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ─── Language ─────────────────────────────────────────────────────────────────

export const languageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  proficiency: z
    .enum(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'FLUENT', 'NATIVE'])
    .optional(),
  sortOrder: z.number().min(0).optional(),
});

export type LanguageFormData = z.infer<typeof languageSchema>;

// ─── Custom section ───────────────────────────────────────────────────────────

export const customSectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  entries: z.array(z.record(z.string(), z.unknown())),
  sortOrder: z.number().min(0).optional(),
});

export type CustomSectionFormData = z.infer<typeof customSectionSchema>;

// ─── CV ───────────────────────────────────────────────────────────────────────

export const createCvSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  templateId: z.string().optional(),
});

export type CreateCvFormData = z.infer<typeof createCvSchema>;

export const updateCvSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  templateId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  isDefault: z.boolean().optional(),
});

export type UpdateCvFormData = z.infer<typeof updateCvSchema>;
