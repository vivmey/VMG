'use client';

import { useTranslations } from 'next-intl';
import { Building2, HeartHandshake, Landmark, Users } from 'lucide-react';
import { templateConfig } from '@/template.config';

const partnerIcons: Record<string, typeof Building2> = {
  merenza: HeartHandshake,
  mairie: Landmark,
  departement: Building2,
  caf: Users,
};

export default function PartnersSection() {
  const t = useTranslations('partners');

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
          </h2>
          <p className="text-[15px] text-body mt-4 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {templateConfig.partners.map((partner) => {
            const Icon = partnerIcons[partner.key] || Building2;
            const descKey = `${partner.key}Desc`;
            return (
              <a
                key={partner.key}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-light rounded-2xl p-6 lg:p-8 text-center hover:shadow-lg transition-shadow grayscale hover:grayscale-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-[18px] font-semibold text-navy mb-2">{t(partner.key)}</h3>
                <p className="text-[12px] text-body leading-relaxed">{t(descKey)}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
