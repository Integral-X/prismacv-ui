---
name: token-guard
description: Audit changed files for design-system violations — raw hex/rgb/hsl colors, hardcoded Tailwind color utilities, and use of the deprecated UPPERCASE token exports (COLORS, SPACING, DIMENSIONS). Use before committing UI changes, during review of styling diffs, or when asked to "check tokens", "enforce the design system", or "find hardcoded colors".
---

# Design-system token guard

Enforces the single semantic token surface defined in
`src/design-system/tokens.ts`. The design system is the source of truth; styling
must go through semantic Tailwind classes, never raw values.

## What is legal

Semantic Tailwind classes mapped from `tokens.ts` via `@theme inline` in
`src/app/globals.css`. Examples:

- Surfaces: `bg-surface-page`, `bg-surface-card`, `bg-surface-elevated`
- Text: `text-content-primary`, `text-content-secondary`, `text-content-tertiary`,
  `text-content-muted`, `text-content-inverse`
- Borders: `border-subtle`, `border-strong`, `border-interactive`
- Feedback: `text-feedback-error`, `text-feedback-success`, `text-feedback-warning`,
  `text-feedback-info`
- Interactive: `text-interactive-link`, `hover:text-interactive-link-hover`
- shadcn primitives: `bg-primary`, `bg-card`, `text-muted-foreground`, etc.
- Radii/shadows: `rounded-lg`, `shadow-card`

## Violations to flag

1. **Raw color values** — any `#hex`, `rgb(`, `rgba(`, `hsl(`, `hsla(` in `.tsx`,
   `.ts`, or `.css` outside `src/design-system/` and `tokens.css` (generated).
2. **Hardcoded Tailwind color utilities** — `text-gray-500`, `bg-white`,
   `border-slate-200`, `text-red-600`, etc. These bypass the semantic layer.
   The numeric-palette utilities (`-50`..`-950`) are the tell.
3. **Deprecated UPPERCASE exports** — any import or use of `COLORS`, `SPACING`,
   or `DIMENSIONS` from `@/design-system/tokens`. The lowercase `theme` /
   `colors` / `spacing` objects are canonical; the UPPERCASE aliases are legacy
   and slated for removal. New code must not use them.
4. **Inline style colors** — `style={{ color: '...', background: '...' }}` with
   literal colors.

## How to run the audit

Scope to changed files when reviewing a diff; scan `src/` for a full sweep.

```bash
# Raw color literals (exclude the design-system source + generated CSS)
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgb\(|rgba\(|hsl\(|hsla\(' src \
  --include='*.tsx' --include='*.ts' --include='*.css' \
  | grep -v 'src/design-system/'

# Hardcoded palette utilities
grep -rnE '\b(text|bg|border|ring|fill|stroke|from|to|via)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|pink|rose)-[0-9]{2,3}\b' src \
  --include='*.tsx'

# Deprecated UPPERCASE token usage
grep -rnE '\b(COLORS|SPACING|DIMENSIONS)\b' src --include='*.ts' --include='*.tsx' \
  | grep -v 'src/design-system/tokens.ts'
```

## Output

Report each violation as `file:line — <snippet> → suggested semantic class`.
Map the raw value to the closest semantic token:

- gray-900 → `content-primary`, gray-600 → `content-secondary`,
  gray-400 → `content-tertiary`, gray-500 → `content-muted`
- white surface → `surface-card` / `surface-elevated`; gray-100 page → `surface-page`
- gray-200 border → `border-subtle`, gray-300 → `border` (DEFAULT), gray-400 → `border-strong`
- red-500 → `feedback-error`, green-500 → `feedback-success`,
  yellow-500 → `feedback-warning`, blue-500 → `feedback-info`
- cyan-400 → `primary` / `interactive-link`

If no semantic token fits, recommend adding one to `tokens.ts`, running
`pnpm tokens:generate`, then using the new class — never hardcode.

## Wire it as a hook (recommended)

This audit is most valuable as a pre-commit gate. Suggest adding the three greps
to `lint-staged` (already runs Prettier + ESLint) so violations block the commit
instead of relying on manual runs.
