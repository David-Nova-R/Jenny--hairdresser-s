'use client';

import { HairStyle } from '@/app/_models/models';
import { tr } from '@/app/_config/translations';
import CarouselShell from '../carousels/carousel-shell';
import ServiceCard from '../service-card';

type Props = {
  lang: string;
  loading: boolean;
  pageHairStyles: HairStyle[];
  onSelect: (hairStyle: HairStyle) => void;
};

export default function ServicesSection({
  lang,
  loading,
  pageHairStyles,
  onSelect,
}: Props) {
  return (
    <section id="HairStyles" className="bg-black px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-20">
          <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            {tr('services_badge', lang as any)}
          </span>
          <h2 className="mt-4 mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
            {tr('services_title', lang as any)}
          </h2>
          <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
        </div>

        {loading ? (
          <CarouselShell itemsLength={4}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                data-card
                className="flex w-[85%] min-w-[85%] shrink-0 snap-center flex-col rounded-2xl border border-[#D4AF37]/10 bg-gradient-to-b from-[#0a0a0a] to-black p-6 animate-pulse sm:w-[calc(50%-8px)] sm:min-w-[calc(50%-8px)] sm:snap-start lg:w-[calc(33.333%-16px)] lg:min-w-[calc(33.333%-16px)] lg:p-8"
              >
                <div className="mb-6 h-16 w-16 rounded-full bg-[#D4AF37]/10" />
                <div className="mb-3 h-6 w-3/4 rounded bg-white/10" />
                <div className="mb-2 h-4 w-full rounded bg-white/5" />
                <div className="mb-6 h-4 w-5/6 rounded bg-white/5" />
                <div className="h-5 w-1/3 rounded bg-[#D4AF37]/20" />
              </div>
            ))}
          </CarouselShell>
        ) : (
          <CarouselShell itemsLength={pageHairStyles.length}>
            {pageHairStyles.map((hairStyle) => (
              <ServiceCard
                key={hairStyle.id}
                hairStyle={hairStyle}
                lang={lang}
                onSelect={onSelect}
              />
            ))}
          </CarouselShell>
        )}
      </div>
    </section>
  );
}