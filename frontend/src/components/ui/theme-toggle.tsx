'use client';

import * as React from 'react';
import { Moon, Sun, Palette, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useColorTheme, type ColorTheme } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

// Remove hardcoded labels - will use translations instead

const colorThemeColors: Record<ColorTheme, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  'high-contrast': 'bg-gray-900 dark:bg-gray-100',
};

export function ThemeToggle() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme, availableColorThemes } = useColorTheme();

  const getThemeLabel = (themeKey: ColorTheme): string => {
    const themeMap: Record<ColorTheme, string> = {
      'blue': 'blue',
      'green': 'green',
      'purple': 'purple',
      'orange': 'orange',
      'red': 'red',
      'high-contrast': 'highContrast'
    };
    return t(`components.theme.themes.${themeMap[themeKey]}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('components.theme.toggleTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Appearance Mode */}
        <div className="px-2 py-1.5 text-sm font-semibold">{t('components.theme.appearance')}</div>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          {t('components.theme.light')}
          {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          {t('components.theme.dark')}
          {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          {t('components.theme.system')}
          {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Color Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            {t('components.theme.colorTheme')}
            <div className={cn('ml-auto h-3 w-3 rounded-full', colorThemeColors[colorTheme])} />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {availableColorThemes.map((theme) => (
              <DropdownMenuItem
                key={theme}
                onClick={() => setColorTheme(theme)}
                className="flex items-center"
              >
                <div className={cn('mr-2 h-3 w-3 rounded-full', colorThemeColors[theme])} />
                {getThemeLabel(theme)}
                {colorTheme === theme && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
