'use client';

import { useTranslations } from 'next-intl';
import { Eye, UserPlus, HeartHandshake, Sparkles } from 'lucide-react';

const icons = { Eye, UserPlus, HeartHandshake, Sparkles };

const steps = [
  { number: '01', titleKey: 'decouvrirTitle', descKey: 'decouvrirDesc', icon: 'Eye' },
  { number: '02', titleKey: 'adhererTitle', descKey: 'adhererDesc', icon: 'UserPlus' },
  { number: '03', titleKey: 'engagerTitle', descKey: 'engagerDesc', icon: 'HeartHandshake' },
  { number: '04', titleKey: 'agirTitle', descKey: 'agirDesc', icon: 'Sparkles' },
];

export default function ProcessSection() {
  const t = useTranslations('process');

  return (
    <section className="py-16 lg:py-24 bg-light">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="process-title text-navy">
            <span>{t('titleLine1')}</span>
            <br />
            <span className="text-primary">{t('titleLine2')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = icons[step.icon as keyof typeof icons];
            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 min-h-[280px] flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-4 left-4 w-3 h-8 rounded-full bg-primary/20" />
                <div className="pl-6 flex-1">
                  <h3 className="text-[20px] lg:text-[24px] font-serif text-navy leading-tight mb-3">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-[14px] text-body leading-relaxed">{t(step.descKey)}</p>
                </div>
                <div className="flex items-end justify-between mt-6 pl-6">
                  <div className="text-primary opacity-60">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-[40px] lg:text-[48px] font-bold text-navy opacity-10 leading-none">
                    {step.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
