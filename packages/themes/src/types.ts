import type {
  ColorScale,
  SemanticColors,
  SpacingScale,
  SemanticSpacing,
  SemanticTypography,
  SemanticShadows,
  SemanticBorders,
  SemanticAnimations,
} from '@company/tokens'

/**
 * Theme configuration interface
 * Defines the structure of a complete theme
 */
export interface ThemeConfig {
  name: string
  colors: SemanticColors & {
    primary: ColorScale
    secondary: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
    neutral: ColorScale
  }
  spacing: SemanticSpacing
  typography: SemanticTypography
  shadows: SemanticShadows
  borders: SemanticBorders
  animations: SemanticAnimations
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
}

/**
 * Theme context interface
 */
export interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: ThemeConfig | string) => void
  themeName: string
  availableThemes: string[]
  isDark: boolean
  toggleDarkMode: () => void
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  children: React.ReactNode
  theme?: ThemeConfig | string
  defaultTheme?: string
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}
