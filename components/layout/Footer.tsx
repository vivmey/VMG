'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, ChevronUp, Facebook, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { templateConfig } from '@/template.config';

type FooterProps = {
  lang: string;
};

export default function Footer({ lang }: FooterProps) {
  const t = useTranslations('footer');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const linkFor = (href: string, external?: boolean) => {
    if (external) return href;
    return `/${lang}${href}`;
  };

  return (
    <footer className="relative">
      <div className="footer-gradient pt-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
            {/* Card asso */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 -mt-32 relative z-10 shadow-xl">
                <div className="flex items-center mb-6">
                  <Image
                    src={templateConfig.assets.logoLight}
                    alt={templateConfig.brand.name}
                    width={200}
                    height={64}
                    className="h-14 w-auto"
                  />
                </div>
                <p className="text-[14px] text-body leading-relaxed mb-6">{t('description')}</p>

                <div className="space-y-0">
                  <div className="flex justify-between text-[14px] py-3 border-t border-gray-100">
                    <span className="text-body">{t('permanenceLabel')}</span>
                    <span className="font-medium text-navy">{templateConfig.hours.permanence}</span>
                  </div>
                  <div className="flex justify-between text-[14px] py-3 border-t border-gray-100">
                    <span className="text-body">{t('supportLabel')}</span>
                    <span className="font-medium text-primary">{templateConfig.hours.support}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                  <a
                    href={templateConfig.social.facebook}
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-navy hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={templateConfig.social.instagram}
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-navy hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* L'asso */}
            <div className="lg:col-span-2 lg:pt-4">
              <h4 className="text-[18px] font-serif italic text-white mb-6">{t('assoTitle')}</h4>
              <ul className="space-y-3">
                {templateConfig.navigation.footer.asso.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={linkFor(link.href)}
                      className="text-[14px] text-white/70 hover:text-white transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* S'engager */}
            <div className="lg:col-span-2 lg:pt-4">
              <h4 className="text-[18px] font-serif italic text-white mb-6">
                {t('engagementTitle')}
              </h4>
              <ul className="space-y-3">
                {templateConfig.navigation.footer.engagement.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={linkFor(link.href, link.external)}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-[14px] text-white/70 hover:text-white transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter / réseaux */}
            <div className="lg:col-span-4 lg:pt-4">
              <h4 className="text-[18px] font-serif italic text-white mb-6">{t('newsletter')}</h4>
              <p className="text-[14px] text-white/70 leading-relaxed mb-6">
                {t('newsletterText')}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={templateConfig.social.facebook}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl inline-flex items-center gap-2 text-[14px] font-medium transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href={templateConfig.social.instagram}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl inline-flex items-center gap-2 text-[14px] font-medium transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-[12px] text-white/50 block">{t('ourLocation')}</span>
                <p className="text-[14px] text-white">{templateConfig.contact.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-[12px] text-white/50 block">{t('generalInquiries')}</span>
                <a
                  href={`mailto:${templateConfig.contact.email}`}
                  className="text-[14px] text-white hover:text-primary transition-colors"
                >
                  {templateConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Mentions légales row */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-t border-white/10 text-[13px]">
            {templateConfig.navigation.footer.legal.map((link) => (
              <Link
                key={link.key}
                href={linkFor(link.href)}
                className="text-white/60 hover:text-white transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
            <span className="ml-auto text-white/60">{t('poweredBy')}</span>
          </div>
        </div>

        {/* Marquee */}
        <div className="py-10 overflow-hidden">
          <div className="flex animate-marquee">
            {[...Array(3)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center shrink-0">
                {templateConfig.specialties.map((word, wordIndex) => (
                  <div key={`${setIndex}-${wordIndex}`} className="flex items-center">
                    <span className="mx-6 lg:mx-10">
                      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                        <path
                          d="M20 0L20.9 15.1L36 8L24.9 19.1L40 20L24.9 20.9L36 32L20.9 24.9L20 40L19.1 24.9L4 32L15.1 20.9L0 20L15.1 19.1L4 8L19.1 15.1L20 0Z"
                          fill="#E85D33"
                          fillOpacity="0.6"
                        />
                      </svg>
                    </span>
                    <span className="footer-marquee-text">{word}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="bg-white px-10 py-4 rounded-t-2xl">
            <p className="text-[13px] text-body">{t('copyright')}</p>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Remonter"
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
