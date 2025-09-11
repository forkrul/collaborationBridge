'use client';

import { ColorTheme } from '@/components/ui/theme-provider';

/**
 * Maps our existing 9 color themes to Reshaped theme configuration
 * This allows us to maintain the same visual themes during migration
 */

// Base color mappings for each theme
const colorMappings = {
  blue: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    neutral: '#6b7280',
  },
  green: {
    primary: '#10b981',
    secondary: '#64748b',
    success: '#22c55e',
    warning: '#f59e0b',
    critical: '#ef4444',
    neutral: '#6b7280',
  },
  purple: {
    primary: '#8b5cf6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    neutral: '#6b7280',
  },
  orange: {
    primary: '#f97316',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    neutral: '#6b7280',
  },
  red: {
    primary: '#ef4444',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    critical: '#dc2626',
    neutral: '#6b7280',
  },
  'high-contrast': {
    primary: '#000000',
    secondary: '#374151',
    success: '#059669',
    warning: '#d97706',
    critical: '#dc2626',
    neutral: '#4b5563',
  },
  light: {
    primary: '#6366f1',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    neutral: '#6b7280',
  },
  corporate: {
    primary: '#1e40af',
    secondary: '#64748b',
    success: '#059669',
    warning: '#d97706',
    critical: '#dc2626',
    neutral: '#6b7280',
  },
  'dark-soft': {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    success: '#34d399',
    warning: '#fbbf24',
    critical: '#f87171',
    neutral: '#9ca3af',
  },
};

/**
 * Creates a Reshaped theme configuration based on our color theme and appearance mode
 */
export function createReshapedTheme(colorTheme: ColorTheme, isDark: boolean) {
  const colors = colorMappings[colorTheme];
  
  return {
    name: `${colorTheme}-${isDark ? 'dark' : 'light'}`,
    colorMode: isDark ? 'dark' : 'light',
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      positive: colors.success,
      warning: colors.warning,
      critical: colors.critical,
      neutral: colors.neutral,
      // Background colors based on mode
      background: isDark ? '#0f172a' : '#ffffff',
      backgroundElevated: isDark ? '#1e293b' : '#f8fafc',
      // Text colors based on mode
      foreground: isDark ? '#f1f5f9' : '#0f172a',
      foregroundNeutral: isDark ? '#cbd5e1' : '#475569',
      foregroundNeutralFaded: isDark ? '#94a3b8' : '#64748b',
    },
    // Typography settings
    typography: {
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
    // Spacing and layout
    spacing: {
      unit: 4, // 4px base unit
    },
    // Border radius
    radius: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
    // Shadows
    shadow: {
      small: isDark 
        ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
        : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      medium: isDark 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: isDark 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  };
}

/**
 * Default theme configuration for Reshaped
 */
export const defaultReshapedTheme = createReshapedTheme('blue', false);

/**
 * Theme mapping utilities
 */
export const themeUtils = {
  /**
   * Maps shadcn/ui button variants to Reshaped equivalents
   */
  mapButtonVariant: (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return { color: 'critical', variant: 'solid' };
      case 'outline':
        return { color: 'neutral', variant: 'outline' };
      case 'secondary':
        return { color: 'neutral', variant: 'faded' };
      case 'ghost':
        return { color: 'neutral', variant: 'ghost' };
      case 'link':
        return { color: 'primary', variant: 'ghost' };
      default:
        return { color: 'primary', variant: 'solid' };
    }
  },

  /**
   * Maps shadcn/ui sizes to Reshaped equivalents
   */
  mapSize: (size?: string) => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'large';
      case 'icon':
        return 'medium';
      default:
        return 'medium';
    }
  },

  /**
   * Maps semantic colors between systems
   */
  mapSemanticColor: (color?: string) => {
    switch (color) {
      case 'destructive':
        return 'critical';
      case 'success':
        return 'positive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'neutral';
    }
  },
};
