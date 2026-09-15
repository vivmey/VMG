'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { templateConfig } from '@/template.config';

const benefits = [
  { titleKey: 'benefit1Title', descKey: 'benefit1Desc' },
  { titleKey: 'benefit2Title', descKey: 'benefit2Desc' },
  { titleKey: 'benefit3Title', descKey: 'benefit3Desc' },
];

export default function WhyUsSection() {
  const t = useTranslations('whyUs');

  return (
    <section className="py-16 lg:py-24 bg-light">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-[28px] md:text-[36px] lg:text-[44px] leading-[1.2] text-navy mb-4">
            <span className="font-serif">{t('title')}</span>
            <br />
            <span className="font-serif italic text-primary">{t('subtitle')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-light">
              <Image
                src={templateConfig.gallery[0]}
                alt="Action de l'association"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-2xl hidden lg:flex items-center justify-center">
              <div className="text-center">
                <span className="text-[28px] font-bold text-white block leading-none">
                  {templateConfig.brand.foundingYear}
                </span>
                <span className="text-[11px] text-white/90 mt-1 block">{t('yearsBadge')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-[18px] lg:text-[20px] font-semibold text-navy mb-2">
                    {t(benefit.titleKey)}
                  </h3>
                  <p className="text-[14px] lg:text-[15px] text-body leading-relaxed">
                    {t(benefit.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
