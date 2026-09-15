'use client';

import { useTranslations } from 'next-intl';
import { HeartHandshake, Users, Sprout, Calendar, Megaphone, MapPin } from 'lucide-react';

const icons = { HeartHandshake, Users, Sprout, Calendar, Megaphone, MapPin };

const valueProps = [
  { icon: 'HeartHandshake', titleKey: 'solidariteTitle', descKey: 'solidariteDesc' },
  { icon: 'Users', titleKey: 'communauteTitle', descKey: 'communauteDesc' },
  { icon: 'Sprout', titleKey: 'environnementTitle', descKey: 'environnementDesc' },
  { icon: 'Calendar', titleKey: 'evenementsTitle', descKey: 'evenementsDesc' },
  { icon: 'Megaphone', titleKey: 'mobilisationTitle', descKey: 'mobilisationDesc' },
  { icon: 'MapPin', titleKey: 'localTitle', descKey: 'localDesc' },
];

export default function ValuePropsSection() {
  const t = useTranslations('valueProps');

  return (
    <section className="bg-white py-6 -mt-1 relative z-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {valueProps.map((prop, index) => {
            const Icon = icons[prop.icon as keyof typeof icons];
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-light transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-navy leading-tight mb-1">
                    {t(prop.titleKey)}
                  </h3>
                  <p className="text-[12px] text-body leading-snug">{t(prop.descKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
