/**
 * Shadow tokens for the design system
 * Provides depth and elevation through consistent shadow styles
 */

export const shadows = {
  // Base shadows
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Colored shadows
  primary: '0 4px 14px 0 rgb(59 130 246 / 0.15)',
  success: '0 4px 14px 0 rgb(34 197 94 / 0.15)',
  warning: '0 4px 14px 0 rgb(245 158 11 / 0.15)',
  error: '0 4px 14px 0 rgb(239 68 68 / 0.15)',
} as const

// Semantic shadow mappings
export const semanticShadows = {
  // Component elevation levels
  elevation: {
    0: shadows.none,
    1: shadows.sm,
    2: shadows.base,
    3: shadows.md,
    4: shadows.lg,
    5: shadows.xl,
    6: shadows['2xl'],
  },
  
  // Interactive states
  interactive: {
    hover: shadows.md,
    focus: shadows.lg,
    active: shadows.sm,
  },
  
  // Component-specific shadows
  component: {
    card: shadows.base,
    modal: shadows.xl,
    dropdown: shadows.lg,
    tooltip: shadows.md,
    button: shadows.sm,
    input: shadows.inner,
  },
} as const

export type Shadows = typeof shadows
export type SemanticShadows = typeof semanticShadows
