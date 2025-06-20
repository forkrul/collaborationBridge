'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Supported locales configuration
const locales = [
  { code: 'en-GB', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
] as const;

export function LanguageSwitcher() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const getCurrentLocaleInfo = () => {
    return locales.find(locale => locale.code === currentLocale) || locales[0];
  };

  const currentLocaleInfo = getCurrentLocaleInfo();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute -bottom-1 -right-1 text-xs">
            {currentLocaleInfo.flag}
          </span>
          <span className="sr-only">{t('language.switchLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold">
          {t('language.selectLanguage')}
        </div>
        {locales.map((locale) => {
          const isActive = locale.code === currentLocale;
          
          return (
            <DropdownMenuItem
              key={locale.code}
              onClick={() => handleLocaleChange(locale.code)}
              className="flex items-center"
            >
              <span className="mr-2 text-base">{locale.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{locale.nativeName}</span>
                <span className="text-xs text-muted-foreground">{locale.name}</span>
              </div>
              {isActive && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook to get current locale information
export function useCurrentLocale() {
  const currentLocale = useLocale();
  return locales.find(locale => locale.code === currentLocale) || locales[0];
}

// Utility to get all available locales
export function getAvailableLocales() {
  return locales;
}
