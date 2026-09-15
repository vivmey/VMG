import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HandHeart, Clock, Users, ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { templateConfig } from '@/template.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('benevolatTitle'), description: t('benevolatDescription') };
}

const missions = [
  {
    title: 'Friperie solidaire',
    desc: 'Tenir un stand un samedi par mois (~3h). Tri des dons, accueil du public, encaissement.',
    engagement: 'Ponctuel ou régulier',
  },
  {
    title: 'Distribution alimentaire',
    desc: 'Préparer et distribuer les paniers une fois par mois (~4h). Convivial, peu d\'effort physique.',
    engagement: 'Mensuel',
  },
  {
    title: 'Événements',
    desc: 'Aider à l\'organisation et à l\'animation : chasse aux œufs, fête des voisins, AG, repas partagés.',
    engagement: 'Quelques événements/an',
  },
  {
    title: 'Communication',
    desc: 'Animer Facebook/Instagram, écrire des articles de blog, prendre des photos lors des événements.',
    engagement: 'Régulier mais flexible',
  },
  {
    title: 'Bureau & démarches',
    desc: 'Rejoindre le bureau (président, trésorier, secrétaire) ou aider sur les dossiers de subvention.',
    engagement: 'Engagement annuel',
  },
];

export default async function BenevolatPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Bénévolat"
        title="Devenez bénévole"
        subtitle="Quelques heures par mois suffisent pour faire bouger le quartier. Toutes les aides sont bonnes à prendre — ponctuelles ou régulières."
      >
        <Link
          href={templateConfig.helloasso.benevolat}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white h-[56px] px-8 rounded-xl text-[16px] font-medium transition-colors shadow-xl"
        >
          <HandHeart className="w-5 h-5" />
          M'inscrire comme bénévole
          <ArrowRight className="w-5 h-5" />
        </Link>
      </PageHero>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-[28px] md:text-[36px] font-serif text-navy text-center mb-12">
            Les missions disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {missions.map((m) => (
              <div key={m.title} className="bg-light rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 text-[12px] text-primary font-semibold tracking-[0.1em] uppercase mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  {m.engagement}
                </div>
                <h3 className="text-[20px] font-semibold text-navy mb-3">{m.title}</h3>
                <p className="text-[14px] text-body leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-navy text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center max-w-3xl">
          <Users className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-[28px] md:text-[36px] font-serif mb-6">Une équipe accueillante</h2>
          <p className="text-[18px] text-white/85 leading-relaxed mb-4">
            Tu n'as jamais fait de bénévolat ? Aucun problème. Tu es occupé·e ? On s'adapte. Tu veux juste
            essayer une fois ? C'est OK aussi.
          </p>
          <p className="text-[16px] text-white/70 leading-relaxed mb-8">
            Préviens-nous, on te briefe en 5 minutes et on t'accompagne lors de ta première participation.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-white text-navy hover:bg-light h-[52px] px-7 rounded-xl text-[15px] font-medium transition-colors"
          >
            Nous contacter d'abord
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
