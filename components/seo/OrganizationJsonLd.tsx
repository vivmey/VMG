import { templateConfig } from '@/template.config';

export default function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voisinsmoulingalant.fr';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: templateConfig.brand.name,
    alternateName: templateConfig.brand.shortName,
    url: siteUrl,
    logo: `${siteUrl}${templateConfig.assets.logoLight}`,
    description: templateConfig.seo.defaultDescription,
    foundingDate: String(templateConfig.brand.foundingYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Quartier Moulin Galant',
      addressLocality: templateConfig.contact.addressLocality,
      postalCode: templateConfig.contact.postalCode,
      addressRegion: templateConfig.contact.region,
      addressCountry: templateConfig.contact.country,
    },
    email: templateConfig.contact.email,
    sameAs: [
      templateConfig.social.facebook,
      templateConfig.social.instagram,
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Corbeil-Essonnes — Quartier Moulin Galant',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
