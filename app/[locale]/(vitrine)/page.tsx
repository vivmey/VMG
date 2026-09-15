import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ValuePropsSection from '@/components/home/ValuePropsSection';
import GallerySection from '@/components/home/GallerySection';
import WhyUsSection from '@/components/home/WhyUsSection';
import ActionsSection from '@/components/home/ActionsSection';
import ProcessSection from '@/components/home/ProcessSection';
import NeighborhoodSection from '@/components/home/NeighborhoodSection';
import PartnersSection from '@/components/home/PartnersSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import BlogSection from '@/components/home/BlogSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection lang={locale} />
      <ValuePropsSection />
      <ActionsSection lang={locale} />
      <BlogSection lang={locale} />
      <GallerySection />
      <WhyUsSection />
      <ProcessSection />
      <NeighborhoodSection />
      <PartnersSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection lang={locale} />
    </>
  );
}
