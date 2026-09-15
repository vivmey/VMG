'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Calendar, ShoppingBag, Building2 } from 'lucide-react';
import { templateConfig } from '@/template.config';

const typeIcons = {
  event: Calendar,
  aide: MapPin,
  commerce: ShoppingBag,
  institution: Building2,
};

export default function NeighborhoodSection() {
  const t = useTranslations('neighborhood');

  return (
    <section className="py-16 lg:py-24 bg-navy">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[32px] md:text-[42px] lg:text-[52px] leading-[1.15] text-white mb-4">
            <span className="font-serif">{t('title')}</span>
          </h2>
          <p className="text-[16px] text-white/70">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {templateConfig.neighborhood.points.map((point, index) => {
            const Icon = typeIcons[point.type as keyof typeof typeIcons];
            const descKey = `${point.key}Desc`;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2 leading-tight">
                  {t(point.key)}
                </h3>
                <p className="text-[13px] text-white/70 leading-snug">{t(descKey)}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-[14px] text-white/60">
            {templateConfig.contact.address}
          </p>
        </div>
      </div>
    </section>
  );
}
