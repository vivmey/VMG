'use client';

import { useTranslations } from 'next-intl';
import Accordion from '@/components/ui/Accordion';

export default function FAQSection() {
  const t = useTranslations('faq');

  const faqItems = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
    { question: t('q5'), answer: t('a5') },
    { question: t('q6'), answer: t('a6') },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[13px] font-medium text-navy tracking-[0.1em] uppercase">
                {t('label')}
              </span>
            </div>
            <h2 className="text-[32px] md:text-[42px] lg:text-[48px] leading-[1.15] text-navy mb-6">
              <span className="font-serif">{t('title')}</span>
            </h2>
            <p className="text-[15px] text-body leading-relaxed">{t('intro')}</p>
          </div>
          <div>
            <Accordion items={faqItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
