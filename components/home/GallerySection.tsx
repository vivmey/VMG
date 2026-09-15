'use client';

import Image from 'next/image';
import { templateConfig } from '@/template.config';

export default function GallerySection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {templateConfig.gallery.map((image, index) => {
            const isFirst = index === 0;
            const containerClasses = isFirst
              ? 'relative overflow-hidden rounded-2xl group md:row-span-2 bg-light'
              : 'relative overflow-hidden rounded-2xl group bg-light';
            const imageClasses = isFirst
              ? 'w-full object-cover group-hover:scale-105 transition-transform duration-500 h-full min-h-[300px] md:min-h-[500px]'
              : 'w-full object-cover group-hover:scale-105 transition-transform duration-500 h-[200px] md:h-[240px]';
            return (
              <div key={index} className={containerClasses}>
                <Image
                  src={image}
                  alt={`Voisins Moulin Galant — événement ${index + 1}`}
                  width={600}
                  height={isFirst ? 800 : 400}
                  className={imageClasses}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
