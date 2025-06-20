import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
  alternateLinks: true,
  pathnames: {
    '/': '/',
    '/dashboard': {
      'af': '/dashboard',
      'en-GB': '/dashboard',
      'de': '/dashboard',
      'ro': '/dashboard',
      'zu': '/dashboard',
      'gsw-CH': '/dashboard'
    },
    '/login': {
      'af': '/aanmeld',
      'en-GB': '/login',
      'de': '/anmelden',
      'ro': '/conectare',
      'zu': '/ngena',
      'gsw-CH': '/aamelde'
    }
  }
});

export const config = {
  matcher: ['/', '/(af|en-GB|de|ro|zu|gsw-CH)/:path*']
};
