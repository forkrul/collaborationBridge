import { useTranslations, useLocale, useFormatter } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Comprehensive i18n hook that provides translations, locale management, and formatting utilities
 */
export function useI18n() {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const router = useRouter();
  const pathname = usePathname();

  // Common translation shortcuts
  const common = {
    loading: t('common.loading'),
    error: t('common.error'),
    retry: t('common.retry'),
    cancel: t('common.cancel'),
    save: t('common.save'),
    delete: t('common.delete'),
    edit: t('common.edit'),
    close: t('common.close'),
    confirm: t('common.confirm'),
  };

  const navigation = {
    home: t('navigation.home'),
    dashboard: t('navigation.dashboard'),
    login: t('navigation.login'),
    logout: t('navigation.logout'),
    profile: t('navigation.profile'),
    settings: t('navigation.settings'),
  };

  const validation = {
    required: t('validation.required'),
    email: t('validation.email'),
    minLength: (min: number) => t('validation.minLength', { min }),
    maxLength: (max: number) => t('validation.maxLength', { max }),
    passwordMatch: t('validation.passwordMatch'),
  };

  const notifications = {
    success: t('components.notifications.success'),
    error: t('components.notifications.error'),
    warning: t('components.notifications.warning'),
    info: t('components.notifications.info'),
    dismiss: t('components.notifications.dismiss'),
    testNotifications: t('components.notifications.testNotifications'),
    loginSuccess: t('components.notifications.loginSuccess'),
    loginFailed: t('components.notifications.loginFailed'),
    welcomeBack: t('components.notifications.welcomeBack'),
    loggedOut: t('components.notifications.loggedOut'),
    loggedOutMessage: t('components.notifications.loggedOutMessage'),
  };

  const theme = {
    light: t('components.theme.light'),
    dark: t('components.theme.dark'),
    system: t('components.theme.system'),
    toggleTheme: t('components.theme.toggleTheme'),
    currentTheme: (theme: string) => t('components.theme.currentTheme', { theme }),
    appearance: t('components.theme.appearance'),
    colorTheme: t('components.theme.colorTheme'),
    themes: {
      blue: t('components.theme.themes.blue'),
      green: t('components.theme.themes.green'),
      purple: t('components.theme.themes.purple'),
      orange: t('components.theme.themes.orange'),
      red: t('components.theme.themes.red'),
      highContrast: t('components.theme.themes.highContrast'),
    },
    themeChanged: t('components.theme.themeChanged'),
    switchedTo: (theme: string) => t('components.theme.switchedTo', { theme }),
  };

  const forms = {
    input: {
      showPassword: t('components.forms.input.showPassword'),
      hidePassword: t('components.forms.input.hidePassword'),
      required: t('components.forms.input.required'),
      optional: t('components.forms.input.optional'),
      helperText: t('components.forms.input.helperText'),
    },
    button: {
      loading: t('components.forms.button.loading'),
      submit: t('components.forms.button.submit'),
      cancel: t('components.forms.button.cancel'),
      save: t('components.forms.button.save'),
      delete: t('components.forms.button.delete'),
      edit: t('components.forms.button.edit'),
      create: t('components.forms.button.create'),
      update: t('components.forms.button.update'),
    },
    loginForm: {
      title: t('components.forms.loginForm.title'),
      subtitle: t('components.forms.loginForm.subtitle'),
      email: t('components.forms.loginForm.email'),
      emailPlaceholder: t('components.forms.loginForm.emailPlaceholder'),
      password: t('components.forms.loginForm.password'),
      passwordPlaceholder: t('components.forms.loginForm.passwordPlaceholder'),
      rememberMe: t('components.forms.loginForm.rememberMe'),
      forgotPassword: t('components.forms.loginForm.forgotPassword'),
      signIn: t('components.forms.loginForm.signIn'),
      signingIn: t('components.forms.loginForm.signingIn'),
      noAccount: t('components.forms.loginForm.noAccount'),
      signUpHere: t('components.forms.loginForm.signUpHere'),
      demoCredentials: t('components.forms.loginForm.demoCredentials'),
      invalidCredentials: t('components.forms.loginForm.invalidCredentials'),
    },
  };

  // Locale switching function
  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  // Format utilities
  const formatters = {
    date: (date: Date, options?: Intl.DateTimeFormatOptions) => 
      format.dateTime(date, options),
    
    number: (number: number, options?: Intl.NumberFormatOptions) => 
      format.number(number, options),
    
    currency: (amount: number, currency = 'USD') => 
      format.number(amount, { style: 'currency', currency }),
    
    percent: (value: number) => 
      format.number(value, { style: 'percent' }),
    
    relativeTime: (date: Date) => 
      format.relativeTime(date),
  };

  // Get available locales
  const availableLocales = [
    { code: 'en-GB', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    // Legacy locales from existing config
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
    { code: 'gsw-CH', name: 'Swiss German', nativeName: 'Züritüütsch', flag: '🇨🇭' },
  ];

  const getCurrentLocaleInfo = () => {
    return availableLocales.find(loc => loc.code === locale) || availableLocales[0];
  };

  // Direction helper (for RTL languages)
  const isRTL = ['ar', 'he', 'fa'].includes(locale);

  return {
    // Core functions
    t,
    locale,
    format,
    
    // Shortcuts
    common,
    navigation,
    validation,
    notifications,
    theme,
    forms,
    
    // Locale management
    switchLocale,
    availableLocales,
    getCurrentLocaleInfo,
    isRTL,
    
    // Formatters
    formatters,
    
    // Raw translation function for dynamic keys
    translate: t,
  };
}

// Type for the hook return value
export type I18nHook = ReturnType<typeof useI18n>;

// Helper function to get translation key suggestions
export function getTranslationKeys() {
  return {
    common: [
      'loading', 'error', 'retry', 'cancel', 'save', 'delete', 'edit', 'close', 'confirm'
    ],
    navigation: [
      'home', 'dashboard', 'login', 'logout', 'profile', 'settings'
    ],
    validation: [
      'required', 'email', 'minLength', 'maxLength', 'passwordMatch'
    ],
    components: {
      theme: [
        'light', 'dark', 'system', 'toggleTheme', 'currentTheme', 'appearance', 'colorTheme'
      ],
      notifications: [
        'success', 'error', 'warning', 'info', 'dismiss', 'testNotifications'
      ],
      forms: {
        input: ['showPassword', 'hidePassword', 'required', 'optional'],
        button: ['loading', 'submit', 'cancel', 'save', 'delete', 'edit'],
        loginForm: ['title', 'subtitle', 'email', 'password', 'signIn', 'signUpHere']
      }
    }
  };
}
