# PrismaCV Frontend

[![Release Pipeline](https://github.com/Integral-X/prismacv-ui/actions/workflows/main.yml/badge.svg)](https://github.com/Integral-X/prismacv-ui/actions/workflows/main.yml)
[![PR Validation](https://github.com/Integral-X/prismacv-ui/actions/workflows/pr.yml/badge.svg)](https://github.com/Integral-X/prismacv-ui/actions/workflows/pr.yml)

Next.js frontend for PrismaCV: authenticated CV editing, AI workflows, billing UX, and public marketing pages.

## Current Status

- Feature-ready UI scope is implemented for onboarding, CV editing, AI actions, billing, and account management.
- Routing and middleware protections are in place for authenticated/user/admin paths.
- Billing upgrade and plan-aware UI states are wired end to end.
- Resume templates/examples and legal pages (`/pricing`, `/resume-templates`, `/resume-examples`, policy pages) are live.
- Unit and Playwright e2e test suites are integrated into CI quality gates.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Forms**: React Hook Form 7 + Zod
- **State and Data**: Server Actions + module-scoped data layers
- **Auth Model**: httpOnly cookie-based session from backend JWT endpoints
- **Observability**: Sentry for browser/runtime monitoring
- **Package Manager**: pnpm

## Getting Started

```bash
git clone https://github.com/Integral-X/prismacv-ui.git
cd prismacv-ui
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local`.

### Required

| Variable              | Purpose                                                         | Example                     |
| --------------------- | --------------------------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (must include `/api`, do not append `/v1`) | `http://localhost:3210/api` |

### Optional

| Variable                                | Purpose                           |
| --------------------------------------- | --------------------------------- |
| `LOG_LEVEL`                             | Frontend logger verbosity         |
| `NEXT_PUBLIC_SENTRY_DSN`                | Sentry DSN for UI error reporting |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT`        | Sentry environment tag            |
| `NEXT_PUBLIC_SENTRY_RELEASE`            | Sentry release identifier         |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Sentry tracing sample rate        |

> The UI does not need backend secrets like `JWT_SECRET`; auth is handled through secure cookies set by the API.

## Core Features

- **CV Editor**: personal info, experience, education, skills, projects, certifications, languages, custom sections
- **AI Workflows**: analyze CV, optimize for job description, grammar checks, ATS scoring
- **Cover Letters**: template-based generation with CV linkage and optional progressive rendering
- **Template Experience**: `/templates`, `/resume-templates`, direct "Use this template" CV creation
- **Public Examples**: seeded showcase entries on `/resume-examples`
- **Export and Sharing**: PDF export + public read-only CV links
- **Career Toolkit**: jobs tracker, skills gap assessment, interview prep
- **Billing UI**: plan management, upgrade flows, quota/plan indicators
- **Authentication**: email + OTP, refresh sessions, Google/LinkedIn OAuth

## ATS Scorer vs CV Analyze/Optimize

- **`/ats-scorer`**: score pasted resume text against a job description without opening a saved CV.
- **CV editor Analyze/Optimize**: run structured analysis on a stored CV and get job-specific optimization suggestions.

## Project Structure

```text
src/
├── app/               # Next.js routes and layouts
├── components/        # Shared UI components
├── design-system/     # Tokens and theme primitives
├── modules/           # Feature modules (ai, ats, auth, billing, cv, jobs, skills, etc.)
├── shared/            # HTTP client, auth utilities, shared types
└── lib/               # Helpers, validators, utility functions
```

## Development

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm format
```

## Testing

```bash
pnpm test
pnpm test:e2e
pnpm verify
```

- `pnpm verify` runs formatting, lint, typecheck, unit tests, and build.
- E2E uses Playwright (with accessibility coverage via `@axe-core/playwright` in test suite).

## License

Copyright (c) 2026 PrismaCV.
