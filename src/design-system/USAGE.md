# Design System Usage Guide

This guide demonstrates how to use the design tokens in your components.

## Table of Contents

1. [Importing Tokens](#importing-tokens)
2. [Using Tailwind Utilities](#using-tailwind-utilities)
3. [Using CSS Variables Directly](#using-css-variables-directly)
4. [Using TypeScript Tokens](#using-typescript-tokens)
5. [Component Examples](#component-examples)

---

## Importing Tokens

### TypeScript/JavaScript

```typescript
import { colors, spacing, radii, typography, theme } from '@/design-system/tokens';
```

### CSS

CSS variables are automatically available globally after importing `tokens.css` in `globals.css`.

---

## Using Tailwind Utilities

### Colors

```tsx
// Surface/Background colors
<div className="bg-surface-page">       {/* #F3F4F6 - Page background */}
<div className="bg-surface-card">       {/* #FFFFFF - Card background */}

// Content/Text colors  
<p className="text-content-primary">    {/* #000000 - Primary text */}
<p className="text-content-secondary">  {/* #374151 - Secondary text */}
<p className="text-content-tertiary">   {/* #9CA3AF - Tertiary text */}
<p className="text-content-muted">      {/* #6B7280 - Muted text */}

// Border colors
<div className="border border-subtle">      {/* #E5E7EB */}
<div className="border border-interactive"> {/* #17A2B8 */}

// Interactive colors
<a className="text-interactive-link hover:text-interactive-link-hover">
  Click me
</a>

// Feedback colors
<div className="bg-feedback-error text-white">Error message</div>
<div className="bg-feedback-success text-white">Success message</div>
```

### Spacing

```tsx
// Use numeric scale
<div className="p-4">     {/* 16px padding */}
<div className="m-8">     {/* 32px margin */}
<div className="gap-6">   {/* 24px gap */}

// Or semantic names (if configured in Tailwind)
<div className="p-lg">    {/* 24px padding */}
<div className="m-xl">    {/* 32px margin */}
```

### Border Radius

```tsx
<button className="rounded-md">     {/* 8px - Default for inputs/buttons */}
<div className="rounded-lg">        {/* 12px - Cards */}
<img className="rounded-full" />    {/* Fully rounded - Avatars */}
```

---

## Using CSS Variables Directly

When you need dynamic values or can't use Tailwind utilities:

```tsx
// Inline styles
<div 
  style={{
    backgroundColor: 'var(--color-surface-card)',
    padding: 'var(--spacing-lg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-card)',
  }}
>
  Card content
</div>

// With styled-components or emotion
const Card = styled.div`
  background-color: var(--color-surface-card);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  
  &:hover {
    box-shadow: var(--shadow-card-hover);
  }
`;
```

---

## Using TypeScript Tokens

Import and use tokens directly in your TypeScript/JavaScript code:

```tsx
import { colors, spacing, radii, shadows } from '@/design-system/tokens';

// In component logic
const buttonStyles = {
  backgroundColor: colors.primary.DEFAULT,
  color: colors.primary.foreground,
  padding: `${spacing.sm} ${spacing.lg}`,
  borderRadius: radii.md,
  boxShadow: shadows.button,
};

// Conditional styling
const textColor = isError 
  ? colors.feedback.error 
  : colors.content.primary;

// Theme object
import { theme } from '@/design-system/tokens';
console.log(theme.colors.primary.DEFAULT); // '#17A2B8'
```

---

## Component Examples

### Example 1: Button Component (Tailwind Classes)

```tsx
import { Button } from '@/components/ui/button';

export function MyButton() {
  return (
    <Button 
      className="
        bg-primary 
        text-primary-foreground 
        hover:bg-primary/90 
        px-6 
        py-3 
        rounded-md 
        shadow-button
      "
    >
      Click Me
    </Button>
  );
}
```

### Example 2: Card Component (Tailwind + Semantic Colors)

```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-surface-card 
      p-8 
      rounded-lg 
      border 
      border-subtle 
      shadow-card 
      hover:shadow-card-hover 
      transition-shadow
    ">
      {children}
    </div>
  );
}
```

### Example 3: Form Input (CSS Variables)

```tsx
export function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <label 
        style={{
          display: 'block',
          marginBottom: 'var(--spacing-xs)',
          color: 'var(--color-content-secondary)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
        }}
      >
        {label}
      </label>
      <input
        style={{
          width: '100%',
          height: '48px',
          padding: `0 var(--spacing-md)`,
          backgroundColor: 'var(--color-surface-card)',
          border: `1px solid ${error ? 'var(--color-feedback-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-content-primary)',
        }}
        {...props}
      />
      {error && (
        <span 
          style={{
            display: 'block',
            marginTop: 'var(--spacing-xs)',
            color: 'var(--color-feedback-error)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
```

### Example 4: Login Card (TypeScript Tokens)

```tsx
import { colors, spacing, radii, shadows, DIMENSIONS } from '@/design-system/tokens';

export function LoginCard() {
  return (
    <div 
      style={{
        width: DIMENSIONS.width.card,
        padding: `${spacing['10']} ${spacing['12']}`,
        backgroundColor: colors.surface.card,
        borderRadius: radii.lg,
        boxShadow: shadows.card,
      }}
    >
      <h2 
        style={{
          fontSize: '24px',
          fontWeight: typography.fontWeight.semibold,
          color: colors.content.primary,
          marginBottom: spacing.xl,
        }}
      >
        Welcome Back
      </h2>
      
      <p style={{ color: colors.content.secondary }}>
        Please sign in to continue
      </p>
      
      {/* Form fields here */}
      
      <button
        style={{
          width: '100%',
          height: DIMENSIONS.height.button,
          backgroundColor: colors.primary.DEFAULT,
          color: colors.primary.foreground,
          borderRadius: radii.DEFAULT,
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: typography.fontWeight.medium,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary.hover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary.DEFAULT;
        }}
      >
        Sign In
      </button>
    </div>
  );
}
```

### Example 5: Alert Component (Mixed Approach)

```tsx
import { colors } from '@/design-system/tokens';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
}

export function Alert({ type, children }: AlertProps) {
  const colorMap = {
    error: colors.feedback.error,
    success: colors.feedback.success,
    warning: colors.feedback.warning,
    info: colors.feedback.info,
  };

  return (
    <div 
      className="p-4 rounded-md border"
      style={{
        backgroundColor: `${colorMap[type]}10`, // 10% opacity
        borderColor: colorMap[type],
        color: colorMap[type],
      }}
    >
      {children}
    </div>
  );
}
```

---

## Backward Compatibility

If you have existing code using the old constants, they're still available:

```tsx
import { COLORS, SPACING, DIMENSIONS } from '@/design-system/tokens';

// Old way (still works)
const oldStyle = {
  color: COLORS.primary,              // '#17A2B8'
  padding: SPACING.cardPaddingX,      // '48px'
  borderRadius: DIMENSIONS.cardBorderRadius, // '12px'
};

// New way (recommended)
import { colors, spacing, radii } from '@/design-system/tokens';

const newStyle = {
  color: colors.primary.DEFAULT,      // '#17A2B8'
  padding: spacing['12'],             // '48px'
  borderRadius: radii.lg,             // '12px'
};
```

---

## Best Practices

### 1. **Prefer Tailwind utilities for static styles**
```tsx
// ✅ Good - Simple and readable
<div className="bg-surface-card p-lg rounded-lg">

// ❌ Avoid - Unnecessarily verbose
<div style={{ 
  backgroundColor: 'var(--color-surface-card)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)'
}}>
```

### 2. **Use CSS variables for dynamic values**
```tsx
// ✅ Good - Dynamic color based on state
<div style={{ 
  color: isError ? 'var(--color-feedback-error)' : 'var(--color-content-primary)' 
}}>

// ❌ Avoid - Hard to maintain
<div style={{ color: isError ? '#EF4444' : '#000000' }}>
```

### 3. **Use TypeScript tokens for computed values**
```tsx
import { spacing } from '@/design-system/tokens';

// ✅ Good - Calculated from tokens
const dynamicPadding = `${parseInt(spacing.lg) * 2}px`;
```

### 4. **Keep semantic naming consistent**
```tsx
// ✅ Good - Semantic and purpose-driven
<div className="bg-surface-card text-content-primary border-subtle">

// ❌ Avoid - Color names don't indicate purpose
<div className="bg-white text-black border-gray-200">
```

---

## TypeScript Autocomplete

The design system is fully typed. Import the types for autocomplete:

```typescript
import type { Colors, Spacing, Theme } from '@/design-system/tokens';

// Get autocomplete suggestions
const myColor: keyof Colors = 'primary'; // ✅ Autocomplete works!
```

---

## Updating Tokens

1. Edit `src/design-system/tokens.ts`
2. Run `npm run tokens:generate` to regenerate CSS variables
3. The changes will be available in both Tailwind utilities and CSS variables

---

## Questions?

- Check the `tokens.ts` file for all available tokens
- Check the `tokens.css` file for all CSS variable names
- Refer to Tailwind CSS v4 documentation for utility class usage

