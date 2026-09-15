import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale, type Locale } from './config';

export type { Locale };

export const routing = defineRouting({
  locales,
  defaultLocale,
  pathnames: {
    '/': '/',
    '/qui-sommes-nous': '/qui-sommes-nous',
    '/nos-actions': '/nos-actions',
    '/dons': '/dons',
    '/adhesion': '/adhesion',
    '/benevolat': '/benevolat',
    '/contact': '/contact',
    '/mentions-legales': '/mentions-legales',
    '/confidentialite': '/confidentialite',
    '/rgpd': '/rgpd',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/category/[category]': '/category/[category]',
    '/tag/[tag]': '/tag/[tag]',
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
