'use client';

import React, { useMemo } from 'react';
import { Reshaped } from 'reshaped';
import { useTheme } from 'next-themes';
import { useColorTheme } from '@/components/ui/theme-provider';
import { createReshapedTheme } from '@/lib/reshaped-theme';

interface CoexistenceProviderProps {
  children: React.ReactNode;
}

/**
 * CoexistenceProvider allows both shadcn/ui and Reshaped UI to work together
 * during the migration period. It:
 * 1. Wraps children with Reshaped provider
 * 2. Maps current theme settings to Reshaped theme
 * 3. Maintains theme synchronization between both systems
 */
export function CoexistenceProvider({ children }: CoexistenceProviderProps) {
  const { theme: appearanceMode } = useTheme();
  const { colorTheme } = useColorTheme();

  // Create Reshaped theme based on current settings
  const reshapedTheme = useMemo(() => {
    const isDark = appearanceMode === 'dark';
    return createReshapedTheme(colorTheme, isDark);
  }, [colorTheme, appearanceMode]);

  return (
    <Reshaped theme={reshapedTheme}>
      {children}
    </Reshaped>
  );
}

/**
 * Hook to access both theme systems during migration
 */
export function useMigrationTheme() {
  const { theme: appearanceMode, setTheme: setAppearanceMode } = useTheme();
  const { colorTheme, setColorTheme, availableColorThemes } = useColorTheme();

  const reshapedTheme = useMemo(() => {
    const isDark = appearanceMode === 'dark';
    return createReshapedTheme(colorTheme, isDark);
  }, [colorTheme, appearanceMode]);

  return {
    // Current theme state
    appearanceMode,
    colorTheme,
    isDark: appearanceMode === 'dark',
    
    // Theme setters
    setAppearanceMode,
    setColorTheme,
    
    // Available options
    availableColorThemes,
    
    // Reshaped theme object
    reshapedTheme,
    
    // Utility functions
    toggleDarkMode: () => {
      setAppearanceMode(appearanceMode === 'dark' ? 'light' : 'dark');
    },
  };
}
