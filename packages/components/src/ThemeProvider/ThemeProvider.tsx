import * as React from 'react'
import { cn } from '@company/core'
import type { BaseComponentProps, ComponentWithChildren } from '@company/core'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  /** Current theme */
  theme: Theme
  /** Resolved theme (light/dark, never system) */
  resolvedTheme: 'light' | 'dark'
  /** Set theme */
  setTheme: (theme: Theme) => void
  /** Available themes */
  themes: Theme[]
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export interface ThemeProviderProps
  extends BaseComponentProps,
    ComponentWithChildren {
  /** Default theme */
  defaultTheme?: Theme
  /** Storage key for persisting theme */
  storageKey?: string
  /** Available themes */
  themes?: Theme[]
  /** Whether to enable system theme detection */
  enableSystem?: boolean
  /** Disable transition on theme change */
  disableTransitionOnChange?: boolean
  /** Custom attribute name for theme */
  attribute?: string
  /** Custom value mapping for themes */
  value?: Partial<Record<Theme, string>>
  /** Force theme (disable system detection) */
  forcedTheme?: Theme
}

const ThemeProvider = React.forwardRef<HTMLDivElement, ThemeProviderProps>(
  ({
    children,
    defaultTheme = 'system',
    storageKey = 'theme',
    themes = ['light', 'dark', 'system'],
    enableSystem = true,
    disableTransitionOnChange = false,
    attribute = 'data-theme',
    value,
    forcedTheme,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [theme, setThemeState] = React.useState<Theme>(() => {
      if (forcedTheme) return forcedTheme
      
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(storageKey)
          if (stored && themes.includes(stored as Theme)) {
            return stored as Theme
          }
        } catch (error) {
          // Ignore localStorage errors
        }
      }
      
      return defaultTheme
    })

    const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light')

    // System theme detection
    React.useEffect(() => {
      if (!enableSystem) return

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const updateSystemTheme = () => {
        if (theme === 'system' || forcedTheme === 'system') {
          setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
        }
      }

      updateSystemTheme()
      mediaQuery.addEventListener('change', updateSystemTheme)
      
      return () => mediaQuery.removeEventListener('change', updateSystemTheme)
    }, [theme, enableSystem, forcedTheme])

    // Update resolved theme when theme changes
    React.useEffect(() => {
      if (forcedTheme) {
        setResolvedTheme(forcedTheme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : forcedTheme as 'light' | 'dark'
        )
        return
      }

      if (theme === 'system') {
        setResolvedTheme(
          window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        )
      } else {
        setResolvedTheme(theme as 'light' | 'dark')
      }
    }, [theme, forcedTheme])

    // Apply theme to document
    React.useEffect(() => {
      const root = document.documentElement
      const actualTheme = forcedTheme || theme

      if (disableTransitionOnChange) {
        const css = document.createElement('style')
        css.appendChild(
          document.createTextNode(
            '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
          )
        )
        document.head.appendChild(css)

        requestAnimationFrame(() => {
          document.head.removeChild(css)
        })
      }

      // Remove all theme attributes
      themes.forEach((t) => {
        const val = value?.[t] || t
        root.removeAttribute(`${attribute}-${val}`)
        root.classList.remove(val)
      })

      // Apply current theme
      const themeValue = value?.[actualTheme] || actualTheme
      
      if (actualTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const systemValue = value?.[systemTheme] || systemTheme
        root.setAttribute(attribute, systemValue)
        root.classList.add(systemValue)
      } else {
        root.setAttribute(attribute, themeValue)
        root.classList.add(themeValue)
      }
    }, [theme, forcedTheme, attribute, value, themes, disableTransitionOnChange])

    const setTheme = React.useCallback((newTheme: Theme) => {
      if (forcedTheme) return
      
      setThemeState(newTheme)
      
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch (error) {
        // Ignore localStorage errors
      }
    }, [forcedTheme, storageKey])

    const contextValue = React.useMemo(
      () => ({
        theme: forcedTheme || theme,
        resolvedTheme,
        setTheme,
        themes,
      }),
      [theme, resolvedTheme, setTheme, themes, forcedTheme]
    )

    return (
      <ThemeContext.Provider value={contextValue}>
        <div ref={ref} data-testid={testId} {...props}>
          {children}
        </div>
      </ThemeContext.Provider>
    )
  }
)

ThemeProvider.displayName = 'ThemeProvider'

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProvider, type Theme, type ThemeContextType }
