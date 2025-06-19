'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ChevronDown, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, localeConfig, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
  showFlag?: boolean;
  className?: string;
}

export function LanguageSwitcher({ 
  variant = 'default', 
  showFlag = true,
  className 
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
    
    // Construct new path with new locale
    const newPath = newLocale === 'en-GB' 
      ? pathWithoutLocale || '/'
      : `/${newLocale}${pathWithoutLocale || '/'}`;
    
    // Store locale preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  const currentConfig = localeConfig[currentLocale];

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${className}`}
            aria-label="Change language"
            data-testid="language-switcher"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48" data-testid="language-dropdown">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`cursor-pointer ${
                locale === currentLocale ? 'bg-accent' : ''
              }`}
              data-testid={`locale-${locale}`}
            >
              <span className="font-medium">
                {localeConfig[locale].nativeName}
              </span>
              {locale === currentLocale && (
                <span className="ml-auto text-xs text-muted-foreground">
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between ${className}`}
          aria-label="Change language"
          data-testid="language-switcher"
        >
          <div className="flex items-center gap-2">
            {showFlag && <Globe className="h-4 w-4" />}
            <span>{currentConfig.nativeName}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" data-testid="language-dropdown">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`cursor-pointer ${
              locale === currentLocale ? 'bg-accent' : ''
            }`}
            data-testid={`locale-${locale}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {localeConfig[locale].nativeName}
              </span>
              <span className="text-xs text-muted-foreground">
                {localeConfig[locale].name}
              </span>
            </div>
            {locale === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
