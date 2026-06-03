# PrismaCV Frontend — Roadmap (Task-by-Task)

> Status: **Plan.** Derived from the API coverage audit. The app is feature-built;
> this roadmap is about _finishing, hardening, and reconciling_ — not greenfield
> construction. Each phase is a separate branch so docs, refactors, and features
> are reviewed and released independently.

## Phase 0 — Documentation & reconciliation (this branch: `docs/architecture-ratification`)

- [x] Audit backend controllers → API coverage matrix (`api-coverage.md`).
- [x] Author developer skills: `feature-module`, `token-guard`, `new-screen`.
- [x] Write `architecture.md`, `design-system.md`, `api-coverage.md`, `roadmap.md`.
- [ ] Reconcile `AGENTS.md` (co-location truth, queue pattern, token rule, test
      expectation, canonical-docs index).
- [ ] Add FE `CLAUDE.md` as a one-line `@AGENTS.md` import pointer.

Release impact: `docs:` → none. Merges fast.

## Phase 1 — Strict design system (branch: `refactor/design-tokens-single-surface`)

- [ ] Mark UPPERCASE `COLORS` / `SPACING` / `DIMENSIONS` exports deprecated.
- [ ] Migrate remaining consumers to the lowercase `theme` / `colors` objects.
- [ ] Delete the UPPERCASE exports; run `pnpm tokens:generate`.
- [ ] Sweep the codebase with `token-guard`; fix hex/palette-utility violations.
- [ ] Fold `token-guard` greps into `lint-staged` (pre-commit gate).
- [ ] (Decision, not necessarily this branch) shadcn default tokens vs custom
      semantic tokens — consolidate or document the coexistence.

Release impact: `refactor:` → patch.

## Phase 2 — Test coverage backfill (branch: `test/coverage-data-layers`)

Every `data/` file ships a co-located `.test.ts` (AGENTS.md rule). Missing today:

- [ ] `modules/ai/data` — mappers + actions
- [ ] `modules/jobs/data` — mappers + queries + mutations + actions
- [ ] `modules/skills/data` — mappers + queries + actions
- [ ] `modules/interview/data` — mappers + queries
- [ ] `modules/cover-letters/data` — mappers + queries + mutations
- [ ] `modules/billing/data` — mappers + queries + actions

Use the `feature-module` skill's test template. Mock `apiClient`, use
`satisfies <Contract>` on fixtures, assert behavior not implementation.

Release impact: `test:` → none.

## Phase 3 — Close wiring gaps (branch: `fix/wire-unverified-surfaces`)

- [ ] Verify/finish **avatar upload** (`users/me/avatar`).
- [ ] Verify/finish **account deletion** danger-zone (`DELETE users/me`).
- [ ] Confirm **custom-sections** editor UI (`PUT cv/:id/custom-sections`).
- [ ] Confirm **grammar** surface in the editor (`grammar/check`).

Each: confirm the endpoint is consumed end-to-end or file a defect.

Release impact: `fix:` → patch.

## Phase 4 — Queue / async flows (branch: `feat/queue-async-wiring`)

Decision gate first: **wire it or delete it.**

If wiring:

- [ ] Async **PDF export** for large CVs — submit job, poll `queue/jobs/:jobId`,
      progress UI in the editor header, toast on completion.
- [ ] Async **AI analyze/optimize** for long runs — same submit+poll pattern.
- [ ] Shared polling primitive (server-action-driven; no client cache library).

If not wiring:

- [ ] Delete `modules/queue/data` as dead code; note the backend endpoints stay.

Release impact: `feat:` → minor (or `refactor:` if deleting).

## Phase 5 — Streaming AI (branch: `feat/streaming-ai`) — **gated**

> Do not start until the [architecture.md §1](./architecture.md) condition is met:
> a committed product decision that streaming/live-editor UX is a near-term
> headline feature. This is the only phase that can force a client data-cache
> layer.

- [ ] Decide transport (SSE / streamed Server Action / route handler).
- [ ] Introduce a **scoped** client-cache layer (TanStack Query or the installed
      Zustand) for editor + AI panels only — not app-wide.
- [ ] Progressive rendering for `cover-letters/generate` and `ai/.../optimize`.
- [ ] Optional editor autosave + optimistic section edits.

Release impact: `feat:` → minor. Architecture-altering — needs explicit sign-off.

## Cross-repo follow-up (separate, `prismacv-backend`)

- [ ] Reconcile backend `CLAUDE.md` (claims 5 modules; 17 exist). Not this repo,
      not this branch — flagged so it isn't lost.

## Sequencing rationale

Phases 0→2 are pure risk-reduction (docs, tokens, tests) and unblock everyone.
Phase 3 closes honesty gaps in the coverage matrix. Phase 4 is the first real
feature decision. Phase 5 is deliberately last and gated, because it's the only
work that can reverse the ratified architecture — and you don't pay that cost on
spec.
