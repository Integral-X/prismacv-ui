# AGENTS.md

## What you are doing

You are working on a production-grade Next.js codebase for PrismaCV, an AI-powered career platform.

PrismaCV is reimagining career growth with intelligent, personalized insights. It transforms your resume into a smart career roadmap — helping you understand where you stand, identify the skills you need, and take clear steps toward your goals.

---

## Before writing code

1. Check existing local patterns in the repository first
2. Reuse established abstractions before creating new ones
3. Keep the diff minimal and focused

---

## Output rules

- Match existing project conventions exactly
- Include only files that are necessary for the task
- Avoid speculative abstractions and placeholder TODO architecture
- Ensure imports are clean and types are consistent across files
- When multiple approaches are valid, choose the one with lower coupling and clearer ownership

---

## Stack

- **Next.js 16 / React 19** — App Router, Server Components by default
- **TypeScript** — strict mode, no `any`
- **Tailwind CSS 4** — use semantic CSS custom properties from `globals.css` as design tokens (`--background`, `--accent`, `--surface`, etc.). Never hardcode colors or raw hex values.
- **ESLint** — linter. Run `pnpm lint` before finishing any task.
- **Radix UI** — primitives are already installed. Wrap them; do not hand-roll accessible components from scratch.
- **CVA** (`class-variance-authority`) + `cn` — use for component variants. Do not concatenate raw className strings manually.
- **React Compiler** — do not add `useMemo` or `useCallback` manually unless there is a measured, specific reason.
- File names: **kebab-case** (e.g. `landing-page.tsx`, `site.ts`)

---

## Architecture

- Organize by feature first (`src/modules/<feature>/`), then by layer inside (`ui/`, `data/`)
- Shared code lives in `src/shared/` only when it is truly reusable across features
- Route files in `src/app/` stay thin — they are entrypoints, not logic containers
- Co-locate code with the feature that owns it
- Do not create `utils` dumping grounds

### Data layer

Each feature's `data/` folder has a fixed structure:

```
src/modules/<feature>/data/
├── contracts.ts   ← backend wire types only (no domain logic)
├── mappers.ts     ← domain types + functions that transform contracts → domain
├── queries.ts     ← async read functions (called from Server Components / Server Actions)
└── mutations.ts   ← async write functions (called from Server Components / Server Actions)
```

Rules:

- `contracts.ts` mirrors backend DTOs exactly. Never import domain types into it.
- `mappers.ts` owns all domain types for that feature. One source of truth.
- Consumers (Server Components, Server Actions) call `queries.ts` / `mutations.ts` directly — never the `apiClient` directly.
- `hooks.ts` is added only when client-side fetching is genuinely needed (polling, optimistic updates, infinite scroll). Do not create it by default.

### HTTP client

All HTTP calls go through the `HttpClient` interface. Never call `fetch` or any HTTP library directly in feature code.

```
src/shared/http/
├── types.ts              ← RequestConfig, ApiEnvelope, ApiErrorEnvelope
├── http-client.ts        ← HttpClient interface (the swappability seam)
├── fetch-http-client.ts  ← default implementation; unwraps { success, data, timestamp }
├── api-client.ts         ← single apiClient instance (one backend, one client)
└── http-error.ts         ← HttpError class — always thrown on non-2xx responses
```

- `apiClient` is a module-level singleton. It holds no auth state.
- Auth tokens are read from httpOnly cookies per-request inside the data functions via `cookies()` from `next/headers`.
- To swap the HTTP implementation, write a new class that implements `HttpClient` and update `api-client.ts`. No other files change.

### Server vs client data flow

```
Default path (server):
  Server Component / Server Action → queries.ts or mutations.ts → apiClient → backend

Client path (only when needed):
  Client Component → TanStack Query hook → Next.js Route Handler → queries.ts or mutations.ts → apiClient → backend
```

Never push data fetching to the client just because a component has interactivity. Fetch on the server, pass data as props.

---

## Components

- Server Components by default. Add `"use client"` only when interactivity, browser APIs, refs, or local state are required.
- Keep client components as small leaf nodes — never move a large tree to the client for one interactive element
- One clear responsibility per component
- No mixing of data fetching, transformation, and rendering in one component
- Derive state; avoid duplicating it. Avoid unnecessary effects.
- Consume `@/shared/ui` primitives for UI — do not create one-off styled elements in module code

---

## TypeScript

- No `any`. If unavoidable, document why inline.
- Define types close to the domain that owns them
- Do not duplicate types for the same concept across files
- Model nullability honestly

---

## Naming

- Names describe business meaning, not implementation detail
- Avoid: `data`, `item`, `thing`, `helper`, `manager`, `util`, `misc`
- Component names describe what they render
- Function names describe what they do
- No abbreviations unless already established in the codebase

---

## Clean code

- Write for the next developer
- No dead code, commented-out code, or unused imports
- No magic values — use named constants when meaning matters
- Do not refactor unrelated areas unless required for correctness
