import type { Metadata } from 'next';
import { templateConfig } from '@/template.config';

export const metadata: Metadata = {
  title: {
    default: templateConfig.seo.defaultTitle,
    template: templateConfig.seo.titleTemplate,
  },
  description: templateConfig.seo.defaultDescription,
  keywords: templateConfig.seo.keywords,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://voisinsmoulingalant.fr'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://voisinsmoulingalant.fr',
    siteName: templateConfig.brand.name,
    title: templateConfig.seo.defaultTitle,
    description: templateConfig.seo.defaultDescription,
    images: [{ url: templateConfig.assets.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: templateConfig.seo.defaultTitle,
    description: templateConfig.seo.defaultDescription,
    images: [templateConfig.assets.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
