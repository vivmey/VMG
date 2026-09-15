'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Heart, UserPlus, HandHeart } from 'lucide-react';

type CTASectionProps = {
  lang: string;
};

const ctas = [
  { key: 'donate', href: '/dons', icon: Heart },
  { key: 'adhere', href: '/adhesion', icon: UserPlus },
  { key: 'volunteer', href: '/benevolat', icon: HandHeart },
];

export default function CTASection({ lang }: CTASectionProps) {
  const t = useTranslations('cta');

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-[28px] md:text-[36px] lg:text-[44px] leading-[1.2] text-white mb-4 font-serif">
            {t('title')}
          </h2>
          <p className="text-[16px] lg:text-[18px] text-white/85">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ctas.map((cta) => (
            <Link
              key={cta.key}
              href={`/${lang}${cta.href}`}
              className="group bg-white rounded-2xl p-6 lg:p-8 hover:-translate-y-1 transition-transform shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <cta.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-[20px] font-semibold text-navy mb-2">{t(cta.key)}</h3>
              <p className="text-[14px] text-body leading-relaxed mb-4">{t(`${cta.key}Desc`)}</p>
              <div className="inline-flex items-center gap-2 text-[14px] font-medium text-primary group-hover:gap-3 transition-all">
                {t(cta.key)}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
