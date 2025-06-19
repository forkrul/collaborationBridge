/**
 * Border tokens for the design system
 * Includes border widths, styles, and radius values
 */

export const borderWidth = {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

export const borderStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  none: 'none',
} as const

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

// Semantic border mappings
export const semanticBorders = {
  // Component borders
  component: {
    input: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.md,
    },
    button: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.md,
    },
    card: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.lg,
    },
    modal: {
      width: borderWidth[0],
      style: borderStyle.none,
      radius: borderRadius.xl,
    },
  },
  
  // Interactive states
  interactive: {
    default: {
      width: borderWidth[1],
      style: borderStyle.solid,
    },
    hover: {
      width: borderWidth[1],
      style: borderStyle.solid,
    },
    focus: {
      width: borderWidth[2],
      style: borderStyle.solid,
    },
    active: {
      width: borderWidth[1],
      style: borderStyle.solid,
    },
  },
} as const

export type BorderWidth = typeof borderWidth
export type BorderStyle = typeof borderStyle
export type BorderRadius = typeof borderRadius
export type SemanticBorders = typeof semanticBorders
