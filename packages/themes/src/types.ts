// Simplified theme types for modernization
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
}

/**
 * Theme configuration interface
 * Defines the structure of a complete theme
 */
export interface Theme {
  name: string
  colors: {
    primary: ColorScale
    secondary: ColorScale
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    text: {
      primary: string
      secondary: string
      tertiary: string
    }
    border: {
      primary: string
      secondary: string
    }
    success: string
    warning: string
    error: string
    info: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
  typography: {
    fontFamily: {
      sans: string[]
      mono: string[]
    }
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
    lineHeight: {
      tight: string
      normal: string
      relaxed: string
    }
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

/**
 * Theme context interface
 */
export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme | string) => void
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
  theme?: Theme | string
  defaultTheme?: string
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}
