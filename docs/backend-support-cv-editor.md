# Backend support — inline CV editor (Enhancv UX)

> Scope: the `feat/cv-writing` inline editor work (two-column template). This
> notes what the new editing features need from the backend and which API serves
> each. **TL;DR: only one genuinely new capability is required — persisting
> section layout. Everything else already has an endpoint.**

> **Verified 2026-06-19** against `prismacv-backend@main` (`f03ac56`). Every
> "already supported" row below is confirmed present in
> [`cv.controller.ts`](../../prismacv-backend/src/modules/cv/cv.controller.ts) and
> [`upsert-sections.request.dto.ts`](../../prismacv-backend/src/modules/cv/dto/request/upsert-sections.request.dto.ts).
> The layout capability is confirmed **missing** (no column, endpoint, DTO field,
> or mapper output). The open question resolves itself: there is **no existing
> `presentation`/`settings` column** on `Cv` to reuse. Chosen shape: **dedicated
> `PUT cv/:id/layout`** (option 1 below).

## Already supported — no backend change

These editor features write through the existing section-PUT endpoints. They
work today; listed only to confirm the contracts cover them.

| Editor feature                        | Field(s) used                     | Endpoint                 |
| ------------------------------------- | --------------------------------- | ------------------------ |
| Entry drag-to-reorder (within a list) | `sortOrder` on each item          | `PUT cv/:id/<section>`   |
| Experience bullets (structured)       | `description` (newline-separated) | `PUT cv/:id/experiences` |
| Project bullets (structured)          | `description`                     | `PUT cv/:id/projects`    |
| Education field-of-study + bullets    | `field`, `description`            | `PUT cv/:id/education`   |
| Month/Year date pickers               | ISO `startDate` / `endDate`       | section PUTs             |
| Language proficiency pill             | `proficiency`                     | `PUT cv/:id/languages`   |

Two more already have endpoints but the editor does **not surface them yet**
(FE-only follow-up, no backend work):

- Certification **expiry date** + **credential URL** — `expiryDate`,
  `credentialUrl` on `PUT cv/:id/certifications`.
- **Custom sections** — `PUT cv/:id/custom-sections` exists; needs a UI.

## Needed from backend — section layout persistence

The editor lets the user **reorder sections across columns**, **hide/restore
sections**, and **rename section headings** (e.g. "Experience" → "Work
History"). Today this is persisted to `localStorage` per CV
(`cv:${id}:section-layout`, `cv:${id}:section-title:${key}`) as an interim seam,
so it is **per-browser and lost on device switch**. There is no field for it on
`CvResponseContract`.

To make layout durable and render correctly on the public/PDF paths, the backend
needs to store and return a per-CV layout blob.

### Shape we need to round-trip

```jsonc
{
  // Ordered section keys per column (keys: summary, experience, projects,
  // skills, education, certifications, languages, plus custom section ids).
  "mainOrder": ["summary", "experience", "projects"],
  "sideOrder": ["skills", "education", "certifications", "languages"],
  // Sections hidden from the rendered document.
  "hidden": ["certifications"],
  // Per-section heading overrides; absent key = use the default title.
  "titles": { "experience": "Work History" },
}
```

### Phase 0 — FROZEN contract (both repos mirror this verbatim)

> Locked 2026-06-19. B1/B2/F1 implement against this exactly — do not re-derive.

**Canonical type** (same shape on both sides; FE `SectionLayoutContract` ⇄ BE DTO ⇄
`Cv.layout` JSON column):

```ts
type SectionLayout = {
  mainOrder: string[]; // ordered keys rendered in the main column
  sideOrder: string[]; // ordered keys rendered in the side column
  hidden: string[]; // keys excluded from the rendered document
  titles: Record<string, string>; // key -> heading override
};
```

**Field rules (validation is structural only — keys stay opaque):**

| Field       | Type                    | Rules                                                     |
| ----------- | ----------------------- | --------------------------------------------------------- |
| `mainOrder` | `string[]`              | each item non-empty, `MaxLength(100)`; array max 50 items |
| `sideOrder` | `string[]`              | same as `mainOrder`                                       |
| `hidden`    | `string[]`              | same per-item rules                                       |
| `titles`    | `Record<string,string>` | values `MaxLength(120)`; max 50 entries                   |

- **Keys are opaque.** BE does **not** validate against a section enum — custom
  section ids (UUIDs) are valid keys. No referential checks across fields.
- **All four fields required in the request body** (send `[]` / `{}` when empty),
  so `PUT` is a full replace with no ambiguity. The **column** is nullable: `null`
  = never customized → renderers use default ordering and default titles.
- **Semantics the renderer + editor both apply** (keep in one place, mirror in
  `buildCvHtml` and the editor):
  - A key in `hidden` is omitted even if present in `mainOrder` / `sideOrder`.
  - A key in neither order array falls back to its **default column + position**.
  - A `titles` entry for an unknown/hidden key is inert (ignored), not an error.
  - Duplicate keys across `mainOrder` + `sideOrder`: **last column wins**; the
    editor must not emit duplicates, but the renderer tolerates them.
- **Wire/storage:** request + response use this shape unwrapped under `layout`;
  the `TransformInterceptor` adds the outer `{ success, data }` envelope. Response
  `layout` is `SectionLayout | null`.

### Suggested API (pick one)

1. **Dedicated endpoint (CHOSEN — matches the section-PUT pattern):**
   `PUT cv/:id/layout` accepting the blob above; include `layout` on
   `CvResponseContract` so `GET cv/:id` and `GET cv/public/:slug` return it.
2. **Extend the existing patch:** add an optional `layout` JSON field to
   `UpdateCvRequest` (`PATCH cv/:id`) and to `CvResponseContract`.

Either way the requirement is the same: **one nullable JSON column on the CV**,
returned by the CV read endpoints and the public/PDF render path so the saved
layout is honored everywhere, not just in the editor.

### Why it matters for export/public

The async **PDF export** (`queue/jobs/pdf-export`) and **public CV**
(`cv/public/:slug`) render server-side from the stored CV. Until layout lives on
the CV, an exported/shared CV ignores the user's reordering, hiding, and renamed
headings. This is the main reason to land it backend-side rather than leaving it
in `localStorage`.

## Implementation checklist (when we build it)

Both export paths and the public path render server-side from the stored CV and
currently drop layout entirely — the sync `GET cv/:id/export/pdf`
(`buildCvHtml(cv)`), the async `POST queue/jobs/pdf-export`
(`queue.service.ts` → `buildCvHtml`), and `GET cv/public/:slug` (returns
`cvMapper.cvToResponse(cv)`). So the column has to be threaded through the
read + render layer, not just the write.

**Backend (`prismacv-backend`):**

- Add `layout Json?` to the `Cv` model in `schema.prisma` + a migration. Store it
  as **opaque JSON** — do not validate keys against a section enum (custom-section
  ids land in `mainOrder`/`sideOrder` too).
- Add `PUT cv/:id/layout` (`JwtUserAuthGuard`, follows the section-PUT pattern).
- Add `layout` to `CvResponseDto` and emit it from `cvToResponse`, so `GET cv/:id`
  and `GET cv/public/:slug` both return it. No `buildCvHtml` change is needed to
  _store_ it, but the template must read it for export to honour the layout.

**Frontend (`prismacv-ui`):**

- Add `layout` to `CvResponseContract` + the CV mapper.
- Add a mutation/Server Action that calls `PUT cv/:id/layout`, and migrate
  `useSectionLayout` off `localStorage` onto it.
- **Consolidate the two storage shapes into the one blob.** Today layout lives in
  `cv:${id}:section-layout` (`{mainOrder, sideOrder, hidden}` — see
  `modules/cv/editor/section-layout.ts`) while heading overrides live in a
  _separate_ per-section key `cv:${id}:section-title:${key}` (see
  `two-column-editable.tsx`). The target blob folds `titles` in; the FE write path
  must be unified to match.
- Widen `LayoutSectionKey` (currently a closed 7-key union) to also carry custom
  section ids, or the blob can't reference them.

### Persistence UX — autosave + optimistic (deliberate exception)

> **Decision (owner, 2026-06-19):** the layout editor uses **autosave and
> optimistic state**. This is an explicit, scoped exception to the editor's
> default rule — _"section-level PUT via Server Actions, no autosave, no
> optimistic state"_ (`api-coverage.md`, `architecture.md §1`). The default still
> governs the section **forms**; only layout persistence opts out, because
> drag-reorder / hide / inline-rename demand instant feedback and a server
> round-trip per pointer interaction would feel broken.

Concretely:

- **Optimistic:** apply the layout change to local state immediately; render from
  it without waiting for the server.
- **Autosave:** persist via `updateCvLayoutAction` (→ `PUT cv/:id/layout`)
  automatically — **debounced** for rapid changes (drag streams, title typing),
  not one PUT per keystroke. Coalesce in-flight saves; last-write-wins.
- **Reconcile on failure:** on a rejected save, roll back to the last
  server-confirmed layout and `toast.error`. Keep a "dirty" ref so a failed save
  retries on the next change.
- Still `revalidatePath('/cv/${id}/edit')` + the public path so SSR/export reflect
  the saved layout once persisted.

## Resolved — backend open question

- **No** existing `presentation`/`settings` JSON column exists on `Cv`
  (`schema.prisma`, `model Cv`). This is a **new** `layout` field. The FE contract
  (`contracts.ts`) and mapper will be added to match the dedicated-endpoint shape.
