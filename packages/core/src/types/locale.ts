/**
 * Internationalization and localization types
 */

/**
 * Supported locale codes
 */
export type SupportedLocale = 'af' | 'en-GB' | 'de' | 'ro' | 'zu' | 'gsw-CH'

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /** Locale code */
  code: SupportedLocale
  /** Display name */
  name: string
  /** Native name */
  nativeName: string
  /** Text direction */
  direction: 'ltr' | 'rtl'
  /** Date format */
  dateFormat: string
  /** Time format */
  timeFormat: string
  /** Number format */
  numberFormat: {
    decimal: string
    thousands: string
    currency: string
  }
  /** Pluralization rules */
  pluralRules: (count: number) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
}

/**
 * Translation message types
 */
export interface TranslationMessages {
  [key: string]: string | TranslationMessages
}

/**
 * Translation function type
 */
export type TranslationFunction = (
  key: string,
  values?: Record<string, string | number>
) => string

/**
 * Locale context value
 */
export interface LocaleContextValue {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  messages: TranslationMessages
  t: TranslationFunction
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string
  formatTime: (date: Date, options?: Intl.DateTimeFormatOptions) => string
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (amount: number, currency: string, options?: Intl.NumberFormatOptions) => string
  formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => string
}

/**
 * Locale provider props
 */
export interface LocaleProviderProps {
  children: React.ReactNode
  locale?: SupportedLocale
  messages?: Record<SupportedLocale, TranslationMessages>
  defaultLocale?: SupportedLocale
  onLocaleChange?: (locale: SupportedLocale) => void
}

/**
 * RTL support configuration
 */
export interface RTLConfig {
  /** Whether RTL is enabled */
  enabled: boolean
  /** RTL locales */
  rtlLocales: SupportedLocale[]
  /** CSS class for RTL */
  rtlClass: string
  /** Whether to mirror icons */
  mirrorIcons: boolean
}

/**
 * Date and time formatting options
 */
export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  /** Custom format pattern */
  pattern?: string
  /** Relative formatting */
  relative?: boolean
  /** Include time */
  includeTime?: boolean
}

/**
 * Number formatting options
 */
export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  /** Compact notation */
  compact?: boolean
  /** Unit display */
  unit?: string
  /** Percentage formatting */
  percentage?: boolean
}

/**
 * Pluralization options
 */
export interface PluralizationOptions {
  /** Count for pluralization */
  count: number
  /** Zero form */
  zero?: string
  /** One form */
  one?: string
  /** Two form */
  two?: string
  /** Few form */
  few?: string
  /** Many form */
  many?: string
  /** Other form */
  other: string
}
