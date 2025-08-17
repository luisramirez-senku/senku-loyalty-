
import createMiddleware from 'next-intl/middleware';
import {locales, pathnames} from './i18n';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales,
  pathnames,
 
  // Used when no locale matches
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(es|en|fr)/:path*',

    // Enable redirects that add a locale prefix
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next/static|_next/image|favicon.ico|api).*)'
  ]
};
