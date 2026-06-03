# PrismaCV Frontend — Architecture (ADR + Conventions)

> Status: **Ratified.** This document is the source of truth for how the
> frontend is structured. `AGENTS.md` is the short rulebook; this is the why and
> the corrected detail. Where the two disagree, fix the disagreement — they must
> not drift.

## 1. Decision

The frontend stays on **React Server Components + Server Actions** with a
**per-feature data layer**. We ratify the existing architecture rather than
re-architect it, because the app is already feature-built and CI-gated on this
model. We do **not** introduce a client data-cache layer (TanStack Query / SWR)
or move state into Zustand at this time.

**The single condition that reverses this decision:** a committed, near-term
product requirement for a live, app-like editor — real-time autosave,
multi-section optimistic editing, or streaming AI as a headline feature. Server
Actions + `revalidatePath` cannot deliver that UX cleanly; at that point a
scoped client-cache layer for the editor surfaces becomes a requirement, not
gold-plating. Until then, RSC-first wins.

## 2. Stack (as built)

- **Next.js 16 / React 19**, App Router, Turbopack. Server Components by default.
- **TypeScript strict**, no `any`. `@/*` → `./src/*`.
- **Tailwind CSS 4 + shadcn/ui (New York)** over a semantic token layer. See
  [design-system.md](./design-system.md).
- **React Hook Form 7 + Zod 4** for all forms.
- **Server Actions** for writes; **module data layers** for reads.
- **httpOnly cookie sessions** set by the backend JWT endpoints.
- **Zustand** is installed but has **zero usages**. Do not introduce it without a
  specific, approved need (see §1 condition).

## 3. Data flow

```
Default (server):
  Server Component (page.tsx) ─▶ queries.ts ─▶ apiClient ─▶ backend
  Server Action (actions.ts)  ─▶ mutations.ts ─▶ apiClient ─▶ backend

Client (only when interactivity is required):
  Client Component ─▶ Server Action ─▶ mutations.ts ─▶ apiClient ─▶ backend
```

Fetch on the server, pass domain data as props. Never push fetching to the
client merely because a component is interactive.

### Per-feature data layer (`src/modules/<feature>/data/`)

| File           | Responsibility                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `contracts.ts` | Backend wire types (`*Contract`, `*Request`). Mirror DTO casing exactly. No domain types, no import from `mappers`.              |
| `mappers.ts`   | Owns all domain types + `to<Domain>()` transforms. Single source of truth.                                                       |
| `queries.ts`   | `server-only`. Reads via `executeAuthenticatedRequest` + `apiClient`.                                                            |
| `mutations.ts` | `server-only`. Writes, same wrapping.                                                                                            |
| `actions.ts`   | `'use server'`. Returns `ActionResult` discriminated union. Catches `HttpError`, maps to semantic codes. Never throws to client. |
| `session.ts`   | `server-only`. httpOnly cookie management (auth feature only).                                                                   |

The `feature-module` skill scaffolds this layer correctly. Use it.

### HTTP + auth seam

- All calls go through `apiClient` (`src/shared/http/`). Never raw `fetch` in
  feature code.
- `apiClient` holds no auth state; tokens are read per-request from httpOnly
  cookies.
- `executeAuthenticatedRequest()` attempts with the access token, and on 401
  refreshes + retries once, persisting the new session. On refresh failure it
  clears the session and throws.

## 4. Routing & co-location convention (CORRECTED)

> **This supersedes the older `AGENTS.md` claim that page trees live in
> `src/components/pages/<feature>/`.** Only `auth`, `landing-page`, and
> `onboarding` live there. **Every other feature co-locates its UI inside the
> route folder.** New screens follow the co-location convention — use the
> `new-screen` skill.

```
src/app/(site)/<route>/
  page.tsx                 -- thin RSC entry: server fetch, delegate. No logic.
  <route>-page-client.tsx  -- 'use client' root; data in via props.
  loading.tsx              -- skeleton (bg-surface-elevated + animate-pulse).
  components/              -- screen-local components for large screens.
```

`src/components/` holds only cross-screen code: `ui/` (shadcn primitives),
`common/` (Navbar, Footer, Icons), `layouts/`, `providers/`, and the three
legacy `pages/` trees noted above.

### Route protection

`src/middleware.ts` gates these prefixes on a valid session cookie:
`/onboarding`, `/dashboard`, `/cv`, `/settings`, `/ats-scorer`, `/jobs`,
`/skills`, `/interview`, `/cover-letters`, `/admin`. Guests on `/login` or
`/signup` with a session are bounced to `/dashboard`.

- Public: landing/marketing, auth routes, and `/public/cv/[slug]`.
- `/admin` has a second gate in its `page.tsx` checking `role === 'admin'`.
- Backend admin-only APIs require a `platform-admin` JWT audience — a regular
  user session is insufficient.

When adding an authenticated prefix, add it to the middleware list or it ships
unprotected.

## 5. Server Actions + forms

- Actions return `ActionResult`: `{ ok: true, data?, redirectTo? } | { ok: false, code, message }`.
- Error mapping: `HttpError` status → semantic code (`unauthorized`, `conflict`,
  `invalid_credentials`, `rate_limited`, `validation`, `unknown`).
- Forms: RHF + Zod + `zodResolver`; schemas in `src/lib/validations/<feature>.ts`;
  type via `z.infer<>`. Cross-field rules use `.refine()` with explicit `path`.
- Wiring: `ok: true` → `router.push(redirectTo)` or local update; `ok: false` →
  `toast.error(message)`.
- A11y: `aria-invalid` on inputs, `role='alert'` on errors, disable controls
  while submitting.

## 6. Known architectural debt (tracked in roadmap.md)

1. **Co-location drift** between `AGENTS.md` and code — corrected here; AGENTS.md
   updated in the same change.
2. **Queue/async layer unwired** — `modules/queue/data` exists but no UI consumes
   the job-status poll endpoints. Decide: wire it, or delete it as dead code.
3. **Streaming AI is documented but absent** — see §1 condition before building.
4. **Lopsided test coverage** — several data layers ship without co-located
   tests. See [roadmap.md](./roadmap.md).
5. **Dual token surface** — see [design-system.md](./design-system.md).

## 7. Cross-repo note

The backend `CLAUDE.md` is stale (documents 5 modules; 17 exist). That is a
separate repo and is out of scope for this branch, but it is the upstream source
of contract truth — when writing `contracts.ts`, read the Nest controller and
its response DTO directly, not the backend README or CLAUDE.md.
