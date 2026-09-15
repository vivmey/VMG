'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { templateConfig } from '@/template.config';

type HeroSectionProps = {
  lang: string;
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = useTranslations('hero');
  const tStats = useTranslations('stats');

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-navy-dark">
      <div className="absolute inset-0 z-0">
        <Image
          src={templateConfig.assets.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/85 via-navy-dark/45 to-navy-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-navy-dark/20" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_25%_30%,#E85D33_0%,transparent_55%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-6 flex-1 flex flex-col justify-center pt-[100px] pb-[180px] lg:pb-[220px]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[12px] font-medium text-white tracking-wide uppercase">
              {templateConfig.brand.legalForm} · {templateConfig.brand.foundingYear}
            </span>
          </div>

          <h1 className="font-serif italic text-white text-[36px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1.15] tracking-[-0.01em]">
            {t('title1')}
            <br />
            <span className="text-primary">{t('title2')}</span>
          </h1>

          <p className="text-[16px] lg:text-[18px] text-white/85 leading-relaxed mt-6 mb-8 max-w-lg">
            {t('description')}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/${lang}/dons`}
              className="bg-white hover:bg-light h-[52px] pl-7 pr-1.5 rounded-xl inline-flex items-center gap-4 text-[15px] font-medium transition-all group"
            >
              <span className="text-navy">{t('cta')}</span>
              <span className="w-10 h-10 rounded-lg bg-primary group-hover:bg-navy flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </Link>
            <Link
              href={`/${lang}/adhesion`}
              className="text-white border border-white/30 hover:border-white hover:bg-white/10 h-[52px] px-7 rounded-xl inline-flex items-center gap-2 text-[15px] font-medium transition-all"
            >
              {t('ctaAdhere')}
            </Link>
            <Link
              href={`/${lang}/nos-actions`}
              className="text-white/70 underline underline-offset-4 text-[14px] font-medium hover:text-white transition-colors"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
          <div className="container mx-auto px-4 lg:px-6 relative">
            <span className="giant-hero-text">{t('giantText')}</span>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10 pb-8 lg:pb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-6 lg:gap-10">
              {templateConfig.stats.map((stat, index) => (
                <div key={index} className="text-white flex items-center gap-3">
                  {index > 0 && <div className="w-px h-[60px] lg:h-[70px] bg-white/25" />}
                  <div>
                    <span className="text-[42px] lg:text-[52px] font-bold leading-none block">
                      {stat.value}
                    </span>
                    <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.2em] mt-2 text-white/60 font-medium">
                      {tStats(stat.key)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
