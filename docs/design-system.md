# PrismaCV Frontend — Design System (Strict Contract)

> Status: **Ratified.** The design system already exists in
> `src/design-system/tokens.ts`. This document makes it _strict_: one token
> surface, semantic classes only, no raw values. Enforced by the `token-guard`
> skill and (recommended) a pre-commit hook.

## 1. Principle

Every visual value — color, spacing, radius, shadow, typography — comes from a
**named semantic token**. No hex literals, no numeric Tailwind palette
utilities, no inline color styles in feature code. If a value is missing, add a
token; don't hardcode.

## 2. Token pipeline

```
src/design-system/tokens.ts   -- SOURCE OF TRUTH (edit here)
        │  pnpm tokens:generate  (scripts/generate-css-tokens.ts)
        ▼
src/design-system/tokens.css  -- GENERATED (never hand-edit)
        │  imported by
        ▼
src/app/globals.css           -- maps tokens to Tailwind via @theme inline
        ▼
Semantic Tailwind classes      -- what you write in components
```

To add or change a token: edit `tokens.ts` → `pnpm tokens:generate` → use the
new class. Never edit `tokens.css` directly.

## 3. The semantic surface

### Colors

| Group       | Tokens                                             | Class examples                                               |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------ |
| Primary     | `primary` / `.hover` / `.foreground`               | `bg-primary`, `text-primary-foreground`                      |
| Surface     | `surface.page` / `.card` / `.elevated`             | `bg-surface-page`, `bg-surface-card`, `bg-surface-elevated`  |
| Content     | `content.primary/secondary/tertiary/muted/inverse` | `text-content-primary`, `text-content-muted`                 |
| Border      | `border.subtle/DEFAULT/strong/interactive`         | `border-subtle`, `border-strong`, `border-interactive`       |
| Interactive | `interactive.link/linkHover`                       | `text-interactive-link`, `hover:text-interactive-link-hover` |
| Feedback    | `feedback.error/success/warning/info`              | `text-feedback-error`, `bg-feedback-success`                 |

shadcn primitives (`bg-card`, `text-muted-foreground`, `bg-destructive`, …) are
also legal — they resolve through the same CSS-variable layer.

### Scales

- **Spacing** — numeric (`spacing[1..20]`, 4px base) and semantic aliases
  (`xs/sm/md/lg/xl/2xl..5xl`). Prefer Tailwind's `p-4`, `gap-6`, etc.
- **Radii** — `none/sm/DEFAULT/md/lg/xl/2xl/full`. Use `rounded-lg` (cards),
  `rounded-full` (pills/avatars).
- **Shadows** — `shadow-card` and friends from `shadows`.
- **Typography** — `typography.fontFamily/fontSize`.
- **zIndex / dimensions / breakpoints** — from `zIndex`, `dimensions`.

## 4. The strictness gap to close (action required)

`tokens.ts` currently ships **two export surfaces for the same values**:

- Canonical: lowercase objects `colors`, `spacing`, `radii`, `shadows`,
  `typography`, plus the aggregate `theme`.
- **Legacy/deprecated:** UPPERCASE `COLORS`, `SPACING`, `DIMENSIONS`.

Two ways to express one value is the opposite of a strict system. The plan:

1. **Now:** mark the UPPERCASE exports deprecated; ban them in new code
   (`token-guard` flags them).
2. **Follow-up branch** (`refactor/design-tokens-single-surface`): migrate any
   remaining consumers to the lowercase `theme`/`colors`, delete the UPPERCASE
   exports. This is a `refactor:` change, kept out of the docs branch.

There is also a second, deeper duplication worth a decision later: shadcn's
default token set (`--color-primary`, `--color-card`, …) coexists with the
custom semantic set (`surface-*`, `content-*`). Both are legal today. If
consolidation is wanted, it's a design decision, not a quick refactor — log it,
don't churn it now.

## 5. Component rules

- Build from `src/components/ui/` primitives. Add new ones via
  `npx shadcn@latest add <name>` (config in `components.json`). Do not hand-roll
  accessible components — wrap Radix.
- Variants via **CVA**; conditional classes via `cn()` (`src/lib/utils.ts`).
- Icons from `lucide-react`; brand/custom icons in
  `src/components/common/Icons.tsx`.
- Toasts via `sonner` (`toast.error` / `toast.success`); `<Toaster />` is in the
  root layout.
- Single quotes, kebab-case filenames, 2-space indent, 80-char width (Prettier +
  ESLint enforced).

## 6. Enforcement

- **`token-guard` skill** — audits changed files for hex/rgb/hsl literals,
  numeric palette utilities (`text-gray-500` …), and the deprecated UPPERCASE
  exports. Run before every UI commit.
- **Recommended hook** — fold the `token-guard` greps into `lint-staged` (which
  already runs Prettier + ESLint) so violations block the commit.
- **`new-screen` skill** — generates skeletons that already use semantic tokens
  (`bg-surface-elevated`, `animate-pulse`).
