import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Receipt, Shield, ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import HelloAssoWidget from '@/components/ui/HelloAssoWidget';
import { brandConfig } from '@/brand.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('donsTitle'), description: t('donsDescription') };
}

const garanties = [
  { icon: Receipt, title: 'Reçu fiscal automatique', desc: '66% de réduction d\'impôt sur le revenu (dans la limite de 20% du revenu imposable).' },
  { icon: Shield, title: 'Paiement sécurisé', desc: 'Transaction via HelloAsso, plateforme certifiée pour les associations.' },
  { icon: Heart, title: '100% pour le quartier', desc: 'Aucun frais de structure : chaque euro finance directement les actions.' },
];

const usages = [
  { pct: '45%', label: 'Aide alimentaire', desc: 'Paniers solidaires mensuels' },
  { pct: '25%', label: 'Événements', desc: 'Fêtes, rencontres, ateliers' },
  { pct: '20%', label: 'Friperie', desc: 'Frais d\'organisation, transport' },
  { pct: '10%', label: 'Mobilisation', desc: 'Communication, démarches' },
];

export default async function DonsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Faire un don"
        title="Soutenez l'association"
        subtitle="Chaque don, même petit, fait vivre le quartier. Reçu fiscal automatique pour 66% de réduction d'impôt."
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-[28px] md:text-[36px] font-serif text-navy text-center mb-12">
            Pourquoi donner via HelloAsso ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {garanties.map((g) => (
              <div key={g.title} className="bg-light rounded-2xl p-6 lg:p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <g.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[18px] font-semibold text-navy mb-2">{g.title}</h3>
                <p className="text-[14px] text-body leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-light">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-[28px] md:text-[36px] font-serif text-navy mb-4">
              À quoi servent vos dons ?
            </h2>
            <p className="text-[16px] text-body max-w-2xl mx-auto">
              Bilan annuel publié à l'AG. Comptes accessibles sur demande.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {usages.map((u) => (
              <div key={u.label} className="bg-white rounded-2xl p-6 text-center">
                <div className="text-[40px] lg:text-[48px] font-bold text-primary leading-none mb-2">
                  {u.pct}
                </div>
                <h3 className="text-[16px] font-semibold text-navy mb-1">{u.label}</h3>
                <p className="text-[12px] text-body">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-navy text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center max-w-3xl">
          <h2 className="text-[28px] md:text-[36px] font-serif mb-6">Exemple concret</h2>
          <p className="text-[18px] text-white/85 leading-relaxed mb-8">
            Un don de <strong className="text-primary">50 €</strong> finance un panier alimentaire complet
            pour une famille de 4 personnes pendant un mois. Après réduction d'impôt, le don ne vous coûte
            réellement que <strong className="text-accent">17 €</strong>.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          <HelloAssoWidget baseUrl={brandConfig.helloasso.don} variant="full" />
        </div>
      </section>
    </>
  );
}
