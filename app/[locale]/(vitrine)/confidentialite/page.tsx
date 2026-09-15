import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { templateConfig } from '@/template.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('confidentialiteTitle') };
}

export default async function ConfidentialitePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero eyebrow="Légal" title="Politique de confidentialité" />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          <p className="text-[15px] text-body mb-6">
            La protection de votre vie privée est une priorité pour {templateConfig.brand.name}. Cette page
            décrit comment nous collectons, utilisons et protégeons vos données personnelles.
          </p>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Données collectées</h2>
          <p className="text-[15px] text-body mb-3">
            Nous collectons uniquement les données strictement nécessaires :
          </p>
          <ul className="text-[15px] text-body list-disc pl-5 space-y-1 mb-6">
            <li>Formulaire de contact : nom, email, message (stockés via Netlify Forms, conservés 12 mois)</li>
            <li>Don / adhésion / bénévolat : données traitées directement par <strong>HelloAsso</strong> (voir leur politique de confidentialité)</li>
            <li>Statistiques de visite anonymisées via <strong>Plausible Analytics</strong> (sans cookie, sans identifiant)</li>
          </ul>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Cookies</h2>
          <p className="text-[15px] text-body mb-6">
            Notre site n'utilise <strong>aucun cookie de suivi publicitaire</strong>. Plausible Analytics
            mesure les visites de manière anonyme, sans cookie ni identifiant persistant.
          </p>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Vos droits</h2>
          <p className="text-[15px] text-body mb-3">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et
            d'opposition concernant vos données. Pour exercer ces droits :
          </p>
          <p className="text-[15px] text-body mb-6">
            <a href={`mailto:${templateConfig.contact.email}`} className="text-primary hover:underline">
              {templateConfig.contact.email}
            </a>
          </p>

          <h2 className="text-[22px] font-serif text-navy mb-3 mt-8">Sous-traitants</h2>
          <ul className="text-[15px] text-body list-disc pl-5 space-y-1">
            <li>Netlify (hébergement + formulaire contact) — RGPD compliant via clauses contractuelles types</li>
            <li>HelloAsso (transactions don/adhésion) — éditeur français, conforme RGPD</li>
            <li>Plausible (analytics) — éditeur européen (UE), conforme RGPD sans cookie</li>
          </ul>
        </div>
      </section>
    </>
  );
}
