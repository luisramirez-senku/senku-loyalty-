
import createMiddleware from 'next-intl/middleware';
import {locales, pathnames} from './i18n';

export default createMiddleware({
  defaultLocale: 'es',
  locales,
  pathnames,
  localePrefix: 'as-needed'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|es|fr)/:path*']
};
