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
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(af|en-GB|de|ro|zu|gsw-CH|es|fr|ja|zh)/:path*',

    // Enable redirects that add missing locales
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
