# Internationalization (i18n) Guide

## Overview

This application supports multiple languages through a comprehensive internationalization system built on industry-standard libraries and best practices.

## Supported Languages

- **Afrikaans (af)** - South African Afrikaans
- **English UK (en-GB)** - British English (default)
- **German (de)** - Standard German
- **Romanian (ro)** - Romanian
- **isiZulu (zu)** - South African Zulu
- **Swiss German (gsw-CH)** - Zürich dialect

## Frontend Usage

### Basic Translation

```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description', { name: 'John' })}</p>
    </div>
  );
}
```

### Language Switching

```typescript
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

function Header() {
  return (
    <header>
      <nav>
        {/* Other navigation items */}
        <LanguageSwitcher variant="compact" />
      </nav>
    </header>
  );
}
```

## Backend Usage

### Translation in API Responses

```python
from src.project_name.i18n.manager import translate

@router.get("/welcome")
async def get_welcome_message(locale: str = Depends(get_current_locale)):
    message = translate("welcome_message", locale, name="User")
    return {"message": message}
```

### Locale-aware Formatting

```python
from src.project_name.i18n.manager import get_translation_manager

@router.get("/stats")
async def get_stats(locale: str = Depends(get_current_locale)):
    manager = get_translation_manager()
    
    return {
        "revenue": manager.format_currency(12345.67, locale),
        "date": manager.format_datetime(datetime.now(), locale),
        "users": manager.format_number(1234, locale)
    }
```

## Adding New Languages

### 1. Update Configuration

Add the new locale to the configuration files:

```typescript
// frontend/src/i18n/config.ts
export const locales = ['af', 'en-GB', 'de', 'ro', 'zu', 'gsw-CH', 'new-locale'] as const;
```

```python
# src/project_name/i18n/config.py
class SupportedLocale(str, Enum):
    # ... existing locales
    NEW_LOCALE = "new_locale"
```

### 2. Create Translation Files

Create translation files for the new locale:

```
frontend/src/i18n/locales/new-locale/
├── common.json
└── ...
```

```
src/project_name/i18n/locales/new_locale/
└── LC_MESSAGES/
    ├── messages.po
    └── messages.mo
```

## API Endpoints

### Get Supported Locales

```http
GET /api/v1/i18n/locales
```

Returns a list of all supported locales with their metadata.

### Translate Text

```http
POST /api/v1/i18n/translate
Content-Type: application/json

{
  "key": "welcome_message",
  "locale": "de",
  "variables": {"name": "John"}
}
```

### Format Currency

```http
GET /api/v1/i18n/format/currency?amount=1234.56&locale=de
```

### Format DateTime

```http
GET /api/v1/i18n/format/datetime?datetime_str=2024-01-15T14:30:00Z&locale=de
```

## Testing

### Frontend Tests

```typescript
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  welcome: 'Welcome {name}!'
};

test('renders translated content', () => {
  render(
    <NextIntlClientProvider messages={messages} locale="en-GB">
      <MyComponent />
    </NextIntlClientProvider>
  );
  
  expect(screen.getByText('Welcome John!')).toBeInTheDocument();
});
```

### Backend Tests

```python
def test_translate():
    result = translate("welcome_message", "en_GB", name="John")
    assert "John" in result
```

## Configuration

### Frontend Configuration

The frontend i18n is configured in `frontend/src/i18n/config.ts`:

- Supported locales
- Locale metadata (currency, date format, etc.)
- Default locale settings

### Backend Configuration

The backend i18n is configured in `src/project_name/i18n/config.py`:

- Supported locales enum
- Locale configurations
- Translation domains

### Middleware

Next.js middleware automatically detects and handles locale routing in `frontend/src/middleware.ts`.

## Performance

- Translation files are automatically code-split by locale
- Translations are cached on both client and server
- Only required translations are loaded per page
- Lazy loading for non-critical translations

## Accessibility

- Automatic `lang` attribute setting
- RTL language support (when needed)
- Screen reader compatibility
- WCAG 2.1 AA compliance maintained
