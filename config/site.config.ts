/**
 * Shim rétro-compat pour le code blog pré-fusion.
 * Reconstitue la forme `siteConfig` attendue par `lib/seo.ts`, `lib/keywords/`,
 * `app/[locale]/(blog)/blog/*`, `app/[locale]/(blog)/rss.xml/route.ts`,
 * `app/api/posts/route.ts`, `scripts/generate-article.ts`, `components/Badge.tsx`,
 * depuis la source unique `brandConfig` (`@/brand.config`).
 *
 * @deprecated Pour le code nouveau, importer `brandConfig` depuis `@/brand.config`.
 */
import { brandConfig, type Category, type Keyword, type RSSFeed, type City } from '@/brand.config';

export type { Category, Keyword, RSSFeed, City };

export interface SiteConfig {
  site: {
    name: string;
    url: string;
    vitrineUrl: string;
    tagline: string;
    locale: 'fr';
    timezone: string;
    logo: { light: string; dark: string };
    foundedYear: number;
  };
  branding: {
    colors: {
      primary: string;
      primaryDark: string;
      secondary: string;
      navy: string;
      accent: string;
      light: string;
      body: string;
    };
    fonts: { heading: string; body: string; mono: string };
  };
  organization: {
    legalName: string;
    legalForm: string;
    siret?: string;
    address: { street: string; locality: string; postalCode: string; country: string };
    contactEmail: string;
    socials: { facebook?: string; instagram?: string };
    helloAsso: { donation?: string; adhesion?: string; benevolat?: string };
    petitionUrl: string;
    keyFigures: Array<{ value: string; label: string }>;
  };
  author: {
    name: string;
    email: string;
    bio: string;
    avatar?: string;
    social: { facebook?: string; instagram?: string };
  };
  categories: Category[];
  cities: City[];
  seo: {
    keywords: Keyword[];
    defaultMeta: { title: string; description: string; ogImage: string };
  };
  generation: {
    llmProvider: 'claude';
    model: string;
    targetWordCount: number;
    languages: ['fr'];
    maxArticlesPerRun: number;
  };
  n8n: { enabled: false };
  images: {
    unsplash: { enabled: boolean };
    aiGeneration: { enabled: boolean };
  };
  feeds: RSSFeed[];
  analytics: { plausibleDomain?: string };
}

export const siteConfig: SiteConfig = {
  site: {
    name: `${brandConfig.brand.name} — Actualités`,
    url: brandConfig.site.url,
    // Désormais identique au site principal (fusion vitrine+blog)
    vitrineUrl: brandConfig.site.url,
    tagline: brandConfig.brand.tagline,
    locale: 'fr',
    timezone: brandConfig.site.timezone,
    logo: brandConfig.site.logo,
    foundedYear: brandConfig.brand.foundingYear,
  },
  branding: {
    colors: {
      primary: brandConfig.colors.primary,
      primaryDark: brandConfig.colors.primaryDark,
      secondary: brandConfig.colors.secondary,
      navy: brandConfig.colors.navy,
      accent: brandConfig.colors.accent,
      light: brandConfig.colors.light,
      body: brandConfig.colors.body,
    },
    fonts: brandConfig.fonts,
  },
  organization: {
    legalName: brandConfig.brand.name,
    legalForm: brandConfig.brand.legalForm,
    siret: brandConfig.brand.siret === 'TODO_SIRET' ? undefined : brandConfig.brand.siret,
    address: {
      street: 'Quartier Moulin Galant',
      locality: brandConfig.contact.addressLocality,
      postalCode: brandConfig.contact.postalCode,
      country: brandConfig.contact.country,
    },
    contactEmail: brandConfig.contact.email,
    socials: {
      facebook: brandConfig.social.facebook,
      instagram: brandConfig.social.instagram,
    },
    helloAsso: {
      donation: brandConfig.helloasso.don,
      adhesion: brandConfig.helloasso.adhesion,
      benevolat: brandConfig.helloasso.benevolat,
    },
    petitionUrl: brandConfig.social.petition,
    keyFigures: brandConfig.blog.keyFigures,
  },
  author: {
    name: brandConfig.brand.name,
    email: brandConfig.contact.email,
    bio: "Association de quartier à Corbeil-Essonnes (91), créée en 2018. 150+ familles soutenues, 12+ événements par an.",
    avatar: brandConfig.site.logo.light,
    social: {
      facebook: brandConfig.social.facebook,
      instagram: brandConfig.social.instagram,
    },
  },
  categories: brandConfig.blog.categories,
  cities: brandConfig.blog.cities,
  seo: {
    keywords: brandConfig.blog.keywords,
    defaultMeta: {
      title: `${brandConfig.brand.name} — Actualités du quartier`,
      description:
        "Le blog de l'association Voisins Moulin Galant : événements, mobilisations, vie de quartier à Corbeil-Essonnes depuis 2018.",
      ogImage: brandConfig.seo.ogImage,
    },
  },
  generation: brandConfig.blog.generation,
  n8n: { enabled: false },
  images: {
    unsplash: { enabled: false },
    aiGeneration: { enabled: false },
  },
  feeds: brandConfig.blog.feeds,
  analytics: brandConfig.analytics,
};

export function getKeywordsByCategory(category: string): Keyword[] {
  return siteConfig.seo.keywords.filter((k) => k.category === category);
}

export function getHighPriorityKeywords(): Keyword[] {
  return siteConfig.seo.keywords.filter((k) => k.priority === 1);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return siteConfig.categories.find((c) => c.slug === slug);
}

export function getCategoryName(category: Category): string {
  const names = category.name as Record<string, string>;
  return names.fr;
}

export function getCityBySlug(slug: string): City | undefined {
  return siteConfig.cities.find((c) => c.slug === slug);
}

export function getAllCities(): City[] {
  return siteConfig.cities;
}

export const KEYWORD_STATS = {
  total: siteConfig.seo.keywords.length,
};
