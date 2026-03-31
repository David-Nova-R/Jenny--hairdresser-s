'use client';

import { Palette, Scissors } from 'lucide-react';
import { HairStyle } from '@/app/_models/models';
import { getHairStyleDisplay } from '@/app/_config/hairstyle-descriptions';
import { tr } from '@/app/_config/translations';

const COLOR_SERVICES = new Set([
  'Tinte permanente',
  'Tinte demipermanente',
  'Baño de color',
  'Técnicas de mechas y efectos de luz',
  'Balayage',
  'Baby Lights',
  'Ombré',
  'Californianas',
]);

type Props = {
  hairStyle: HairStyle;
  lang: string;
  onSelect: (hairStyle: HairStyle) => void;
};

export default function ServiceCard({ hairStyle, lang, onSelect }: Props) {
  return (
    <div
      data-card
      className="w-[85%] min-w-[85%] shrink-0 snap-center sm:w-[calc(50%-8px)] sm:min-w-[calc(50%-8px)] sm:snap-start lg:w-[calc(33.333%-16px)] lg:min-w-[calc(33.333%-16px)]"
    >
      <button
        onClick={() => onSelect(hairStyle)}
        className="group flex w-full flex-col rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6 text-left transition-all duration-300 hover:cursor-pointer hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_4px_rgba(212,175,55,0.12)] lg:p-8"
      >
        <div className="mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37] bg-black transition-all duration-300 group-hover:bg-[#D4AF37]">
            {COLOR_SERVICES.has(hairStyle.name) ? (
              <Palette className="h-7 w-7 text-[#D4AF37] transition-colors duration-300 group-hover:text-black" />
            ) : (
              <Scissors className="h-7 w-7 text-[#D4AF37] transition-colors duration-300 group-hover:text-black" />
            )}
          </div>
        </div>

        <h3 className="mb-3 text-xl font-normal sm:text-2xl">
          {getHairStyleDisplay(hairStyle.name, lang as any).title}
        </h3>

        <p className="mb-6 grow leading-relaxed text-gray-400">
          {getHairStyleDisplay(hairStyle.name, lang as any).description}
        </p>

        <p className="text-base text-[#D4AF37] sm:text-lg">
          {tr('services_from', lang as any)} {hairStyle.priceMin} CAD
        </p>
      </button>
    </div>
  );
}