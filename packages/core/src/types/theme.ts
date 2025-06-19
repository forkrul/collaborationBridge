/**
 * Theme configuration types
 */

/**
 * Color scale type for consistent color definitions
 */
export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

/**
 * Semantic color mappings
 */
export interface SemanticColors {
  background: {
    primary: string
    secondary: string
    tertiary: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
  }
  border: {
    primary: string
    secondary: string
    focus: string
  }
  interactive: {
    primary: string
    primaryHover: string
    secondary: string
    secondaryHover: string
  }
}

/**
 * Complete theme configuration
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
  spacing: {
    component: Record<string, string>
    layout: Record<string, string>
    container: Record<string, string>
  }
  typography: {
    heading: Record<string, any>
    body: Record<string, any>
    ui: Record<string, any>
  }
  shadows: {
    elevation: Record<string, string>
    interactive: Record<string, string>
    component: Record<string, string>
  }
  borders: {
    component: Record<string, any>
    interactive: Record<string, any>
  }
  animations: {
    transition: Record<string, any>
    interactive: Record<string, any>
    component: Record<string, any>
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
}

/**
 * Theme mode types
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: ThemeConfig | string) => void
  themeName: string
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  isDark: boolean
  toggleMode: () => void
  availableThemes: string[]
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  children: React.ReactNode
  theme?: ThemeConfig | string
  defaultTheme?: string
  defaultMode?: ThemeMode
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  attribute?: string
  value?: Record<string, string>
}

/**
 * CSS custom properties for theme
 */
export interface ThemeCSSProperties extends React.CSSProperties {
  '--color-primary'?: string
  '--color-secondary'?: string
  '--color-success'?: string
  '--color-warning'?: string
  '--color-error'?: string
  '--color-neutral'?: string
  '--color-background'?: string
  '--color-text'?: string
  '--color-border'?: string
  '--spacing-xs'?: string
  '--spacing-sm'?: string
  '--spacing-md'?: string
  '--spacing-lg'?: string
  '--spacing-xl'?: string
  '--shadow-sm'?: string
  '--shadow-md'?: string
  '--shadow-lg'?: string
  '--border-radius'?: string
  '--font-family'?: string
  '--font-size'?: string
  '--line-height'?: string
}
