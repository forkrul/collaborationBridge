import React, { createContext, useContext, useEffect, useState } from 'react'
import { Theme, ThemeContextValue, ThemeProviderProps } from './types'
import { baseTheme } from './base'
import { darkTheme } from './dark'
import { corporateTheme } from './corporate'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const themes: Record<string, Theme> = {
  base: baseTheme,
  dark: darkTheme,
  corporate: corporateTheme,
}

export function ThemeProvider({
  children,
  theme,
  defaultTheme = 'base',
  storageKey = 'theme',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof theme === 'string') {
      return themes[theme] ?? themes[defaultTheme]!
    }
    if (theme) {
      return theme
    }
    return themes[defaultTheme]!
  })

  const [themeName, setThemeName] = useState<string>(() => {
    if (typeof theme === 'string') {
      return theme
    }
    if (theme) {
      return theme.name
    }
    return defaultTheme
  })

  const setTheme = (newTheme: Theme | string) => {
    if (typeof newTheme === 'string') {
      const themeObj = themes[newTheme]
      if (themeObj) {
        setCurrentTheme(themeObj)
        setThemeName(newTheme)
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, newTheme)
        }
      }
    } else {
      setCurrentTheme(newTheme)
      setThemeName(newTheme.name)
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme.name)
      }
    }
  }

  const toggleDarkMode = () => {
    const newTheme = themeName === 'dark' ? 'base' : 'dark'
    setTheme(newTheme)
  }

  const isDark = themeName === 'dark'
  const availableThemes = Object.keys(themes)

  useEffect(() => {
    if (typeof window !== 'undefined' && !theme) {
      const savedTheme = localStorage.getItem(storageKey)
      if (savedTheme && themes[savedTheme]) {
        setTheme(savedTheme)
      } else if (enableSystem) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'base'
        setTheme(systemTheme)
      }
    }
  }, [theme, storageKey, enableSystem])

  const contextValue: ThemeContextValue = {
    theme: currentTheme,
    setTheme,
    themeName,
    availableThemes,
    isDark,
    toggleDarkMode,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
