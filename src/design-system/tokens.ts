/**
 * Design System Tokens
 *
 * This file is the single source of truth for all design tokens.
 * Tokens are organized into semantic categories and use scale-based values.
 *
 * Usage:
 * - Import tokens directly: `import { colors, spacing } from '@/design-system/tokens'`
 * - Use in Tailwind: `className="bg-primary text-content-primary p-lg"`
 * - Use as CSS variables: `style={{ color: 'var(--color-primary)' }}`
 */

// ============================================================================
// PRIMITIVE COLORS - Raw color values (base palette)
// ============================================================================

const primitiveColors = {
  // Cyan/Teal - Primary brand color
  cyan: {
    400: '#069EA8', // Primary (matches --primary CSS var)
    500: '#058A93', // Primary hover/darker
  },

  // Grays - Neutral palette
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6', // Background
    200: '#E5E7EB', // Border light
    300: '#D1D5DB', // Border default
    400: '#9CA3AF', // Text tertiary
    500: '#6B7280', // Text muted
    600: '#374151', // Text secondary
    900: '#000000', // Text primary
  },

  // White
  white: '#FFFFFF',

  // Feedback colors
  red: {
    500: '#EF4444', // Error/destructive
  },

  green: {
    500: '#10B981', // Success
  },

  yellow: {
    500: '#F59E0B', // Warning
  },

  blue: {
    500: '#3B82F6', // Info
  },
} as const;

// ============================================================================
// SEMANTIC COLORS - Purpose-driven color tokens
// ============================================================================

export const colors = {
  // Brand/Primary colors
  primary: {
    DEFAULT: primitiveColors.cyan[400],
    hover: primitiveColors.cyan[500],
    foreground: primitiveColors.white, // Text on primary bg
  },

  // Surface/Background colors
  surface: {
    page: primitiveColors.gray[100], // Main page background
    card: primitiveColors.white, // Card backgrounds
    elevated: primitiveColors.white, // Elevated surfaces (modals, popovers)
  },

  // Content/Text colors
  content: {
    primary: primitiveColors.gray[900], // Main text
    secondary: primitiveColors.gray[600], // Secondary text
    tertiary: primitiveColors.gray[400], // Tertiary text
    muted: primitiveColors.gray[500], // Muted/disabled text
    inverse: primitiveColors.white, // Text on dark backgrounds
  },

  // Border colors
  border: {
    subtle: primitiveColors.gray[200], // Light borders
    DEFAULT: primitiveColors.gray[300], // Default borders
    strong: primitiveColors.gray[400], // Strong/emphasis borders
    interactive: primitiveColors.cyan[400], // Interactive element borders
  },

  // Interactive elements
  interactive: {
    link: primitiveColors.cyan[400],
    linkHover: primitiveColors.cyan[500],
  },

  // Feedback colors
  feedback: {
    error: primitiveColors.red[500],
    success: primitiveColors.green[500],
    warning: primitiveColors.yellow[500],
    info: primitiveColors.blue[500],
  },

  // Component-specific (for backward compatibility with your existing setup)
  checkbox: {
    border: primitiveColors.gray[300],
    checked: primitiveColors.cyan[400],
  },
} as const;

// ============================================================================
// SPACING SCALE - Consistent spacing values
// ============================================================================

export const spacing = {
  '0': '0',
  '1': '4px', // 0.25rem
  '2': '8px', // 0.5rem  - xs
  '3': '12px', // 0.75rem - sm
  '4': '16px', // 1rem    - md
  '5': '20px', // 1.25rem
  '6': '24px', // 1.5rem  - lg
  '7': '28px', // 1.75rem
  '8': '32px', // 2rem    - xl
  '10': '40px', // 2.5rem  - 2xl
  '12': '48px', // 3rem    - 3xl
  '16': '64px', // 4rem    - 4xl
  '20': '80px', // 5rem    - 5xl

  // Semantic spacing aliases
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '80px',
} as const;

// ============================================================================
// RADII - Border radius values
// ============================================================================

export const radii = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px', // Default for inputs, buttons
  md: '8px',
  lg: '12px', // Cards
  xl: '16px',
  '2xl': '24px',
  full: '9999px', // Fully rounded (pills, avatars)
} as const;

// ============================================================================
// SHADOWS - Box shadow values
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

  // Semantic shadows
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  cardHover:
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// ============================================================================
// TYPOGRAPHY - Font families, sizes, weights, line heights
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-geist-mono), ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
  },

  // Font sizes with corresponding line heights
  fontSize: {
    xs: { size: '12px', lineHeight: '16px' }, // 0.75rem / 1rem
    sm: { size: '14px', lineHeight: '20px' }, // 0.875rem / 1.25rem
    base: { size: '16px', lineHeight: '24px' }, // 1rem / 1.5rem
    lg: { size: '18px', lineHeight: '28px' }, // 1.125rem / 1.75rem
    xl: { size: '20px', lineHeight: '28px' }, // 1.25rem / 1.75rem
    '2xl': { size: '24px', lineHeight: '32px' }, // 1.5rem / 2rem
    '3xl': { size: '30px', lineHeight: '36px' }, // 1.875rem / 2.25rem
    '4xl': { size: '36px', lineHeight: '40px' }, // 2.25rem / 2.5rem
    '5xl': { size: '48px', lineHeight: '1' }, // 3rem / 1
    '6xl': { size: '60px', lineHeight: '1' }, // 3.75rem / 1
    '7xl': { size: '72px', lineHeight: '1' }, // 4.5rem / 1
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const;

// ============================================================================
// Z-INDEX - Stacking order
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// COMPONENT-SPECIFIC DIMENSIONS (mapped to semantic tokens)
// ============================================================================

export const dimensions = {
  // Component heights
  height: {
    input: '48px', // maps to spacing['12']
    button: '48px', // maps to spacing['12']
    buttonSm: '36px',
    buttonLg: '56px',
    checkbox: '20px', // maps to spacing['5']
    navbar: '64px',
  },

  // Component widths
  width: {
    card: '440px',
    containerSm: '640px',
    containerMd: '768px',
    containerLg: '1024px',
    containerXl: '1280px',
  },

  // Breakpoints (for reference, Tailwind already handles these)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// ============================================================================
// COMPLETE THEME OBJECT - Everything in one place
// ============================================================================

export const theme = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  zIndex,
  dimensions,
} as const;

// ============================================================================
// TYPE EXPORTS - For TypeScript autocomplete and type safety
// ============================================================================

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Shadows = typeof shadows;
export type Typography = typeof typography;
export type ZIndex = typeof zIndex;
export type Dimensions = typeof dimensions;
export type Theme = typeof theme;

// ============================================================================
// BACKWARD COMPATIBILITY - Export old constants format
// ============================================================================

export const COLORS = {
  primary: colors.primary.DEFAULT,
  primaryHover: colors.primary.hover,
  background: colors.surface.page,
  cardBg: colors.surface.card,
  textPrimary: colors.content.primary,
  textSecondary: colors.content.secondary,
  textTertiary: colors.content.tertiary,
  textMuted: colors.content.muted,
  borderGray: colors.border.DEFAULT,
  borderLight: colors.border.subtle,
  link: colors.interactive.link,
  checkboxBorder: colors.checkbox.border,
  checkboxChecked: colors.checkbox.checked,
  error: colors.feedback.error,
} as const;

export const SPACING = {
  cardPaddingX: spacing['12'], // 48px
  cardPaddingY: spacing['10'], // 40px
  headingMarginBottom: spacing['8'], // 32px
  socialButtonsGap: spacing['4'], // 16px
  socialButtonsMarginBottom: spacing['6'], // 24px
  dividerMargin: spacing['6'], // 24px
  labelInputGap: spacing['2'], // 8px
  inputMarginBottom: spacing['5'], // 20px
  checkboxMarginBottom: spacing['3'], // 12px
  buttonMarginBottom: spacing['6'], // 24px
} as const;

export const DIMENSIONS = {
  cardWidth: dimensions.width.card,
  cardBorderRadius: radii.lg,
  socialButtonHeight: dimensions.height.button,
  inputHeight: dimensions.height.input,
  inputBorderRadius: radii.DEFAULT,
  buttonHeight: dimensions.height.button,
  buttonBorderRadius: radii.DEFAULT,
  checkboxSize: dimensions.height.checkbox,
} as const;
