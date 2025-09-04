import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported locales configuration
export const locales = [
  'af',
  'en-GB',
  'de',
  'ro',
  'zu',
  'gsw-CH',
  'zh',
  'hi',
  'es',
  'ar',
  'fr',
  'bn',
  'pt',
  'ru',
  'id'
] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en-GB';

// Locale metadata
export const localeConfig = {
  'af': {
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
    direction: 'ltr',
    region: 'ZA',
    currency: 'ZAR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h'
  },
  'en-GB': {
    name: 'English (UK)',
    nativeName: 'English (UK)',
    direction: 'ltr',
    region: 'GB',
    currency: 'GBP',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h'
  },
  'de': {
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    region: 'DE',
    currency: 'EUR',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h'
  },
  'ro': {
    name: 'Romanian',
    nativeName: 'Română',
    direction: 'ltr',
    region: 'RO',
    currency: 'RON',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h'
  },
  'zu': {
    name: 'isiZulu',
    nativeName: 'isiZulu',
    direction: 'ltr',
    region: 'ZA',
    currency: 'ZAR',
    dateFormat: 'yyyy/MM/dd',
    timeFormat: '24h'
  },
  'gsw-CH': {
    name: 'Swiss German (Zürich)',
    nativeName: 'Züritüütsch',
    direction: 'ltr',
    region: 'CH',
    currency: 'CHF',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h'
  },
  'zh': {
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr',
    region: 'CN',
    currency: 'CNY',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: '24h'
  },
  'hi': {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    region: 'IN',
    currency: 'INR',
    dateFormat: 'dd-MM-yyyy',
    timeFormat: '24h'
  },
  'es': {
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    region: 'ES',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h'
  },
  'ar': {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    region: 'SA',
    currency: 'SAR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h'
  },
  'fr': {
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    region: 'FR',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h'
  },
  'bn': {
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: 'ltr',
    region: 'BD',
    currency: 'BDT',
    dateFormat: 'dd-MM-yyyy',
    timeFormat: '24h'
  },
  'pt': {
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    region: 'PT',
    currency: 'EUR',
    dateFormat: 'dd-MM-yyyy',
    timeFormat: '24h'
  },
  'ru': {
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    region: 'RU',
    currency: 'RUB',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h'
  },
  'id': {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    direction: 'ltr',
    region: 'ID',
    currency: 'IDR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h'
  }
} as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}/common.json`)).default
  };
});
