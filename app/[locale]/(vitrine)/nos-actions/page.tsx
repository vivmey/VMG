import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  UtensilsCrossed,
  ShoppingBag,
  PartyPopper,
  Megaphone,
} from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { templateConfig } from '@/template.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('actionsTitle'), description: t('actionsDescription') };
}

const icons = { UtensilsCrossed, ShoppingBag, PartyPopper, Megaphone };

const longDescriptions: Record<string, { intro: string; detail: string; cta: string; ctaHref: string }> = {
  'aide-alimentaire': {
    intro:
      'Une fois par mois, l\'association distribue des paniers solidaires aux familles en difficulté du quartier. Produits frais, secs, hygiène — adaptés à la composition du foyer.',
    detail:
      'L\'aide est sans condition de nationalité ni de statut administratif. Une rencontre préalable permet de comprendre les besoins et d\'orienter vers d\'autres dispositifs si nécessaire.',
    cta: 'Devenir bénéficiaire ou bénévole',
    ctaHref: '/contact',
  },
  friperie: {
    intro:
      'Deux samedis par mois, la friperie ouvre ses portes au cœur du quartier. Vêtements, accessoires, livres, jouets — à prix libre, ouverts à tous.',
    detail:
      'Tous les revenus financent directement l\'aide alimentaire et les événements. Les invendus sont redistribués via le réseau associatif local.',
    cta: 'Donner des vêtements ou tenir un stand',
    ctaHref: '/benevolat',
  },
  evenements: {
    intro:
      'Chasse aux œufs de Pâques, fête des voisins, AG ouverte, repas partagés au parc de la Papeterie : la vie de quartier se construit ensemble.',
    detail:
      'Une dizaine d\'événements par an, gratuits et ouverts à tous. Les enfants y ont leur place, les anciens aussi.',
    cta: 'Voir les prochains rendez-vous',
    ctaHref: '/blog',
  },
  mobilisation: {
    intro:
      'Pétition Pom Chou, dialogue avec la mairie, prises de parole publiques : nous portons la voix du quartier sur les sujets qui comptent.',
    detail:
      'Position constructive, appuyée sur des éléments concrets. Pas de partisanerie — l\'intérêt du quartier d\'abord.',
    cta: 'Signer la pétition Pom Chou',
    ctaHref: 'https://change.org/pomchouvmg',
  },
};

export default async function NosActionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'actions' });

  return (
    <>
      <PageHero
        eyebrow="Nos actions"
        title="Quatre piliers, un quartier solidaire"
        subtitle="Aide alimentaire, friperie, événements, mobilisation : chaque action répond à un besoin concret du quartier Moulin Galant."
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 space-y-20 lg:space-y-32">
          {templateConfig.actions.map((action, idx) => {
            const Icon = icons[action.icon as keyof typeof icons];
            const long = longDescriptions[action.id];
            const isReversed = idx % 2 === 1;
            const isExternal = long.ctaHref.startsWith('http');
            return (
              <div
                key={action.id}
                id={action.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  isReversed ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="rounded-2xl overflow-hidden bg-light aspect-[4/3]">
                  <Image
                    src={action.image}
                    alt={t(`${action.key}Title`)}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-serif text-navy mb-4">
                    {t(`${action.key}Title`)}
                  </h2>
                  <p className="text-[16px] text-body leading-relaxed mb-4">{long.intro}</p>
                  <p className="text-[15px] text-body leading-relaxed mb-8">{long.detail}</p>
                  <Link
                    href={isExternal ? long.ctaHref : `/${locale}${long.ctaHref}`}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white h-[48px] px-6 rounded-xl text-[14px] font-medium transition-colors"
                  >
                    {long.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
