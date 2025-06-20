# Comprehensive Internationalization (i18n) System

This document explains the complete internationalization system that supports multiple languages, locale-aware formatting, and seamless language switching.

## 🌍 Overview

The i18n system is built on `next-intl` and provides:

- **10 Supported Languages**: English (UK), Spanish, French, German, Japanese, Chinese, Afrikaans, Romanian, Zulu, Swiss German
- **Automatic Locale Detection**: Based on browser preferences and URL
- **Dynamic Language Switching**: Runtime language changes without page reload
- **Locale-Aware Formatting**: Dates, numbers, currencies, and relative time
- **Type-Safe Translations**: Full TypeScript support with autocomplete
- **Component Integration**: All UI components are fully internationalized

## 🚀 Quick Start

### Basic Usage

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('pages.home.title')}</h1>
      <p>{t('common.loading')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Using the Comprehensive Hook

```tsx
import { useI18n } from '@/hooks/use-i18n';

function MyComponent() {
  const { t, common, navigation, switchLocale, formatters } = useI18n();
  
  return (
    <div>
      <h1>{t('pages.home.title')}</h1>
      <p>{common.loading}</p>
      <button onClick={() => switchLocale('es')}>
        Switch to Spanish
      </button>
      <p>{formatters.currency(1234.56, 'EUR')}</p>
    </div>
  );
}
```

## 🗣️ Supported Languages

| Code | Language | Native Name | Flag | Status |
|------|----------|-------------|------|--------|
| en-GB | English (UK) | English | 🇬🇧 | ✅ Complete |
| es | Spanish | Español | 🇪🇸 | ✅ Complete |
| fr | French | Français | 🇫🇷 | 🚧 Partial |
| de | German | Deutsch | 🇩🇪 | ✅ Complete |
| ja | Japanese | 日本語 | 🇯🇵 | 🚧 Partial |
| zh | Chinese | 中文 | 🇨🇳 | 🚧 Partial |
| af | Afrikaans | Afrikaans | 🇿🇦 | ✅ Complete |
| ro | Romanian | Română | 🇷🇴 | ✅ Complete |
| zu | Zulu | isiZulu | 🇿🇦 | ✅ Complete |
| gsw-CH | Swiss German | Züritüütsch | 🇨🇭 | ✅ Complete |

## 📁 File Structure

```
frontend/src/i18n/
├── config.ts                 # i18n configuration
├── locales/
│   ├── en-GB/
│   │   └── common.json       # English translations
│   ├── es/
│   │   └── common.json       # Spanish translations
│   ├── fr/
│   │   └── common.json       # French translations
│   ├── de/
│   │   └── common.json       # German translations
│   ├── ja/
│   │   └── common.json       # Japanese translations
│   ├── zh/
│   │   └── common.json       # Chinese translations
│   ├── af/
│   │   └── common.json       # Afrikaans translations
│   ├── ro/
│   │   └── common.json       # Romanian translations
│   ├── zu/
│   │   └── common.json       # Zulu translations
│   └── gsw-CH/
│       └── common.json       # Swiss German translations
```

## 🔧 Translation Structure

### Hierarchical Organization

```json
{
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "login": "Login"
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  },
  "components": {
    "theme": {
      "light": "Light",
      "dark": "Dark",
      "themes": {
        "blue": "Blue",
        "green": "Green"
      }
    },
    "forms": {
      "loginForm": {
        "title": "Sign in to your account",
        "email": "Email address",
        "password": "Password"
      }
    }
  },
  "pages": {
    "home": {
      "title": "Modern Web Application",
      "subtitle": "Comprehensive Theme System"
    }
  }
}
```

### Parameterized Translations

```json
{
  "validation": {
    "minLength": "Must be at least {min} characters",
    "maxLength": "Must be no more than {max} characters"
  },
  "dashboard": {
    "welcome": "Welcome back, {name}!"
  }
}
```

## 🎯 Component Integration

### Form Components

```tsx
// LoginForm with i18n
import { useI18n } from '@/hooks/use-i18n';

function LoginForm() {
  const { forms, validation } = useI18n();
  
  return (
    <form>
      <h1>{forms.loginForm.title}</h1>
      <Input 
        label={forms.loginForm.email}
        placeholder={forms.loginForm.emailPlaceholder}
        error={validation.required}
      />
      <Button>{forms.loginForm.signIn}</Button>
    </form>
  );
}
```

### Theme Components

```tsx
// ThemeToggle with i18n
import { useI18n } from '@/hooks/use-i18n';

function ThemeToggle() {
  const { theme } = useI18n();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {theme.toggleTheme}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{theme.light}</DropdownMenuItem>
        <DropdownMenuItem>{theme.dark}</DropdownMenuItem>
        <DropdownMenuItem>{theme.system}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Notification System

```tsx
// Notifications with i18n
import { useI18n } from '@/hooks/use-i18n';

function useNotifications() {
  const { notifications } = useI18n();
  
  const showSuccess = (title?: string, message?: string) => {
    addNotification({
      type: 'success',
      title: title || notifications.success,
      message: message || notifications.loginSuccess
    });
  };
  
  return { showSuccess };
}
```

## 🌐 Language Switching

### Language Switcher Component

```tsx
import { LanguageSwitcher } from '@/components/ui/language-switcher';

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

### Programmatic Language Switching

```tsx
import { useI18n } from '@/hooks/use-i18n';

function LanguageControls() {
  const { switchLocale, availableLocales, getCurrentLocaleInfo } = useI18n();
  
  return (
    <div>
      <p>Current: {getCurrentLocaleInfo().nativeName}</p>
      {availableLocales.map(locale => (
        <button 
          key={locale.code}
          onClick={() => switchLocale(locale.code)}
        >
          {locale.flag} {locale.nativeName}
        </button>
      ))}
    </div>
  );
}
```

## 📊 Formatting Utilities

### Date and Time Formatting

```tsx
import { useI18n } from '@/hooks/use-i18n';

function DateDisplay() {
  const { formatters } = useI18n();
  const now = new Date();
  
  return (
    <div>
      <p>{formatters.date(now)}</p>
      <p>{formatters.date(now, { dateStyle: 'full' })}</p>
      <p>{formatters.relativeTime(now)}</p>
    </div>
  );
}
```

### Number and Currency Formatting

```tsx
import { useI18n } from '@/hooks/use-i18n';

function PriceDisplay({ amount }: { amount: number }) {
  const { formatters } = useI18n();
  
  return (
    <div>
      <p>{formatters.number(amount)}</p>
      <p>{formatters.currency(amount, 'EUR')}</p>
      <p>{formatters.percent(amount / 100)}</p>
    </div>
  );
}
```

## 🛠️ Adding New Languages

### 1. Create Translation File

```bash
# Create new locale directory
mkdir frontend/src/i18n/locales/pt

# Create translation file
touch frontend/src/i18n/locales/pt/common.json
```

### 2. Add Translations

```json
// frontend/src/i18n/locales/pt/common.json
{
  "navigation": {
    "home": "Início",
    "dashboard": "Painel",
    "login": "Entrar"
  },
  "common": {
    "loading": "Carregando...",
    "save": "Salvar",
    "cancel": "Cancelar"
  }
  // ... copy structure from en-GB/common.json
}
```

### 3. Update Configuration

```typescript
// frontend/src/i18n/config.ts
export const locales = ['en-GB', 'es', 'fr', 'de', 'ja', 'zh', 'pt'] as const;
```

### 4. Update Middleware

```typescript
// frontend/src/middleware.ts
export const config = {
  matcher: ['/', '/(en-GB|es|fr|de|ja|zh|pt)/:path*']
};
```

### 5. Update Language Switcher

```typescript
// frontend/src/hooks/use-i18n.ts
const availableLocales = [
  // ... existing locales
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
];
```

## 🔍 Advanced Usage

### Dynamic Translation Keys

```tsx
import { useI18n } from '@/hooks/use-i18n';

function DynamicTranslation({ type }: { type: string }) {
  const { t } = useI18n();
  
  // Dynamic key construction
  const message = t(`components.notifications.${type}` as any);
  
  return <p>{message}</p>;
}
```

### Conditional Translations

```tsx
import { useI18n } from '@/hooks/use-i18n';

function ConditionalText({ isLoading }: { isLoading: boolean }) {
  const { common, forms } = useI18n();
  
  return (
    <button>
      {isLoading ? common.loading : forms.button.submit}
    </button>
  );
}
```

### Translation with Rich Content

```tsx
import { useTranslations } from 'next-intl';

function RichTranslation() {
  const t = useTranslations();
  
  return (
    <p>
      {t.rich('auth.login.noAccount', {
        link: (chunks) => <Link href="/register">{chunks}</Link>
      })}
    </p>
  );
}
```

## ♿ Accessibility

### Screen Reader Support

```tsx
import { useI18n } from '@/hooks/use-i18n';

function AccessibleButton() {
  const { theme } = useI18n();
  
  return (
    <button aria-label={theme.toggleTheme}>
      <Icon />
      <span className="sr-only">{theme.toggleTheme}</span>
    </button>
  );
}
```

### RTL Language Support

```tsx
import { useI18n } from '@/hooks/use-i18n';

function RTLAwareComponent() {
  const { isRTL } = useI18n();
  
  return (
    <div className={cn('flex', isRTL ? 'flex-row-reverse' : 'flex-row')}>
      Content adapts to text direction
    </div>
  );
}
```

## 🚀 Performance

### Translation Loading

- **Automatic Code Splitting**: Only active locale translations are loaded
- **Static Generation**: Translations are bundled at build time
- **Caching**: Browser caches translation files
- **Lazy Loading**: Additional locales loaded on demand

### Best Practices

1. **Use Translation Keys Consistently**: Follow the hierarchical structure
2. **Avoid Hardcoded Strings**: Always use translation functions
3. **Test All Languages**: Verify layouts work with different text lengths
4. **Use Parameterized Translations**: For dynamic content
5. **Provide Fallbacks**: Handle missing translations gracefully

This comprehensive i18n system ensures your application is accessible to users worldwide with proper localization and cultural adaptation! 🌍✨
