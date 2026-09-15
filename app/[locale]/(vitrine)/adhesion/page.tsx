import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import HelloAssoWidget from '@/components/ui/HelloAssoWidget';
import { brandConfig } from '@/brand.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('adhesionTitle'), description: t('adhesionDescription') };
}

const tarifs = [
  { label: 'Soutien libre', price: 'Libre', desc: 'À partir de 5 €, à votre convenance' },
  { label: 'Standard', price: '10 €', desc: 'Tarif annuel recommandé pour adhérer', highlighted: true },
  { label: 'Bienfaiteur', price: '50 €', desc: 'Pour soutenir la structure au-delà' },
];

const droits = [
  'Voter à l\'Assemblée Générale annuelle',
  'Recevoir le bilan financier et le rapport moral',
  'Proposer des projets et candidater au bureau',
  'Recevoir un reçu fiscal pour défiscalisation',
  'Accès prioritaire aux événements à inscription',
];

export default async function AdhesionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Adhérer"
        title="Devenir membre de l'association"
        subtitle="Pour 10 € par an, soutenez la structure, votez en AG et participez à la vie démocratique de l'asso."
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-[28px] md:text-[36px] font-serif text-navy text-center mb-12">
            Choisissez votre niveau de soutien
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tarifs.map((t) => (
              <div
                key={t.label}
                className={`rounded-2xl p-6 lg:p-8 ${
                  t.highlighted
                    ? 'bg-primary text-white shadow-2xl scale-105'
                    : 'bg-light text-navy'
                }`}
              >
                <h3 className="text-[18px] font-medium mb-2">{t.label}</h3>
                <div
                  className={`text-[40px] lg:text-[48px] font-bold leading-none mb-3 ${
                    t.highlighted ? 'text-white' : 'text-primary'
                  }`}
                >
                  {t.price}
                  {t.price !== 'Libre' && <span className="text-[16px] font-medium opacity-70"> / an</span>}
                </div>
                <p className={`text-[14px] leading-relaxed ${t.highlighted ? 'text-white/85' : 'text-body'}`}>
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <HelloAssoWidget baseUrl={brandConfig.helloasso.adhesion} variant="full" />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-light">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          <h2 className="text-[28px] md:text-[36px] font-serif text-navy mb-8">
            Vos droits en tant que membre
          </h2>
          <ul className="space-y-4">
            {droits.map((droit, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-[16px] text-body leading-relaxed">{droit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
