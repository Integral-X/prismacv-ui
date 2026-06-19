import type {
  CvResponseContract,
  PaginatedCvListContract,
  PersonalInfoResponseContract,
  ExperienceResponseContract,
  SkillResponseContract,
  TemplateContract,
} from "../contracts";

export const personalInfoContract: PersonalInfoResponseContract = {
  id: "pi_001",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1 555-0100",
  location: "New York, NY",
  website: "https://johndoe.dev",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  summary: "Full-stack developer",
};

export const experienceContract: ExperienceResponseContract = {
  id: "exp_001",
  company: "Acme Corp",
  title: "Senior Engineer",
  location: "Remote",
  startDate: "2022-01-15T00:00:00.000Z",
  endDate: undefined,
  current: true,
  description: "Building things",
  sortOrder: 0,
};

export const skillContract: SkillResponseContract = {
  id: "skill_001",
  name: "TypeScript",
  level: "ADVANCED",
  category: "Frontend",
  sortOrder: 0,
};

export const cvContract: CvResponseContract = {
  id: "cv_001",
  title: "My CV",
  slug: "my-cv",
  status: "DRAFT",
  templateId: "classic",
  isDefault: false,
  createdAt: "2026-04-01T10:00:00.000Z",
  updatedAt: "2026-04-15T14:30:00.000Z",
  personalInfo: personalInfoContract,
  experiences: [experienceContract],
  education: [],
  skills: [skillContract],
  certifications: [],
  projects: [],
  languages: [],
  customSections: [],
};

export const paginatedCvListContract: PaginatedCvListContract = {
  data: [
    {
      id: "cv_001",
      title: "My CV",
      slug: "my-cv",
      status: "DRAFT",
      templateId: "classic",
      isDefault: false,
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-15T14:30:00.000Z",
    },
    {
      id: "cv_002",
      title: "Second CV",
      slug: "second-cv",
      status: "PUBLISHED",
      isDefault: true,
      createdAt: "2026-03-20T08:00:00.000Z",
      updatedAt: "2026-04-10T12:00:00.000Z",
    },
  ],
  meta: {
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

export const templateContract: TemplateContract = {
  id: "classic",
  name: "Classic",
  thumbnail: "/images/templates/classic.png",
  hasHeadshot: true,
  layout: "single",
  category: "professional",
};
