# PrismaCV — API Coverage Matrix (Backend ⇄ Frontend)

> Status: **Audit.** Endpoint inventory taken directly from the backend Nest
> controllers (`prismacv-backend/src/modules/**/*.controller.ts`), not the
> READMEs. FE status taken from `src/modules/<feature>/data` + the consuming
> route. Verify contract shapes against the live DTOs before relying on a row.

## Legend

- ✅ **Wired** — endpoint has a FE data-layer function and a UI consumer.
- 🟡 **Partial** — data layer or UI exists but the path is unverified / incomplete.
- ⛔ **Not wired** — no FE consumer (dead or pending).
- ⚙️ **Backend-only** — ops/webhook, no FE surface expected.

## Auth (`auth`, `auth/user`, `otp`, `oauth`)

| Method | Endpoint                    | FE module     | UI                            | Status |
| ------ | --------------------------- | ------------- | ----------------------------- | ------ |
| POST   | `auth/admin/login`          | auth          | `/admin`                      | ✅     |
| POST   | `auth/admin/create`         | auth          | (master-admin)                | 🟡     |
| POST   | `auth/admin/refresh`        | auth          | session                       | ✅     |
| POST   | `auth/user/login`           | auth          | `/login`                      | ✅     |
| POST   | `auth/user/signup`          | auth          | `/signup`                     | ✅     |
| POST   | `auth/user/forgot-password` | auth          | `/forgot-password`            | ✅     |
| POST   | `auth/user/reset-password`  | auth          | `/reset-password`             | ✅     |
| POST   | `auth/user/change-password` | user/auth     | `/settings/change-password`   | ✅     |
| POST   | `auth/user/refresh`         | auth          | session refresh               | ✅     |
| POST   | `otp/verify-signup`         | auth          | `/otp`                        | ✅     |
| POST   | `otp/resend-signup`         | auth          | `/otp`                        | ✅     |
| POST   | `otp/verify-reset`          | auth          | `/reset-password`             | ✅     |
| GET    | `oauth/google` + callback   | auth          | `/auth/oauth-callback`        | ✅     |
| GET    | `oauth/linkedin` + callback | auth          | `/auth/oauth-callback`        | ✅     |
| POST   | `oauth/linkedin/import`     | cv/onboarding | `/onboarding/import-linkedin` | ✅     |

## Users (`users`)

| Method | Endpoint          | FE module | UI                        | Status                  |
| ------ | ----------------- | --------- | ------------------------- | ----------------------- |
| GET    | `users/me`        | user      | `/settings`               | ✅                      |
| PATCH  | `users/me`        | user      | `/settings`               | ✅                      |
| POST   | `users/me/avatar` | user      | `/settings`               | 🟡 verify upload wiring |
| DELETE | `users/me`        | user      | `/settings` (danger zone) | 🟡 verify               |

## CV (`cv`)

| Method          | Endpoint                 | UI                                 | Status                                                         |
| --------------- | ------------------------ | ---------------------------------- | -------------------------------------------------------------- |
| POST            | `cv` (create)            | dashboard create dialog            | ✅                                                             |
| GET             | `cv` (list)              | `/dashboard`                       | ✅                                                             |
| GET             | `cv/templates`           | `/templates`, `/cv/[id]/templates` | ✅                                                             |
| GET             | `cv/:id`                 | `/cv/[id]/edit`                    | ✅                                                             |
| PATCH           | `cv/:id`                 | editor                             | ✅                                                             |
| DELETE          | `cv/:id`                 | dashboard cv-card                  | ✅                                                             |
| POST            | `cv/:id/duplicate`       | dashboard cv-card                  | ✅                                                             |
| POST            | `cv/import/linkedin`     | `/onboarding/import-linkedin`      | ✅                                                             |
| POST            | `cv/import/file`         | `/onboarding/upload-cv`            | ✅                                                             |
| GET             | `cv/:id/export/pdf`      | editor header (sync export)        | ✅                                                             |
| POST/GET/DELETE | `cv/:id/share`           | cv-share-panel                     | ✅                                                             |
| GET             | `cv/public/:slug`        | `/public/cv/[slug]`                | ✅                                                             |
| PUT             | `cv/:id/personal-info`   | personal-info-form                 | ✅                                                             |
| PUT             | `cv/:id/experiences`     | experience-form                    | ✅                                                             |
| PUT             | `cv/:id/education`       | education-form                     | ✅                                                             |
| PUT             | `cv/:id/skills`          | skills-form                        | ✅                                                             |
| PUT             | `cv/:id/certifications`  | certifications-form                | ✅                                                             |
| PUT             | `cv/:id/projects`        | projects-form                      | ✅                                                             |
| PUT             | `cv/:id/languages`       | languages-form                     | ✅                                                             |
| PUT             | `cv/:id/custom-sections` | (form)                             | 🟡 verify a dedicated UI exists                                |
| PUT             | `cv/:id/layout`          | inline editor (section layout)     | ✅ (Phase 6; autosave + optimistic — the documented exception) |

Editor data model: **section-level PUT via Server Actions, no autosave, no
optimistic state.** This is by design under the current architecture — see
[architecture.md §1](./architecture.md).

> **Exception — section layout persistence** (`PUT cv/:id/layout`): uses
> **autosave + optimistic state** by deliberate decision (owner, 2026-06-19).
> Drag-reorder / hide / inline-rename need instant feedback; a server round-trip
> per interaction is unacceptable here. The "no autosave / no optimistic" rule
> still governs the section **forms** — layout is the only opt-out. Details:
> [backend-support-cv-editor.md](./backend-support-cv-editor.md).

## AI / ATS / Grammar

| Method | Endpoint             | FE      | UI                | Status               |
| ------ | -------------------- | ------- | ----------------- | -------------------- |
| POST   | `ai/cv/:id/analyze`  | ai      | ai-analysis-panel | ✅                   |
| POST   | `ai/cv/:id/optimize` | ai      | ai-optimize-panel | ✅                   |
| POST   | `ats/score`          | ats     | `/ats-scorer`     | ✅                   |
| POST   | `grammar/check`      | grammar | editor (inline)   | 🟡 verify UI surface |

## Cover Letters (`cover-letters`)

| Method | Endpoint                 | UI                         | Status             |
| ------ | ------------------------ | -------------------------- | ------------------ |
| POST   | `cover-letters` (create) | `/cover-letters`           | ✅                 |
| GET    | `cover-letters` (list)   | `/cover-letters`           | ✅                 |
| GET    | `cover-letters/:id`      | `/cover-letters/[id]/edit` | ✅                 |
| PATCH  | `cover-letters/:id`      | editor                     | ✅                 |
| DELETE | `cover-letters/:id`      | list                       | ✅                 |
| POST   | `cover-letters/generate` | editor                     | ✅ (non-streaming) |

## Jobs (`jobs`)

| Method           | Endpoint                   | UI           | Status |
| ---------------- | -------------------------- | ------------ | ------ |
| POST/GET         | `jobs`                     | `/jobs`      | ✅     |
| GET              | `jobs/stats`               | `/jobs`      | ✅     |
| GET/PATCH/DELETE | `jobs/:id`                 | `/jobs/[id]` | ✅     |
| PATCH            | `jobs/:id/status`          | jobs board   | ✅     |
| POST/DELETE      | `jobs/:id/notes[/:noteId]` | `/jobs/[id]` | ✅     |

## Skills & Interview

| Method    | Endpoint                                       | UI                | Status |
| --------- | ---------------------------------------------- | ----------------- | ------ |
| GET       | `skills/categories` / `roles` / `resources`    | `/skills`         | ✅     |
| POST      | `skills/assess`                                | `/skills`         | ✅     |
| GET/PATCH | `skills/progress`                              | `/skills`         | ✅     |
| GET       | `skills/roadmap`                               | `/skills/roadmap` | ✅     |
| GET       | `interview/questions` / `roles` / `categories` | `/interview`      | ✅     |

## Billing (`billing`)

| Method | Endpoint                   | UI                              | Status          |
| ------ | -------------------------- | ------------------------------- | --------------- |
| POST   | `billing/checkout-session` | `/pricing`, `/settings/billing` | ✅              |
| POST   | `billing/portal-session`   | `/settings/billing`             | ✅              |
| GET    | `billing/me`               | plan-aware UI                   | ✅              |
| POST   | `billing/webhook`          | —                               | ⚙️ backend-only |

## Queue (`queue/jobs`) — **the main gap**

| Method | Endpoint                     | FE    | UI  | Status |
| ------ | ---------------------------- | ----- | --- | ------ |
| POST   | `queue/jobs/pdf-export`      | queue | —   | ⛔     |
| POST   | `queue/jobs/ai/analyze`      | queue | —   | ⛔     |
| POST   | `queue/jobs/ai/optimize`     | queue | —   | ⛔     |
| GET    | `queue/jobs/:jobId` (status) | queue | —   | ⛔     |

A `modules/queue/data` layer exists but **no screen consumes the status poll**.
Decision required: wire async/progressive flows (large PDFs, long AI runs) or
delete the layer as dead code. Tracked in [roadmap.md](./roadmap.md).

## Platform / Ops

| Method | Endpoint                                                | FE                   | Status          |
| ------ | ------------------------------------------------------- | -------------------- | --------------- |
| GET    | `features` / `features/check/:name` / `features/status` | features             | ✅              |
| GET    | `features/refresh`                                      | admin refresh button | ✅ (admin JWT)  |
| GET    | `health` / `health/ready`                               | `/api/health` route  | ✅              |
| GET    | `metrics`                                               | —                    | ⚙️ backend-only |

## Summary of genuine "left"

1. **Queue/async flows** — 4 endpoints, ⛔ no consumer. Biggest gap.
2. **Streaming AI** — documented, not built. Gated behind the architecture
   condition in [architecture.md §1](./architecture.md).
3. **Unverified wiring** — avatar upload, account deletion, custom-sections UI,
   grammar surface. Confirm or close.
4. **Test coverage** — see [roadmap.md](./roadmap.md): `ai`, `jobs`, `skills`,
   `interview`, `cover-letters`, `billing` data layers ship without co-located
   tests.
