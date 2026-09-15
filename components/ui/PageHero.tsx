import { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy-darker pt-[120px] pb-16 lg:pt-[160px] lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#E85D33_0%,transparent_60%)] pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-6 relative">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-[12px] font-medium text-white tracking-wide uppercase">
                {eyebrow}
              </span>
            </div>
          )}
          <h1 className="font-serif text-white text-[40px] md:text-[52px] lg:text-[64px] leading-[1.1] tracking-[-0.01em]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[16px] lg:text-[18px] text-white/80 leading-relaxed mt-6 max-w-2xl">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
