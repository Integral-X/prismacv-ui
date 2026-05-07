# PrismaCV Frontend

[![Release Pipeline](https://github.com/Integral-X/prismacv-ui/actions/workflows/main.yml/badge.svg)](https://github.com/Integral-X/prismacv-ui/actions/workflows/main.yml)
[![PR Validation](https://github.com/Integral-X/prismacv-ui/actions/workflows/pr.yml/badge.svg)](https://github.com/Integral-X/prismacv-ui/actions/workflows/pr.yml)

AI-powered CV building, job application tracking, and career management platform.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york)
- **Auth**: JWT with server-side session management (httpOnly cookies)
- **Forms**: React Hook Form 7 + Zod
- **Package Manager**: pnpm

## Getting Started

```bash
git clone https://github.com/Integral-X/prismacv-ui.git
cd prismacv-ui
pnpm install
cp .env.example .env.local   # fill in API URL and auth config
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

#### Required

| Variable              | Purpose                                           | Example                     |
| --------------------- | ------------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (must include `/api` prefix) | `http://localhost:3000/api` |

#### Optional

| Variable    | Default                       | Purpose                                  |
| ----------- | ----------------------------- | ---------------------------------------- |
| `NODE_ENV`  | `development`                 | Environment (`production` in deployment) |
| `LOG_LEVEL` | `debug` (dev) / `info` (prod) | Logging verbosity                        |

> **Note:** The UI does not need `JWT_SECRET`. Auth is handled entirely via httpOnly cookies set by the backend.

See `.env.example` for a ready-to-copy template.

## Features

- **CV Builder** — section-based editor (personal info, experience, education, skills, projects, certifications, languages)
- **AI Analysis** — grammar, readability, and ATS scoring with actionable suggestions
- **Job Optimizer** — paste a job description to get match score and missing keywords
- **Cover Letters** — AI-assisted generation from CV data and job context
- **Templates Gallery** — browsable gallery of professional CV templates
- **Live Preview** — real-time template rendering as you edit
- **PDF Export** — server-side PDF generation via backend
- **LinkedIn Import** — create a CV from LinkedIn profile data
- **Job Application Tracker** — status tracking with notes per job
- **Skill Gap Analysis** — role-based learning roadmaps with progress tracking
- **Interview Prep** — question bank with adaptive difficulty
- **Grammar Checker** — inline grammar and content feedback in editor
- **Auth** — signup/login with email + OTP verification, Google & LinkedIn OAuth

## Project Structure

```
src/
├── app/              # Next.js routes and layouts
├── components/       # Shared UI components (shadcn/ui + common)
├── design-system/    # Design tokens and CSS generation
├── modules/          # Feature modules
│   ├── ai/           # AI analysis and optimization
│   ├── auth/         # Authentication data layer
│   ├── cover-letters/ # Cover letter generation
│   ├── cv/           # CV editor, preview, templates
│   ├── jobs/         # Job tracker
│   ├── skills/       # Skills and learning roadmap
│   └── user/         # User profile management
├── shared/           # Auth utilities, HTTP client, types
└── lib/              # Validations, helpers, utilities
```

## Development

```bash
pnpm dev             # dev server (turbopack)
pnpm build           # production build
pnpm lint            # eslint
pnpm format          # prettier
pnpm test            # jest + react testing library
pnpm test:coverage   # with coverage
```

Pre-commit hooks run formatting + linting automatically.

## License

Copyright (c) 2026 PrismaCV.
