# PrismaCV Frontend

AI-powered CV building, job application tracking, and career management platform.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: JWT with server-side session management
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

### Required Environment Variables

| Variable              | Purpose                                 |
| --------------------- | --------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL                    |
| `JWT_SECRET`          | Token verification (must match backend) |

See `.env.example` for the full list.

## Features

- **CV Builder** — section-based editor (personal info, experience, education, skills, projects, certifications, languages, custom sections)
- **Multiple Templates** — classic, two-column, and creative layouts with accent colors
- **Live Preview** — real-time template rendering as you edit
- **PDF Export** — server-side PDF generation via backend
- **LinkedIn Import** — create a CV from LinkedIn profile data
- **Job Application Tracker** — kanban-style tracking with status management (planned)
- **Skill Gap Analysis** — AI-powered comparison against market requirements (planned)
- **Interview Prep** — question bank with adaptive difficulty (planned)
- **Analytics** — career progression tracking and insights (planned)
- **Auth** — signup/login with email + OTP verification, Google & LinkedIn OAuth

## Project Structure

```
src/
├── app/              # Next.js routes and layouts
├── modules/          # Feature modules (cv, user)
│   └── cv/
│       ├── components/   # CV editor, preview, templates
│       └── data/         # Server actions and API calls
├── shared/           # Auth utilities, UI components, hooks
└── lib/              # Validations, helpers
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
