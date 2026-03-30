'use client';

import { ImageWithFallback } from '@/app/ImageWithFallBack';

type GalleryCardProps = {
  photo: {
    id: string | number;
    photoUrl: string;
    hairStyleName: string;
  };
};

export default function GalleryCard({ photo }: GalleryCardProps) {
  return (
    <div
      data-card
      className="group relative aspect-[4/5] w-[85%] min-w-[85%] shrink-0 snap-center overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] transition-all duration-300 hover:border-[#D4AF37]/50 sm:w-[calc(50%-8px)] sm:min-w-[calc(50%-8px)] sm:snap-start lg:w-[calc(33.333%-16px)] lg:min-w-[calc(33.333%-16px)]"
    >
      <ImageWithFallback
        src={photo.photoUrl}
        alt={photo.hairStyleName}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-sm font-medium text-white">{photo.hairStyleName}</p>
      </div>
    </div>
  );
}