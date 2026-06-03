---
name: diagnose
description: Disciplined diagnosis loop for hard bugs and performance regressions in the PrismaCV frontend. Reproduce → minimise → hypothesise → instrument → fix → regression-test. Use when asked to "diagnose"/"debug" something, when a screen/action is broken/throwing/failing, an auth/session flow misbehaves, a Server Action returns the wrong ActionResult, or a page is slow.
---

# Diagnose

A discipline for hard bugs. Skip phases only when explicitly justified.
Adapted from mattpocock/skills (`engineering/diagnose`) to the PrismaCV stack.

Before digging in, build a mental model from `docs/architecture.md` (data flow,
the `executeAuthenticatedRequest` token-refresh seam, route protection) and
`docs/api-coverage.md` (which endpoint a screen actually calls).

## Phase 1 — Build a feedback loop

**This is the skill.** A fast, deterministic, agent-runnable pass/fail signal
finds the cause; staring at code does not. Spend disproportionate effort here.
Be aggressive. Refuse to give up.

### Ways to construct one — for this codebase, in rough order

1. **Co-located Jest test at the data-layer seam.** Mock `@/shared/http/api-client`
   (`jest.mock('@/shared/http/api-client')`, `jest.mocked(apiClient.post)`), feed
   a fixture typed with `satisfies <Contract>`, assert the mapper/action output.
   Fastest loop for `contracts → mappers → queries → mutations → actions` bugs.
2. **Server Action unit test.** Drive `actions.ts` directly; assert the
   `ActionResult` discriminated union (`{ ok, code, message }`). Mock `HttpError`
   responses to reproduce the wrong branch.
3. **Cookie/session repro.** Mock `cookies` from `next/headers` via a
   `createCookieStore()` factory to reproduce 401 → refresh → retry bugs in
   `executeAuthenticatedRequest`.
4. **Playwright e2e** (`e2e/*.spec.ts`). For UI/flow bugs: run `pnpm build` then
   `pnpm test:e2e` (or `:headed` / `:ui`). Drives real DOM, console, network.
   Includes `@axe-core/playwright` for a11y assertions.
5. **curl against `pnpm dev`.** Hit the Next route/API handler directly; diff the
   response. Confirms whether the bug is FE or backend.
6. **Replay a captured payload.** Save a real backend response / `HttpError`
   envelope to a fixture, replay it through the mapper/action in isolation.
7. **Differential loop.** Same input through two branches/commits; diff output.
   Useful after a dependency or Next/React bump.

Build the right loop and the bug is 90% fixed.

### Iterate on the loop itself

- **Faster:** scope the Jest run to one file (`pnpm test -- <path> --watchAll=false`).
- **Sharper:** assert the specific symptom (exact `code`/`message`, exact DOM
  node), not "didn't throw".
- **Deterministic:** mock at module boundaries (`apiClient`, `cookies`,
  `next/navigation`), pin time, seed any randomness. A 2-second deterministic
  loop beats a 30-second flaky one.

### Non-deterministic bugs

Raise the reproduction rate: loop the trigger, parallelise Playwright workers,
add stress. A 50%-flake bug is debuggable; 1% is not.

### When you genuinely cannot build a loop

Stop and say so. List what you tried. Ask for: the environment that reproduces
it, a captured artifact (HAR, Sentry trace, console dump), or permission to add
temporary instrumentation. Do **not** hypothesise without a loop.

## Phase 2 — Reproduce

Run the loop; watch the bug appear. Confirm it's the failure the **user**
described (not a nearby one), that it's reproducible, and that you've captured
the exact symptom (error message, wrong `ActionResult`, slow timing).

## Phase 3 — Hypothesise

Generate **3–5 ranked, falsifiable hypotheses** before testing any.
Format: "If <X> is the cause, then <changing Y> makes the bug disappear."
Common PrismaCV failure classes to consider:

- Contract drift — `contracts.ts` no longer matches the backend DTO casing/shape.
- Mapper dropping/renaming a field; nullability (`null` vs `undefined`) mismatch.
- Session/refresh — expired access token, refresh not persisted, cookie flags.
- Middleware — route prefix missing from the protected list, or wrongly gated.
- RSC/client boundary — data fetched client-side that should be server-side, or
  a `'use client'` leaf importing `server-only` code.

Show the ranked list to the user before testing — cheap checkpoint, often
re-ranked instantly by domain knowledge. Don't block if they're AFK.

## Phase 4 — Instrument

Each probe maps to one prediction. Change one variable at a time.

- Prefer a debugger / focused assertion over scattered logs.
- **Use the Pino `logger`** (`src/shared/logger/logger.ts`) — `console.log` is
  banned by `AGENTS.md` and forbidden in tests. Note redaction strips
  passwords/tokens/auth headers.
- **Tag every temporary log** with a unique prefix, e.g. `logger.debug('[DBG-a4f2] ...')`,
  so cleanup is one grep.
- **Perf branch:** logs are usually wrong. Measure first — `performance.now()`,
  the Next build/route timing, React Profiler, or a network waterfall — then
  bisect. For RSC slowness, check whether reads are accidentally serial instead
  of `Promise.all`.

## Phase 5 — Fix + regression test

Write the regression test **before the fix**, if a correct seam exists:

- Data/logic bug → co-located `*.test.ts` mocking `apiClient` (the
  `feature-module` skill's test template).
- Flow/UI bug → an `e2e/*.spec.ts`.

A correct seam exercises the **real bug pattern** at its call site. If the only
available seam is too shallow, **that is itself the finding** — note it; the
architecture is preventing the bug from being locked down. Otherwise: failing
test → watch fail → apply fix → watch pass → re-run the Phase 1 loop on the
original scenario.

## Phase 6 — Cleanup + post-mortem

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop).
- [ ] Regression test passes (or absence of a seam is documented).
- [ ] All `[DBG-...]` logs removed (`grep` the prefix).
- [ ] Throwaway harnesses deleted.
- [ ] `pnpm verify` passes (format:check + lint + typecheck + test + build).
- [ ] The winning hypothesis is stated in the commit/PR message for the next dev.

**Then ask: what would have prevented this bug?** If the answer is architectural
(contract drift with no guard, a missing middleware prefix, a shallow seam),
record it in `docs/roadmap.md`. Make the recommendation **after** the fix lands —
you know more now than when you started.
