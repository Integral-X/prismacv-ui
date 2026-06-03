# AGENTS.md

## Project

PrismaCV — AI-powered career platform. Next.js 16 / React 19 / App Router. Production codebase: no experimental features, no prototype code, no TODOs that defer essential behavior.

---

## Canonical docs

This file is the short rulebook. Detailed, authoritative specs live in `docs/`:

- `docs/architecture.md` — ratified architecture (RSC + Server Actions + per-feature data layer), data flow, route protection, co-location convention.
- `docs/design-system.md` — strict token contract and enforcement.
- `docs/api-coverage.md` — backend⇄frontend endpoint matrix (done / wired / left).
- `docs/roadmap.md` — task-by-task plan, phased by branch.

Project skills in `.claude/skills/` automate the common flows: `feature-module` (data-layer scaffold), `new-screen` (route scaffold), `token-guard` (design-system audit), `diagnose` (disciplined debugging loop for hard bugs / perf regressions).

---

## Before you write code

1. Check existing patterns in the repository first
2. Reuse established abstractions before creating new ones
3. Keep the diff minimal and focused
4. Run `pnpm verify` before declaring any task complete (format:check + lint + typecheck + test + build)

---

## Stack

- **Next.js 16 / React 19** — App Router, Server Components by default. Turbopack for dev and build.
- **TypeScript** — strict mode, no `any`. `@/*` path alias maps to `./src/*`.
- **Tailwind CSS 4** — use semantic CSS custom properties from the design system (`text-content-primary`, `bg-surface-card`, `border-subtle`). Never hardcode colors or raw hex values.
- **shadcn/ui** (New York style) — UI primitives in `src/components/ui/`. Add new components via `npx shadcn@latest add <component>`. Config in `components.json`.
- **Radix UI** — underlying primitives. Wrap them; do not hand-roll accessible components.
- **Lucide React** — icon library. Import from `lucide-react`. Optimized via `optimizePackageImports` in next.config.ts.
- **CVA** (`class-variance-authority`) + `cn` helper — use for component variants. `cn()` lives in `src/lib/utils.ts` (clsx + tailwind-merge).
- **React Hook Form 7** + **Zod 4** + `@hookform/resolvers` — all forms use this stack. See Server Actions + Forms section.
- **Pino** — structured logger in `src/shared/logger/logger.ts`. See Environment section.
- **Sonner** — toast notifications. Use `toast.error()` / `toast.success()`.
- **Embla Carousel** — carousel with autoplay plugin.
- **Vercel Analytics** — already integrated in root layout.
- **Zustand** — installed but not yet used. Do not introduce Zustand state unless specifically requested.
- **React 19** — do not add `useMemo` or `useCallback` manually unless there is a measured, specific performance reason.
- **pnpm** — package manager. Never use `npm` or `yarn`.

### Formatting

- Single quotes everywhere: Prettier `singleQuote: true` + `jsxSingleQuote: true`. ESLint enforces `quotes: 'single'` and `jsx-quotes: 'prefer-single'`.
- File names: **kebab-case** (`landing-page.tsx`, not `LandingPage.tsx`).
- Semicolons, 2-space indentation, 80-char line width, ES5 trailing commas.

---

## Architecture

- Organize by feature first (`src/modules/<feature>/`), then by layer (`data/`, `ui/`)
- Shared code in `src/shared/` only when truly reusable across features
- Route files in `src/app/` are thin entrypoints — no business logic
- Co-locate code with the feature that owns it
- No `utils` dumping grounds

> **Screen co-location (the real convention).** Feature screens co-locate their UI inside the route folder: `app/(site)/<route>/page.tsx` (thin RSC entry) + `<route>-page-client.tsx` (`'use client'` root) + `loading.tsx` + a local `components/`. Only `auth`, `landing-page`, and `onboarding` use the older `components/pages/<feature>/` tree below. New screens follow co-location — use the `new-screen` skill. See `docs/architecture.md §4`.

```
src/
  app/                       -- route entrypoints only
  components/
    ui/                      -- shadcn/ui primitives (generated, extend via variants)
    common/                  -- shared app components (Navbar, Footer, Icons)
    layouts/                 -- layout wrappers (AuthFormLayout)
    pages/<feature>/         -- LEGACY: only auth, landing-page, onboarding.
                             -- New screens co-locate under app/(site)/<route>/.
  design-system/             -- tokens.ts (source of truth) + tokens.css (generated)
  lib/
    utils.ts                 -- cn() helper
    validations/             -- Zod schemas
  modules/<feature>/
    data/                    -- data layer (see below)
  shared/
    config/env.ts            -- typed environment variables
    http/                    -- HttpClient abstraction
    logger/logger.ts         -- Pino logger
```

---

## Data layer

Each feature's `data/` folder follows this structure:

```
src/modules/<feature>/data/
  contracts.ts   -- backend wire types (DTOs). Mirror backend shape exactly.
  mappers.ts     -- domain types + transform functions (contract -> domain).
  queries.ts     -- async read functions (server-side).
  mutations.ts   -- async write functions (server-side).
  actions.ts     -- Server Actions ('use server'). Orchestrate mutations + session.
  session.ts     -- cookie-based session management (server-only).
```

### Rules

- **contracts.ts** — No domain types. No imports from `mappers.ts`. Types mirror backend DTOs exactly, including casing.
- **mappers.ts** — Owns all domain types for the feature. Single source of truth. All contract-to-domain transformation lives here.
- **queries.ts / mutations.ts** — Call `apiClient` (never raw `fetch`). Apply mappers to return domain types. Authenticated requests use `executeAuthenticatedRequest()`.
- **actions.ts** — Starts with `'use server'`. Returns `ActionResult` discriminated union: `{ ok: true, redirectTo?, message? } | { ok: false, code, message }`. Catches `HttpError` and maps to user-facing error codes. Never throws to the client.
- **session.ts** — Uses `import 'server-only'` guard. Manages httpOnly cookies (`access-token`, `refresh-token`, `user-profile`, `session-persistent`). Never import in client code.
- Consumers (Server Components, Server Actions) call `queries.ts` / `mutations.ts` — never the `apiClient` directly.
- **Async/queue flows**: the backend exposes job-based endpoints (`queue/jobs/*` — async PDF export, AI analyze/optimize, status poll). A `modules/queue/data` layer exists but is **not yet wired to UI**. If you build async flows, drive polling through a Server Action — do not reach for a client data-cache library. See `docs/api-coverage.md` and `docs/roadmap.md` Phase 4.

### Token refresh

`executeAuthenticatedRequest()` in `mutations.ts`: attempt with access token -> on 401, read refresh token -> call refresh endpoint -> persist new session -> retry original request. If refresh fails, clear session and throw.

### Route protection matrix

- `src/middleware.ts` protects prefix routes that require an authenticated user session cookie:
  - `/onboarding`, `/dashboard`, `/cv`, `/settings`, `/ats-scorer`, `/jobs`, `/skills`, `/interview`, `/cover-letters`, `/admin`
- Public pages (no middleware auth gate): landing and marketing routes, auth routes (`/login`, `/signup`, `/otp`, `/forgot-password`, `/reset-password`), and `/public/cv/[slug]`.
- `/admin` has a second gate in `src/app/(site)/admin/page.tsx` that checks `getCurrentUser().role === 'admin'` and redirects non-admin users.
- Backend admin-only APIs (for example `GET /features/refresh`) require a platform-admin JWT audience; regular user sessions are not sufficient.

### HTTP client

All HTTP calls go through the `HttpClient` interface in `src/shared/http/`. Never call `fetch` directly in feature code.

```
src/shared/http/
  types.ts              -- RequestConfig, ApiEnvelope, ApiErrorEnvelope
  http-client.ts        -- HttpClient interface (the swappability seam)
  fetch-http-client.ts  -- default implementation; unwraps { success, data, timestamp }
  api-client.ts         -- single apiClient instance (module-level singleton)
  http-error.ts         -- HttpError class with status helpers (isUnauthorized, isForbidden, etc.)
```

- `apiClient` holds no auth state. Auth tokens read per-request from httpOnly cookies via `cookies()` from `next/headers`.
- To swap implementations, write a new class implementing `HttpClient` and update `api-client.ts`.

### Server vs client data flow

```
Default (server):
  Server Component / Server Action -> queries/mutations -> apiClient -> backend

Client (only when needed):
  Client Component -> Route Handler -> queries/mutations -> apiClient -> backend
```

Never push data fetching to the client just because a component has interactivity. Fetch on the server, pass data as props.

---

## Server Actions + Forms

### Server Action pattern

- Actions live in `src/modules/<feature>/data/actions.ts` with `'use server'` directive.
- Return `ActionResult` (never throw to client).
- Error mapping: `HttpError` status codes -> semantic codes (`conflict`, `invalid_credentials`, `rate_limited`, `unauthorized`, `unknown`).
- Use `redirect()` from `next/navigation` only for hard redirects (logout).

### Form pattern

- All forms use React Hook Form + Zod + `zodResolver`.
- Schemas live in `src/lib/validations/<feature>.ts`.
- Infer form data type: `type LoginFormData = z.infer<typeof loginSchema>`.
- Cross-field validation uses `.refine()` with explicit `path` for error target.
- Reuse schema fragments (e.g., `passwordSchema`) across schemas.

### Wiring

Page calls action -> checks `result.ok`:

- `ok: true` -> `router.push(result.redirectTo)`
- `ok: false` -> `toast.error(result.message)` or redirect based on `result.code`

### Form accessibility

- `aria-invalid={!!errors.fieldName}` on inputs
- `role='alert'` on error message elements
- Disable form controls during submission via `isLoading` state

---

## Components

- Server Components by default. Add `'use client'` only when interactivity, browser APIs, refs, or local state are required.
- Keep client components as small leaf nodes. The `-page-client.tsx` pattern (e.g., `otp-page-client.tsx`) is for pages needing client interactivity at the root — keep these thin.
- One clear responsibility per component.
- No mixing of data fetching, transformation, and rendering in one component.
- Derive state; avoid duplicating it. Avoid unnecessary effects.
- Consume `src/components/ui/` primitives — do not create one-off styled elements.
- Icons: import from `lucide-react`. Custom/brand icons live in `src/components/common/Icons.tsx`.
- Toasts: use `toast` from `sonner`. `<Toaster />` is configured in the root layout.

---

## Styling

- **Source of truth**: `src/design-system/tokens.ts` exports `theme` (colors, spacing, radii, shadows, typography, zIndex, dimensions).
- **CSS generation**: `pnpm tokens:generate` runs `scripts/generate-css-tokens.ts` -> outputs `src/design-system/tokens.css`.
- **Tailwind integration**: `globals.css` imports `tokens.css` and maps semantic tokens via `@theme inline {}`. Use semantic classes: `text-content-primary`, `bg-surface-card`, `border-subtle`, `text-feedback-error`, `shadow-card`.
- **shadcn/ui**: components in `src/components/ui/` are generated. Add new ones: `npx shadcn@latest add <name>`. Config: `components.json` (New York style, RSC=true, Lucide icons).
- **Variants**: use CVA for component variants. `cn()` for conditional class merging.
- Never hardcode hex values. If a new semantic token is needed, add it to `tokens.ts`, regenerate CSS, then use the Tailwind class.
- **Single token surface.** Use the lowercase `theme` / `colors` / `spacing` exports. The UPPERCASE `COLORS` / `SPACING` / `DIMENSIONS` exports are **deprecated** — do not use them in new code. Run the `token-guard` skill before committing UI changes. See `docs/design-system.md`.

---

## TypeScript

- No `any`. If truly unavoidable, add `// eslint-disable-next-line` with a comment explaining why.
- `strict: true` in tsconfig. Do not loosen.
- Type ownership: `contracts.ts` owns wire types, `mappers.ts` owns domain types, `validations/*.ts` owns form types via `z.infer<>`.
- Do not duplicate types for the same concept across files.
- Model nullability honestly: `null` for "absent", `undefined` for "not provided".
- Use `satisfies` for compile-time checking of test fixtures against contract types.
- `@/*` path alias maps to `./src/*`. Use it for all imports.

---

## Testing

### Unit tests (Jest 30 + Testing Library + jsdom)

- Co-locate test files: `<file>.test.ts` or `<file>.test.tsx` next to source. `test/` directory at root for standalone utilities.
- Run: `pnpm test` (watch), `pnpm test -- --coverage --watchAll=false` (CI).
- Setup: `jest.setup.ts` imports `@testing-library/jest-dom` and mocks `window.matchMedia`.

### Data layer test pattern

- Mock `apiClient`: `jest.mock('@/shared/http/api-client')`.
- Type-safe mocks: `const postMock = jest.mocked(apiClient.post)`.
- Use `satisfies ContractType` on mock return values to match backend shapes.
- Cookie-dependent code: mock `cookies` from `next/headers` using a `createCookieStore()` factory.
- Clear mocks in `beforeEach`.

### Component test pattern

- `render()` from `@testing-library/react`, `screen` for queries, `userEvent.setup()` for interactions.
- Query by accessible role (`getByRole`) or text (`getByText`). Avoid test IDs unless no semantic query works.

### E2E tests (Playwright)

- Files in `e2e/` directory with `.spec.ts` extension.
- 5 browser projects: Desktop Chrome, Firefox, Safari + Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12).
- Run: `pnpm test:e2e` (headless), `pnpm test:e2e:headed`, `pnpm test:e2e:ui` (Playwright UI).
- Requires `pnpm build` first (web server uses `pnpm start`).
- CI: retries=2, workers=1. Local: no retries, parallel workers.

### Testing rules

- Every new data layer file needs a co-located `.test.ts`.
- Tests verify behavior, not implementation. Mock at module boundaries (apiClient, cookies).
- Do not use `console.log` in tests.
- Test names describe behavior: 'refreshes an expired access token and retries the request'.

---

## Environment

- **Env validation**: `src/shared/config/env.ts` validates `NEXT_PUBLIC_API_URL` at module load. Missing it crashes with a clear error. Exported `env.apiBaseUrl` has `/v1/` suffix appended.
- **Local dev**: create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3210/api` (same host/port as the Nest `PORT` and `/api` prefix as in backend `.env.example`).
- **Logging**: Pino at `src/shared/logger/logger.ts`. Security redaction on passwords, tokens, auth headers (`[Redacted]`). Dev: level=debug, pretty-printed. Prod: level=info, JSON. Use `logger`, not `console.log`.
- **Session**: httpOnly cookies (`access-token`, `refresh-token`, `user-profile`, `session-persistent`). `rememberMe=true` sets `maxAge` (7 days). `rememberMe=false` creates session-only cookies. `secure` flag only in production.
- **Security headers**: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: origin-when-cross-origin (configured in next.config.ts).

---

## CI/CD

### Local hooks (Husky)

- **Pre-commit**: `lint-staged` runs Prettier + ESLint on staged files.
- **Pre-push**: `pnpm verify` (format:check + lint + typecheck + test with coverage + build).

### Scripts

| Command                             | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `pnpm dev`                          | Dev server (Turbopack)                 |
| `pnpm build`                        | Production build                       |
| `pnpm verify`                       | Full quality check (what CI runs)      |
| `pnpm test`                         | Jest unit tests (watch)                |
| `pnpm test:e2e`                     | Playwright E2E                         |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                                 |
| `pnpm format` / `pnpm format:check` | Prettier                               |
| `pnpm typecheck`                    | TypeScript `tsc --noEmit`              |
| `pnpm tokens:generate`              | Regenerate CSS tokens from `tokens.ts` |

### GitHub workflows

- **PR** (`pr.yml`): 3 parallel jobs — quality-gates (format, lint, typecheck, test), build-verification, e2e-tests. All must pass.
- **Main** (`main.yml`): quality-gates -> semantic-release -> Docker push (ghcr.io, tags: `latest` + version).
- **Commit messages**: Conventional Commits format. `feat:` -> minor, `fix:`/`refactor:`/`perf:` -> patch, `docs:`/`test:`/`ci:` -> no release.
- **Docker**: `node:20-alpine`, pnpm, frozen-lockfile.

---

## Naming and clean code

- Names describe business meaning, not implementation detail
- Avoid: `data`, `item`, `thing`, `helper`, `manager`, `util`, `misc`
- Component names describe what they render
- Function names describe what they do
- No abbreviations unless already established in the codebase
- No dead code, commented-out code, or unused imports
- No magic values — use named constants when meaning matters
- Do not refactor unrelated areas unless required for correctness
- Write for the next developer
