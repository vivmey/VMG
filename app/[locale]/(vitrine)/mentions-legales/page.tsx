import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { templateConfig } from '@/template.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('mentionsTitle') };
}

export default async function MentionsLegalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero eyebrow="Légal" title="Mentions légales" />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl prose prose-lg">
          <h2 className="text-[24px] font-serif text-navy mb-4">Éditeur du site</h2>
          <ul className="text-[15px] text-body space-y-1 mb-8 list-disc pl-5">
            <li>
              <strong>Nom de l'association :</strong> {templateConfig.brand.name}
            </li>
            <li>
              <strong>Statut juridique :</strong> {templateConfig.brand.legalForm}
            </li>
            <li>
              <strong>Adresse :</strong> {templateConfig.contact.address}
            </li>
            <li>
              <strong>Email :</strong> {templateConfig.contact.email}
            </li>
            <li>
              <strong>Directeur·rice de la publication :</strong> {templateConfig.brand.publicationDirector}
            </li>
            <li>
              <strong>SIRET :</strong> {templateConfig.brand.siret}
            </li>
          </ul>

          <h2 className="text-[24px] font-serif text-navy mb-4">Hébergement</h2>
          <p className="text-[15px] text-body mb-2">
            <strong>Netlify, Inc.</strong>
          </p>
          <p className="text-[15px] text-body mb-8">
            44 Montgomery Street, Suite 300, San Francisco, California 94104, USA — netlify.com
          </p>

          <h2 className="text-[24px] font-serif text-navy mb-4">Propriété intellectuelle</h2>
          <p className="text-[15px] text-body mb-8">
            L'ensemble du site (textes, images, logo) relève de la législation française et internationale
            sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont
            réservés. La reproduction de tout ou partie de ce site sur un autre support est interdite sans
            autorisation écrite préalable.
          </p>

          <h2 className="text-[24px] font-serif text-navy mb-4">Crédits</h2>
          <p className="text-[15px] text-body mb-2">
            Site propulsé par <strong>Merenza</strong> — écosystème de projets communautaires partenaire.
          </p>
          <p className="text-[15px] text-body">
            Stack technique : Next.js, Tailwind, Netlify, Plausible. Code disponible sur demande.
          </p>
        </div>
      </section>
    </>
  );
}
