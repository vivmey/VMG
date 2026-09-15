import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { templateConfig } from '@/template.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('rgpdTitle') };
}

export default async function RGPDPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero eyebrow="Légal" title="Conformité RGPD" />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          <p className="text-[15px] text-body mb-6">
            {templateConfig.brand.name} s'engage à respecter le Règlement Général sur la Protection des
            Données (RGPD) entré en vigueur le 25 mai 2018.
          </p>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Responsable de traitement</h2>
          <p className="text-[15px] text-body mb-6">
            {templateConfig.brand.publicationDirector ? (
              <>{templateConfig.brand.publicationDirector} — Président·e de l'association {templateConfig.brand.name}<br /></>
            ) : null}
            Email : {' '}
            <a href={`mailto:${templateConfig.contact.email}`} className="text-primary hover:underline">
              {templateConfig.contact.email}
            </a>
          </p>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Bases légales du traitement</h2>
          <ul className="text-[15px] text-body list-disc pl-5 space-y-1 mb-6">
            <li><strong>Consentement</strong> : formulaire de contact, inscription bénévolat</li>
            <li><strong>Exécution de contrat</strong> : adhésion, don (gestion par HelloAsso)</li>
            <li><strong>Intérêt légitime</strong> : statistiques anonymisées de visite (Plausible)</li>
          </ul>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Durée de conservation</h2>
          <ul className="text-[15px] text-body list-disc pl-5 space-y-1 mb-6">
            <li>Formulaire de contact : 12 mois après la dernière interaction</li>
            <li>Données d'adhérent / donateur : 6 ans (obligation comptable et fiscale)</li>
            <li>Statistiques Plausible : 24 mois, anonymisées</li>
          </ul>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Exercer vos droits</h2>
          <p className="text-[15px] text-body mb-3">
            Vous pouvez à tout moment demander :
          </p>
          <ul className="text-[15px] text-body list-disc pl-5 space-y-1 mb-6">
            <li>L'accès à vos données personnelles</li>
            <li>La rectification des données inexactes</li>
            <li>La suppression de vos données (droit à l'oubli)</li>
            <li>La portabilité de vos données</li>
            <li>La limitation ou l'opposition au traitement</li>
          </ul>
          <p className="text-[15px] text-body mb-6">
            Toute demande sera traitée sous 30 jours maximum, par email à {' '}
            <a href={`mailto:${templateConfig.contact.email}`} className="text-primary hover:underline">
              {templateConfig.contact.email}
            </a>
            .
          </p>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Réclamation</h2>
          <p className="text-[15px] text-body">
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
            auprès de la <strong>CNIL</strong> (Commission Nationale Informatique et Libertés) :{' '}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              cnil.fr
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
