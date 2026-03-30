'use client';

import { tr } from '@/app/_config/translations';
import CarouselShell from '../carousels/carousel-shell';
import GalleryCard from '../gallery-card';

type GalleryPhoto = {
  id: string | number;
  photoUrl: string;
  hairStyleName: string;
};

type GallerySectionProps = {
  lang: string;
  loading: boolean;
  photos: GalleryPhoto[];
};

export default function GallerySection({
  lang,
  loading,
  photos,
}: GallerySectionProps) {
  return (
    <section id="gallery" className="bg-black px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-20">
          <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            {tr('gallery_badge', lang as any)}
          </span>
          <h2 className="mt-4 mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
            {tr('gallery_title', lang as any)}
          </h2>
          <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <span className="text-gray-400">Loading gallery...</span>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-[#0a0a0a] text-gray-400">
            No photos available yet.
          </div>
        ) : (
          <CarouselShell itemsLength={photos.length}>
            {photos.map((photo) => (
              <GalleryCard key={photo.id} photo={photo} />
            ))}
          </CarouselShell>
        )}
      </div>
    </section>
  );
}