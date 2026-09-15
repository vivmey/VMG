'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';
import { templateConfig } from '@/template.config';

export default function TestimonialSection() {
  const t = useTranslations('testimonial');

  return (
    <section className="py-16 lg:py-24 bg-light">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Image
                src={templateConfig.gallery[1]}
                alt="Friperie solidaire"
                width={400}
                height={500}
                className="rounded-2xl w-full h-[250px] lg:h-[350px] object-cover bg-white"
              />
              <Image
                src={templateConfig.gallery[2]}
                alt="Distribution"
                width={400}
                height={500}
                className="rounded-2xl w-full h-[250px] lg:h-[350px] object-cover mt-8 bg-white"
              />
            </div>
          </div>

          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Quote className="w-8 h-8 text-primary" />
            </div>
            <blockquote className="text-[20px] lg:text-[24px] font-serif italic text-navy leading-relaxed mb-8">
              &ldquo;{t('quote')}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[18px] font-bold text-primary">
                  {t('author').charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-navy">{t('author')}</h4>
                <p className="text-[14px] text-body">{t('role')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
