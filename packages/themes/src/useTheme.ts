import { useThemeContext } from './ThemeProvider'
import { Theme } from './types'

/**
 * Hook to access the current theme and theme utilities
 */
export function useTheme() {
  const context = useThemeContext()
  
  return {
    theme: context.theme,
    setTheme: context.setTheme,
    themeName: context.themeName,
    availableThemes: context.availableThemes,
    isDark: context.isDark,
    toggleDarkMode: context.toggleDarkMode,
  }
}

/**
 * Hook to get theme-aware CSS variables
 */
export function useThemeVariables() {
  const { theme } = useTheme()
  
  return {
    '--color-primary-500': theme.colors.primary[500],
    '--color-secondary-500': theme.colors.secondary[500],
    '--color-background-primary': theme.colors.background.primary,
    '--color-background-secondary': theme.colors.background.secondary,
    '--color-text-primary': theme.colors.text.primary,
    '--color-text-secondary': theme.colors.text.secondary,
    '--spacing-sm': theme.spacing.sm,
    '--spacing-md': theme.spacing.md,
    '--spacing-lg': theme.spacing.lg,
    '--border-radius-md': theme.borderRadius.md,
    '--shadow-md': theme.shadows.md,
  } as React.CSSProperties
}

/**
 * Hook to get responsive breakpoint utilities
 */
export function useBreakpoint() {
  const { theme } = useTheme()
  
  // This would typically use a media query hook
  // For now, returning a simple implementation
  return {
    isMobile: false, // Would be implemented with useMediaQuery
    isTablet: false,
    isDesktop: true,
    breakpoint: 'desktop' as const,
  }
}
