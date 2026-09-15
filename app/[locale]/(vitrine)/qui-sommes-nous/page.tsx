import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Users, Heart, MapPin, ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { templateConfig } from '@/template.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('aboutTitle'), description: t('aboutDescription') };
}

const timeline = [
  { year: '2018', titleKey: 'fondation', descKey: 'fondationDesc' },
  { year: '2020', titleKey: 'aide', descKey: 'aideDesc' },
  { year: '2022', titleKey: 'friperie', descKey: 'friperieDesc' },
  { year: '2024', titleKey: 'pomChou', descKey: 'pomChouDesc' },
  { year: '2026', titleKey: 'merenza', descKey: 'merenzaDesc' },
];

const timelineLabels: Record<string, { title: string; desc: string }> = {
  fondation: {
    title: 'Naissance de l\'association',
    desc: 'Quelques voisins se réunissent pour fédérer la vie du quartier Moulin Galant.',
  },
  aide: {
    title: 'Lancement de l\'aide alimentaire',
    desc: 'Première distribution mensuelle pour les familles en difficulté.',
  },
  friperie: {
    title: 'Ouverture de la friperie solidaire',
    desc: 'Prix libre, ouverte à tous, deux samedis par mois.',
  },
  pomChou: {
    title: 'Mobilisation Pom Chou',
    desc: 'Pétition citoyenne contre le projet immobilier de 178 logements.',
  },
  merenza: {
    title: 'Intégration à l\'écosystème Merenza',
    desc: 'Nouveau site, blog rénové, partenariat technique avec Merenza.',
  },
};

const valeurs = [
  { icon: Heart, key: 'solidarite', title: 'Solidarité', desc: 'Soutenir sans juger, accueillir sans condition.' },
  { icon: Users, key: 'collectif', title: 'Collectif', desc: 'Rien ne se fait seul. Tout se fait ensemble.' },
  { icon: MapPin, key: 'local', title: 'Local', desc: 'Le quartier d\'abord. Les voisins toujours.' },
  { icon: Calendar, key: 'continuite', title: 'Continuité', desc: '7+ années d\'actions sans interruption.' },
];

export default async function QuiSommesNousPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="L'association"
        title="Qui sommes-nous"
        subtitle={`${templateConfig.brand.legalForm} fondée en ${templateConfig.brand.foundingYear} dans le quartier Moulin Galant à Corbeil-Essonnes. ${templateConfig.brand.tagline}.`}
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-[28px] md:text-[36px] font-serif text-navy mb-6">Notre histoire</h2>
            <p className="text-[16px] text-body leading-relaxed mb-4">
              Voisins Moulin Galant est née en 2018 du désir simple de quelques habitants : recréer du lien
              dans le quartier Moulin Galant à Corbeil-Essonnes. Tout commence par des fêtes de voisinage,
              puis par des distributions ponctuelles aux familles en difficulté.
            </p>
            <p className="text-[16px] text-body leading-relaxed mb-4">
              Sept années plus tard, l'asso compte plus de 150 familles soutenues par an, organise une
              dizaine d'événements annuels (chasse aux œufs, AG, fête des voisins, repas partagés), tient une
              friperie solidaire deux samedis par mois, et porte la parole du quartier dans les mobilisations
              citoyennes — notamment l'opposition au projet immobilier Pom Chou.
            </p>
            <p className="text-[16px] text-body leading-relaxed">
              En 2026, nous avons rejoint l'écosystème <strong>Merenza</strong>, qui nous accompagne sur le
              volet technique (site, blog, outils) tout en respectant pleinement notre indépendance dans les
              décisions et les actions menées.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-light">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-[28px] md:text-[36px] font-serif text-navy text-center mb-12">
            Les étapes clés
          </h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, idx) => {
              const labels = timelineLabels[item.titleKey];
              return (
                <div
                  key={idx}
                  className="flex gap-6 pb-8 mb-8 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <div className="shrink-0 w-20 lg:w-24 text-right">
                    <span className="text-[28px] lg:text-[32px] font-bold text-primary leading-none">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex-1 pl-6 border-l-2 border-primary/30">
                    <h3 className="text-[20px] font-semibold text-navy mb-2">{labels.title}</h3>
                    <p className="text-[15px] text-body leading-relaxed">{labels.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-[28px] md:text-[36px] font-serif text-navy text-center mb-12">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((v) => (
              <div key={v.key} className="bg-light rounded-2xl p-6 lg:p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[20px] font-semibold text-navy mb-2">{v.title}</h3>
                <p className="text-[14px] text-body leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-navy">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-[28px] md:text-[36px] font-serif text-white mb-4">
            Le partenariat avec Merenza
          </h2>
          <p className="text-[16px] text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
            Merenza est un écosystème de projets communautaires qui accompagne les associations locales sur
            le volet technique : sites web, blogs, outils numériques. VMG bénéficie de cet accompagnement
            tout en gardant la pleine indépendance de ses actions et décisions.
          </p>
          <Link
            href="https://merenza.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-navy h-[52px] px-7 rounded-xl text-[15px] font-medium hover:bg-light transition-colors"
          >
            Découvrir Merenza
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
