import {
  colors,
  semanticColors,
  semanticSpacing,
  semanticTypography,
  semanticShadows,
  semanticBorders,
  semanticAnimations,
} from '@company/tokens'
import type { ThemeConfig } from './types'

/**
 * Base theme configuration
 * Light theme with default brand colors
 */
export const baseTheme: ThemeConfig = {
  name: 'base',
  
  colors: {
    ...semanticColors,
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    neutral: colors.neutral,
  },
  
  spacing: semanticSpacing,
  typography: semanticTypography,
  shadows: semanticShadows,
  borders: semanticBorders,
  animations: semanticAnimations,
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}
