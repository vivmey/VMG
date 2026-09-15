/**
 * brand.config.ts — Source unique de vérité de la marque VMG (vitrine + blog fusionnés).
 *
 * Consolide :
 *  - ex-`template.config.ts` (vitrine)
 *  - ex-`config/site.config.ts` + `config/presets/vmg.ts` (blog)
 *
 * Phase 1 : statique. Phase 2 : bascule possible vers `merenza-cms` (Strapi multi-tenant, ADR 014).
 * Le flag `articlesSource: 'mdx' | 'strapi' | 'hybrid'` permet la bascule sans rewrite.
 * - `mdx` : 207 articles locaux uniquement (Phase 1, défaut).
 * - `strapi` : Strapi uniquement (Phase 2 bascule complète).
 * - `hybrid` : merge MDX + Strapi avec MDX prioritaire par slug (anti-régression 207 articles).
 *   Les nouveaux articles publiés dans Strapi apparaissent en tête de liste,
 *   les 207 MDX historiques restent figés et intacts.
 *
 * Convention pattern multi-brand (ADR 017 Axe A) :
 * un seul fichier `brand.config.ts` par partenaire. Pour le partenaire suivant,
 * cloner `packages/partner-template/` (à extraire Vague 2) puis ne modifier que ce fichier.
 */

export interface Category {
  id: string;
  name: { fr: string } | { fr: string; en: string };
  slug: string;
  description: string;
  color: string;
  icon?: string;
}

export interface Keyword {
  term: string;
  volume: number;
  competition: number;
  trend?: number;
  priority: 1 | 2 | 3;
  category: string;
}

export interface RSSFeed {
  name: string;
  url: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  language: string;
}

export interface City {
  slug: string;
  name: { fr: string };
  country: string;
  timezone?: string;
  coordinates?: { lat: number; lng: number };
}

export type ArticlesSource = 'mdx' | 'strapi' | 'hybrid';

export interface BrandConfig {
  brand: {
    name: string;
    shortName: string;
    slug: string;
    tagline: string;
    foundingYear: number;
    legalForm: string;
    siret: string;
    publicationDirector: string;
  };
  site: {
    url: string;
    locale: 'fr';
    timezone: string;
    logo: { light: string; dark: string };
  };
  assets: {
    logoLight: string;
    logoDark: string;
    heroImage: string;
    ogImage: string;
  };
  colors: Record<string, string>;
  fonts: { heading: string; body: string; mono: string };
  contact: {
    email: string;
    address: string;
    addressLocality: string;
    postalCode: string;
    region: string;
    country: string;
  };
  hours: { permanence: string; events: string; support: string };
  social: { facebook: string; instagram: string; petition: string };
  navigation: {
    main: Array<{ key: string; href: string }>;
    footer: {
      asso: Array<{ key: string; href: string }>;
      engagement: Array<{ key: string; href: string; external?: boolean }>;
      legal: Array<{ key: string; href: string }>;
    };
  };
  stats: Array<{ value: string; key: string }>;
  valueProps: Array<{ icon: string; key: string }>;
  actions: Array<{ id: string; key: string; icon: string; image: string }>;
  process: Array<{ number: string; key: string; icon: string }>;
  neighborhood: {
    center: { lat: number; lng: number };
    zoom: number;
    points: Array<{ key: string; lat: number; lng: number; type: string }>;
  };
  partners: Array<{ key: string; logo: string; url: string }>;
  specialties: string[];
  gallery: string[];
  testimonial: { image: string };
  faq: Array<{ key: string }>;
  /** Articles fallback (3 placeholders quand articlesSource === 'mdx' et getAllPosts() vide). */
  articlesFallback: Array<{
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    category: string;
    image: string;
    readingTime: number;
  }>;
  ctas: {
    primary: { key: string; href: string };
    secondary: { key: string; href: string };
    tertiary: { key: string; href: string };
    petition: { key: string; href: string; external: boolean };
  };
  helloasso: { don: string; adhesion: string; benevolat: string };
  /** Blog. */
  blog: {
    articlesSource: ArticlesSource;
    categories: Category[];
    cities: City[];
    feeds: RSSFeed[];
    keywords: Keyword[];
    generation: {
      llmProvider: 'claude';
      model: string;
      targetWordCount: number;
      languages: ['fr'];
      maxArticlesPerRun: number;
    };
    keyFigures: Array<{ value: string; label: string }>;
  };
  /** Strapi (merenza-cms, ADR 014). Lu si articlesSource === 'strapi'. */
  cms: {
    url: string;
    apiToken?: string;
    brandSlug: 'voisins-moulin-galant';
    locale: 'fr';
  };
  locales: readonly ['fr'];
  defaultLocale: 'fr';
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    ogImage: string;
  };
  analytics: { plausibleDomain?: string };
}

export const brandConfig: BrandConfig = {
  brand: {
    name: 'Voisins Moulin Galant',
    shortName: 'VMG',
    slug: 'voisins-moulin-galant',
    tagline: 'Créer du lien et agir ensemble pour notre quartier',
    foundingYear: 2018,
    legalForm: 'Association loi 1901',
    siret: 'TODO_SIRET',
    publicationDirector: 'TODO_PRESIDENT',
  },

  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://voisinsmoulingalant.fr',
    locale: 'fr',
    timezone: 'Europe/Paris',
    logo: {
      light: '/images/logo-vmg-dark.png',
      dark: '/images/logo-vmg-light.png',
    },
  },

  assets: {
    logoLight: '/images/logo-vmg-light.png',
    logoDark: '/images/logo-vmg-dark-2.png',
    heroImage: '/images/hero-corbeil.jpg',
    ogImage: '/images/gallery/vmg-09.jpg',
  },

  colors: {
    primary: '#E85D33',
    primaryLight: '#F4825E',
    primaryDark: '#C44818',
    secondary: '#2D8F6F',
    secondaryDark: '#216C53',
    navy: '#1F3A5F',
    navyDark: '#142847',
    accent: '#F5C842',
    light: '#FFF7F2',
    body: '#3A3A3A',
  },

  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },

  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@voisinsmoulingalant.fr',
    address: 'Quartier Moulin Galant, 91100 Corbeil-Essonnes',
    addressLocality: 'Corbeil-Essonnes',
    postalCode: '91100',
    region: 'Île-de-France',
    country: 'FR',
  },

  hours: {
    permanence: 'Sur rendez-vous',
    events: 'Événements ponctuels — voir Facebook & Instagram',
    support: 'Réponse sous 48h',
  },

  social: {
    facebook: 'https://www.facebook.com/voisinsmoulingalant',
    instagram: 'https://www.instagram.com/voisins_mg',
    petition: 'https://change.org/pomchouvmg',
  },

  navigation: {
    main: [
      { key: 'home', href: '/' },
      { key: 'about', href: '/qui-sommes-nous' },
      { key: 'actions', href: '/nos-actions' },
      { key: 'blog', href: '/blog' },
      { key: 'contact', href: '/contact' },
    ],
    footer: {
      asso: [
        { key: 'about', href: '/qui-sommes-nous' },
        { key: 'actions', href: '/nos-actions' },
        { key: 'blog', href: '/blog' },
        { key: 'contact', href: '/contact' },
      ],
      engagement: [
        { key: 'don', href: '/dons' },
        { key: 'adhesion', href: '/adhesion' },
        { key: 'benevolat', href: '/benevolat' },
        { key: 'petition', href: 'https://change.org/pomchouvmg', external: true },
      ],
      legal: [
        { key: 'mentionsLegales', href: '/mentions-legales' },
        { key: 'confidentialite', href: '/confidentialite' },
        { key: 'rgpd', href: '/rgpd' },
      ],
    },
  },

  stats: [
    { value: '150+', key: 'familles' },
    { value: '12', key: 'evenements' },
    { value: '7+', key: 'annees' },
  ],

  valueProps: [
    { icon: 'HeartHandshake', key: 'solidarite' },
    { icon: 'Users', key: 'communaute' },
    { icon: 'Sprout', key: 'environnement' },
    { icon: 'Calendar', key: 'evenements' },
    { icon: 'Megaphone', key: 'mobilisation' },
    { icon: 'MapPin', key: 'local' },
  ],

  actions: [
    { id: 'aide-alimentaire', key: 'aideAlimentaire', icon: 'UtensilsCrossed', image: '/images/gallery/vmg-07.avif' },
    { id: 'friperie', key: 'friperie', icon: 'ShoppingBag', image: '/images/gallery/vmg-08.avif' },
    { id: 'evenements', key: 'evenements', icon: 'PartyPopper', image: '/images/gallery/vmg-09.jpg' },
    { id: 'mobilisation', key: 'mobilisation', icon: 'Megaphone', image: '/images/gallery/vmg-10.avif' },
  ],

  process: [
    { number: '01', key: 'decouvrir', icon: 'Eye' },
    { number: '02', key: 'adherer', icon: 'UserPlus' },
    { number: '03', key: 'engager', icon: 'HeartHandshake' },
    { number: '04', key: 'agir', icon: 'Sparkles' },
  ],

  neighborhood: {
    center: { lat: 48.6097, lng: 2.4825 },
    zoom: 14,
    points: [
      { key: 'parcPapeterie', lat: 48.611, lng: 2.484, type: 'event' },
      { key: 'distribution', lat: 48.608, lng: 2.481, type: 'aide' },
      { key: 'friperie', lat: 48.609, lng: 2.479, type: 'commerce' },
      { key: 'mairie', lat: 48.6135, lng: 2.4779, type: 'institution' },
    ],
  },

  partners: [
    { key: 'merenza', logo: '/images/partners/merenza.svg', url: 'https://merenza.com' },
    { key: 'mairie', logo: '/images/partners/mairie-corbeil.svg', url: 'https://www.mairie-corbeil-essonnes.fr' },
    { key: 'departement', logo: '/images/partners/departement-91.svg', url: 'https://www.essonne.fr' },
    { key: 'caf', logo: '/images/partners/caf.svg', url: 'https://www.caf.fr' },
  ],

  specialties: ['Solidarité', 'Quartier', 'Bénévolat', 'Partage', 'Convivialité', 'Engagement'],

  gallery: [
    '/images/gallery/vmg-01.avif',
    '/images/gallery/vmg-02.avif',
    '/images/gallery/vmg-03.avif',
    '/images/gallery/vmg-04.avif',
    '/images/gallery/vmg-05.avif',
    '/images/gallery/vmg-06.avif',
  ],

  testimonial: { image: '/images/gallery/vmg-14.avif' },

  faq: [{ key: 'q1' }, { key: 'q2' }, { key: 'q3' }, { key: 'q4' }, { key: 'q5' }, { key: 'q6' }],

  articlesFallback: [
    {
      slug: 'toujours-mobilises-pour-notre-quartier',
      title: 'Toujours mobilisés pour notre quartier',
      description:
        "À la Papeterie, les habitants ne demandent pas l'impossible : des espaces pour vivre, respirer, se rencontrer.",
      publishedAt: '2026-04-24',
      category: 'mobilisation',
      image: '/images/blog/mobilisation-papeterie.jpg',
      readingTime: 1,
    },
    {
      slug: 'une-belle-chasse-aux-oeufs-au-parc-de-la-papeterie',
      title: 'Une belle chasse aux œufs au parc de la Papeterie',
      description: 'Près de 150 enfants sont venus profiter de notre chasse aux œufs annuelle.',
      publishedAt: '2026-04-20',
      category: 'evenements',
      image: '/images/blog/chasse-aux-oeufs.jpg',
      readingTime: 1,
    },
    {
      slug: 'la-friperie-solidaire-organisee-par-lassociation-est-de-retour',
      title: 'La friperie solidaire est de retour',
      description: "Les 11 et 12 avril, l'association organise une friperie solidaire ouverte à toutes et tous.",
      publishedAt: '2026-03-11',
      category: 'friperie',
      image: '/images/blog/friperie-2026.png',
      readingTime: 2,
    },
  ],

  ctas: {
    primary: { key: 'don', href: '/dons' },
    secondary: { key: 'adhesion', href: '/adhesion' },
    tertiary: { key: 'benevolat', href: '/benevolat' },
    petition: { key: 'petition', href: 'https://change.org/pomchouvmg', external: true },
  },

  helloasso: {
    don:
      process.env.NEXT_PUBLIC_HELLOASSO_DON_URL ||
      'https://www.helloasso.com/associations/voisins-moulin-galant/formulaires/don',
    adhesion:
      process.env.NEXT_PUBLIC_HELLOASSO_ADHESION_URL ||
      'https://www.helloasso.com/associations/voisins-moulin-galant/adhesions/adhesion-voisins-moulin-galant',
    benevolat:
      process.env.NEXT_PUBLIC_HELLOASSO_BENEVOLAT_URL ||
      'https://www.helloasso.com/associations/voisins-moulin-galant/formulaires/benevolat',
  },

  blog: {
    articlesSource: (process.env.NEXT_PUBLIC_ARTICLES_SOURCE as ArticlesSource) || 'mdx',
    categories: [
      {
        id: 'actualites',
        name: { fr: 'Actualités' },
        slug: 'actualites',
        description: 'Vie de quartier, infos locales, communiqués courts.',
        color: '#E85D33',
        icon: 'newspaper',
      },
      {
        id: 'evenements',
        name: { fr: 'Événements' },
        slug: 'evenements',
        description: 'Agenda : chasses aux œufs, fêtes de quartier, ateliers, distributions.',
        color: '#F5C842',
        icon: 'calendar',
      },
      {
        id: 'aide-alimentaire',
        name: { fr: 'Aide alimentaire' },
        slug: 'aide-alimentaire',
        description: 'Distributions solidaires, banque alimentaire, soutien aux familles.',
        color: '#2D8F6F',
        icon: 'shopping-bag',
      },
      {
        id: 'friperie',
        name: { fr: 'Friperie' },
        slug: 'friperie',
        description: 'La friperie solidaire : collectes, ouvertures, témoignages.',
        color: '#F5C842',
        icon: 'shirt',
      },
      {
        id: 'mobilisation',
        name: { fr: 'Mobilisation' },
        slug: 'mobilisation',
        description: 'Pétitions, prises de position, défense du quartier (ex: Pom Chou).',
        color: '#E85D33',
        icon: 'megaphone',
      },
      {
        id: 'vie-asso',
        name: { fr: "Vie de l'asso" },
        slug: 'vie-asso',
        description: "Assemblées générales, bureau, vie interne de l'association.",
        color: '#1F3A5F',
        icon: 'users',
      },
      {
        id: 'communique',
        name: { fr: 'Communiqué' },
        slug: 'communique',
        description: "Communications officielles de l'asso.",
        color: '#1F3A5F',
        icon: 'file-text',
      },
      {
        id: 'galerie',
        name: { fr: 'Galerie' },
        slug: 'galerie',
        description: 'Photos, portraits, concours photo, vie du quartier en images.',
        color: '#2D8F6F',
        icon: 'image',
      },
    ],
    cities: [
      {
        slug: 'corbeil-essonnes',
        name: { fr: 'Corbeil-Essonnes' },
        country: 'FR',
        timezone: 'Europe/Paris',
        coordinates: { lat: 48.6121, lng: 2.4823 },
      },
    ],
    feeds: [],
    keywords: [
      { term: 'voisins moulin galant', volume: 0, competition: 0, priority: 1, category: 'identite' },
      { term: 'association corbeil-essonnes', volume: 0, competition: 0, priority: 1, category: 'identite' },
      { term: 'quartier moulin galant', volume: 0, competition: 0, priority: 1, category: 'identite' },
      { term: 'aide alimentaire 91', volume: 0, competition: 0, priority: 2, category: 'aide-alimentaire' },
      { term: 'distribution alimentaire essonne', volume: 0, competition: 0, priority: 2, category: 'aide-alimentaire' },
      { term: 'friperie solidaire essonne', volume: 0, competition: 0, priority: 2, category: 'friperie' },
      { term: 'pom chou pétition', volume: 0, competition: 0, priority: 1, category: 'mobilisation' },
      { term: 'mobilisation corbeil', volume: 0, competition: 0, priority: 2, category: 'mobilisation' },
      { term: 'chasse aux œufs corbeil-essonnes', volume: 0, competition: 0, priority: 3, category: 'evenements' },
      { term: 'fête de quartier moulin galant', volume: 0, competition: 0, priority: 3, category: 'evenements' },
      { term: 'bénévolat asso 91', volume: 0, competition: 0, priority: 2, category: 'vie-asso' },
      { term: 'assemblée générale asso quartier', volume: 0, competition: 0, priority: 3, category: 'vie-asso' },
    ],
    generation: {
      llmProvider: 'claude',
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      targetWordCount: 900,
      languages: ['fr'],
      maxArticlesPerRun: 1,
    },
    keyFigures: [
      { value: '150+', label: 'familles soutenues' },
      { value: '12+', label: 'événements/an' },
      { value: '207', label: 'articles publiés' },
      { value: '7+', label: "années d'action" },
    ],
  },

  cms: {
    url: process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.merenza.com',
    apiToken: process.env.CMS_API_TOKEN,
    brandSlug: 'voisins-moulin-galant',
    locale: 'fr',
  },

  locales: ['fr'] as const,
  defaultLocale: 'fr' as const,

  seo: {
    titleTemplate: '%s | Voisins Moulin Galant',
    defaultTitle: 'Voisins Moulin Galant — Association de quartier à Corbeil-Essonnes',
    defaultDescription:
      "Association loi 1901 du quartier Moulin Galant à Corbeil-Essonnes. Solidarité, événements, friperie, aide alimentaire — créer du lien et agir ensemble depuis 2018.",
    keywords: [
      'association corbeil-essonnes',
      'aide alimentaire 91',
      'friperie solidaire essonne',
      'voisins moulin galant',
      'quartier moulin galant',
      'pom chou pétition',
      'asso bénévole 91100',
      'événements quartier corbeil',
    ],
    ogImage: '/images/gallery/vmg-09.jpg',
  },

  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },
};

export type Locale = (typeof brandConfig.locales)[number];

/**
 * Compatibilité descendante avec le code vitrine pré-fusion.
 * @deprecated Utiliser `brandConfig` directement.
 */
export const templateConfig = brandConfig;
