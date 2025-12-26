# Design System

A comprehensive, semantic, and scale-based design token system for PrismaCV.

## 📁 Files

- **`tokens.ts`** - Single source of truth for all design tokens (TypeScript)
- **`tokens.css`** - Auto-generated CSS variables from tokens.ts
- **`USAGE.md`** - Comprehensive usage guide with examples
- **`README.md`** - This file

## 🚀 Quick Start

### 1. Import in TypeScript/JavaScript

```typescript
import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  theme,
} from '@/design-system/tokens';

// Use in your code
const buttonStyle = {
  backgroundColor: colors.primary.DEFAULT,
  padding: spacing.lg,
  borderRadius: radii.md,
};
```

### 2. Use Tailwind Utilities

```tsx
<div className="bg-surface-card text-content-primary p-lg rounded-lg border border-subtle">
  Content
</div>
```

### 3. Use CSS Variables

```tsx
<div
  style={{
    color: 'var(--color-content-primary)',
    padding: 'var(--spacing-lg)',
  }}
>
  Content
</div>
```

## 🎨 Token Categories

### Colors (Semantic)

- **Primary**: Brand colors (`colors.primary`)
- **Surface**: Backgrounds (`colors.surface.page`, `colors.surface.card`)
- **Content**: Text colors (`colors.content.primary`, `colors.content.secondary`)
- **Border**: Border colors (`colors.border.subtle`, `colors.border.DEFAULT`)
- **Interactive**: Links and interactive elements (`colors.interactive.link`)
- **Feedback**: Error, success, warning, info (`colors.feedback.error`)

### Spacing (Scale-based)

```typescript
spacing = {
  '0': '0',
  '1': '4px',
  '2': '8px', // xs
  '3': '12px', // sm
  '4': '16px', // md
  '6': '24px', // lg
  '8': '32px', // xl
  '10': '40px', // 2xl
  '12': '48px', // 3xl
  // ... up to '20': '80px'
};
```

### Radii (Border Radius)

- `none`, `sm` (4px), `md` (8px), `lg` (12px), `xl` (16px), `2xl` (24px), `full`

### Shadows

- `sm`, `md`, `lg`, `xl`, `2xl`, `inner`, `card`, `button`, `modal`

### Typography

- Font families: `sans`, `mono`
- Font sizes: `xs` to `7xl` (with line heights)
- Font weights: `normal`, `medium`, `semibold`, `bold`
- Letter spacing: `tight`, `normal`, `wide`

### Z-Index

- Layered stacking: `dropdown`, `sticky`, `fixed`, `modal`, `popover`, `tooltip`

## 📋 Token Structure

### Semantic Naming

Tokens use **purpose-based naming** instead of visual properties:

```typescript
// ✅ Good - Semantic
colors.content.primary; // "What is it for?"
colors.surface.card; // "Where is it used?"
colors.feedback.error; // "What does it mean?"

// ❌ Avoid - Visual naming
colors.black; // Not semantic
colors.gray100; // Not purpose-driven
colors.red500; // Doesn't convey meaning
```

### Scale-Based System

Spacing uses a consistent **8px scale**:

```typescript
spacing: {
  '2': '8px',    // Base unit
  '4': '16px',   // 2x
  '6': '24px',   // 3x
  '8': '32px',   // 4x
  '10': '40px',  // 5x
  '12': '48px',  // 6x
}
```

## 🔄 Updating Tokens

### Step 1: Edit tokens.ts

```typescript
// src/design-system/tokens.ts
export const colors = {
  primary: {
    DEFAULT: '#17A2B8', // ← Change this
    hover: '#138496',
  },
  // ...
};
```

### Step 2: Regenerate CSS (optional)

```bash
npm run tokens:generate
```

This regenerates `tokens.css` from `tokens.ts`. The script runs automatically before `dev` and `build`.

### Step 3: Use Updated Tokens

Changes are immediately available in:

- TypeScript imports
- Tailwind utilities (after rebuild)
- CSS variables (after regeneration)

## 🎯 Usage Philosophy

### When to Use Each Method

| Scenario           | Method            | Example                                     |
| ------------------ | ----------------- | ------------------------------------------- |
| Static styling     | Tailwind classes  | `className="bg-primary p-4"`                |
| Dynamic values     | CSS variables     | `style={{ color: 'var(--color-primary)' }}` |
| Computed values    | TypeScript tokens | `padding: ${spacing.lg * 2}`                |
| Component variants | TypeScript + CVA  | See button.tsx                              |

### Migration Strategy

1. **New components**: Use new token system from the start
2. **Existing components**: Gradually refactor when making changes
3. **Backward compatibility**: Old `COLORS`, `SPACING`, `DIMENSIONS` exports still work

## 📚 Documentation

- **[USAGE.md](./USAGE.md)** - Comprehensive guide with 5+ component examples
- **[tokens.ts](./tokens.ts)** - Full token definitions with comments
- **[tokens.css](./tokens.css)** - Generated CSS variables

## 🔗 Integration

### Tailwind CSS v4

Tokens are automatically available in Tailwind through `@theme` in `globals.css`:

```css
@theme inline {
  --color-surface-page: var(--color-surface-page);
  --color-content-primary: var(--color-content-primary);
  /* ... */
}
```

Use as: `className="bg-surface-page text-content-primary"`

### shadcn/ui Components

Design tokens work seamlessly with shadcn/ui:

```tsx
import { Button } from '@/components/ui/button';

<Button className="bg-primary hover:bg-primary/90">Click Me</Button>;
```

## 🎨 Design Tools

Tokens can be exported for design tools:

```typescript
import { theme } from '@/design-system/tokens';

// Export to JSON for Figma, Sketch, etc.
console.log(JSON.stringify(theme, null, 2));
```

## 💡 Benefits

1. **Type Safety**: Full TypeScript support with autocomplete
2. **Semantic**: Purpose-driven naming (not visual properties)
3. **Scalable**: Consistent spacing and sizing scale
4. **Flexible**: Use with Tailwind, CSS variables, or inline styles
5. **Maintainable**: Single source of truth
6. **Consistent**: Enforces design consistency across the app
7. **Dark Mode Ready**: Easy to extend for themes

## 🤝 Contributing

When adding new tokens:

1. Add to `tokens.ts` in the appropriate category
2. Use semantic naming (purpose over appearance)
3. Follow the existing scale (4px increments for spacing)
4. Run `npm run tokens:generate` to update CSS
5. Update USAGE.md with examples if needed

## 📝 Examples

See [USAGE.md](./USAGE.md) for:

- Button component examples
- Card component examples
- Form input examples
- Alert component examples
- Mixed approach examples

---

**Built with ❤️ for PrismaCV**
