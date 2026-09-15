'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Menu, X } from 'lucide-react';
import { templateConfig } from '@/template.config';

type HeaderProps = {
  lang: string;
};

export default function Header({ lang }: HeaderProps) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = templateConfig.navigation.main.map((item) => ({
    ...item,
    href: item.href === '/' ? `/${lang}` : `/${lang}${item.href}`,
  }));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-[72px]">
          <Link href={`/${lang}`} className="flex items-center shrink-0" aria-label={templateConfig.brand.name}>
            <Image
              src={scrolled ? templateConfig.assets.logoLight : templateConfig.assets.logoDark}
              alt={templateConfig.brand.name}
              width={180}
              height={56}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-xl px-1 py-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-1 px-4 py-2 text-[14px] font-medium transition-all rounded-lg ${
                  scrolled
                    ? 'text-gray-700 hover:text-navy hover:bg-gray-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={`/${lang}/dons`}
              className="bg-primary hover:bg-primary-dark text-white h-10 px-5 rounded-full flex items-center gap-2 text-[14px] font-medium transition-colors"
            >
              {t('donate')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className={`lg:hidden w-10 h-10 rounded-lg flex items-center justify-center ${
              scrolled ? 'text-navy' : 'text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl">
          <nav className="container mx-auto px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="block py-3 text-navy font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                href={`/${lang}/dons`}
                className="bg-primary text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('donate')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
