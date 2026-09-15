'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  UtensilsCrossed,
  ShoppingBag,
  PartyPopper,
  Megaphone,
} from 'lucide-react';
import { templateConfig } from '@/template.config';

type ActionsSectionProps = {
  lang: string;
};

const icons = { UtensilsCrossed, ShoppingBag, PartyPopper, Megaphone };

export default function ActionsSection({ lang }: ActionsSectionProps) {
  const t = useTranslations('actions');

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[13px] font-medium text-navy tracking-[0.1em] uppercase">
              {t('label')}
            </span>
          </div>
          <h2 className="text-[32px] md:text-[42px] lg:text-[52px] leading-[1.15] text-navy">
            <span className="font-serif">{t('title')}</span>
            <br />
            <span className="font-serif italic text-primary">{t('subtitle')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {templateConfig.actions.map((action, index) => {
            const Icon = icons[action.icon as keyof typeof icons];
            const titleKey = `${action.key}Title`;
            const descKey = `${action.key}Desc`;
            return (
              <div
                key={action.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-[180px] lg:h-[200px] overflow-hidden bg-light">
                  <Image
                    src={action.image}
                    alt={t(titleKey)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-[18px] lg:text-[20px] font-serif text-navy mb-3">
                    {t(titleKey)}
                  </h3>
                  <p className="text-[14px] text-body leading-relaxed mb-4">{t(descKey)}</p>
                  <Link
                    href={`/${lang}/nos-actions#${action.id}`}
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-primary hover:text-navy transition-colors"
                  >
                    {t('readMore')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
