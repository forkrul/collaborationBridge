'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'high-contrast' | 'light' | 'corporate' | 'dark-soft';
export type AppearanceMode = 'light' | 'dark' | 'system';

interface ExtendedThemeProviderProps extends Omit<ThemeProviderProps, 'themes'> {
  children: React.ReactNode;
  colorTheme?: ColorTheme;
  onColorThemeChange?: (theme: ColorTheme) => void;
}

const ThemeContext = React.createContext<{
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  availableColorThemes: ColorTheme[];
}>({
  colorTheme: 'blue',
  setColorTheme: () => {},
  availableColorThemes: ['blue', 'green', 'purple', 'orange', 'red', 'high-contrast'],
});

export function ThemeProvider({
  children,
  colorTheme = 'dark-soft',
  onColorThemeChange,
  ...props
}: ExtendedThemeProviderProps) {
  const [currentColorTheme, setCurrentColorTheme] = React.useState<ColorTheme>(colorTheme);

  const availableColorThemes: ColorTheme[] = [
    'blue',
    'green',
    'purple',
    'orange',
    'red',
    'high-contrast',
    'light',
    'corporate',
    'dark-soft'
  ];

  const setColorTheme = React.useCallback((theme: ColorTheme) => {
    setCurrentColorTheme(theme);
    onColorThemeChange?.(theme);

    // Apply theme class to document
    const root = document.documentElement;

    // Remove existing theme classes
    availableColorThemes.forEach(t => {
      root.classList.remove(`theme-${t}`);
    });

    // Add new theme class
    if (theme !== 'blue') { // blue is the default, no class needed
      root.classList.add(`theme-${theme}`);
    }

    // Store in localStorage
    localStorage.setItem('color-theme', theme);
  }, [onColorThemeChange, availableColorThemes]);

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('color-theme') as ColorTheme;
    if (stored && availableColorThemes.includes(stored)) {
      setColorTheme(stored);
    }
  }, [setColorTheme, availableColorThemes]);

  // Apply theme class on theme change
  React.useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    availableColorThemes.forEach(t => {
      root.classList.remove(`theme-${t}`);
    });

    // Add current theme class
    if (currentColorTheme !== 'blue') {
      root.classList.add(`theme-${currentColorTheme}`);
    }
  }, [currentColorTheme, availableColorThemes]);

  const contextValue = React.useMemo(() => ({
    colorTheme: currentColorTheme,
    setColorTheme,
    availableColorThemes,
  }), [currentColorTheme, setColorTheme, availableColorThemes]);

  return (
    <NextThemesProvider
      themes={['light', 'dark']}
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export const useColorTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ThemeProvider');
  }
  return context;
};
