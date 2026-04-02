'use client';

import { useEffect, useRef, useState } from 'react';
import { Pencil, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { tr } from '@/app/_config/translations';
import { PortfolioPhoto } from '@/app/_models/models';
import { ImageWithFallback } from '@/app/ImageWithFallBack';
import PortfolioEditor from '@/app/_components/PortfolioEditor';
import Lightbox from '@/app/_components/Lightbox';
import { Lang } from '@/app/_context/language-context';

type GallerySectionProps = {
  lang: Lang;
  loading: boolean;
  photos: PortfolioPhoto[];
  onPhotosChange: (photos: PortfolioPhoto[]) => void;
  isAdmin: boolean;
};

export default function GallerySection({
  lang,
  loading,
  photos,
  onPhotosChange,
  isAdmin,
}: GallerySectionProps) {
  const [editMode, setEditMode] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [itemsPerView, setItemsPerView] = useState(4);

  const visiblePhotos = photos.filter(p => p.isVisible);
  const lightboxImages = visiblePhotos.map(p => ({
    src: p.photoUrl,
    alt: p.title ?? '',
  }));

  useEffect(() => {
  const updateItemsPerView = () => {
    setItemsPerView(getItemsPerView());
  };

  updateItemsPerView();
  window.addEventListener('resize', updateItemsPerView);
  return () => window.removeEventListener('resize', updateItemsPerView);
}, []);

const isScrollable = visiblePhotos.length > itemsPerView;

  const getItemsPerView = () => {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 768) return 2;
  if (window.innerWidth < 1024) return 3;
  return 4;
};

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="Gallery" className="bg-black px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-20">
          <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            {tr('gallery_badge', lang)}
          </span>

          <h2 className="mt-4 mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
            {tr('gallery_title', lang)}
          </h2>

          <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />

          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setEditMode(v => !v)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${editMode
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                  : 'border-[#D4AF37]/30 bg-transparent text-[#D4AF37] hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10'
                  }`}
              >
                {editMode ? (
                  <>
                    <X className="h-4 w-4" />
                    {tr('editor_done', lang)}
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    {tr('editor_toggle', lang)}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {editMode && isAdmin ? (
          <PortfolioEditor
            photos={photos}
            onPhotosChange={onPhotosChange}
            lang={lang}
          />
        ) : loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <span className="text-gray-400">{tr('gallery_loading', lang)}</span>
          </div>
        ) : visiblePhotos.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-[#0a0a0a] text-gray-400">
            {tr('gallery_empty', lang)}
          </div>
        ) : (
          <>
            <div className="relative">
              {isScrollable && (
                <>
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/70 p-3 text-white backdrop-blur-sm transition hover:bg-black/85 md:flex"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/70 p-3 text-white backdrop-blur-sm transition hover:bg-black/85 md:flex"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div
                ref={carouselRef}
                className={`flex gap-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isScrollable
                    ? 'snap-x snap-mandatory overflow-x-auto scroll-smooth'
                    : 'flex-wrap justify-center overflow-visible'
                  }`}
              >
                {visiblePhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxIndex(idx)}
                    className={`group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] transition-all duration-300 hover:border-[#D4AF37]/50 ${isScrollable
                        ? 'w-[78%] shrink-0 snap-start sm:w-[48%] md:w-[31%] lg:w-[24%]'
                        : 'w-[78%] sm:w-[48%] md:w-[31%] lg:max-w-[280px]'
                      }`}
                  >
                    <ImageWithFallback
                      src={photo.photoUrl}
                      alt={photo.title ?? `Portfolio ${photo.order + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                      {photo.title && (
                        <p className="w-full p-4 text-sm font-medium text-white">
                          {photo.title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {lightboxIndex !== null && (
              <Lightbox
                images={lightboxImages}
                currentIndex={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onPrev={() =>
                  setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))
                }
                onNext={() =>
                  setLightboxIndex(i =>
                    i !== null && i < lightboxImages.length - 1 ? i + 1 : i
                  )
                }
              />
            )}
          </>
        )}
      </div>
    </section >
  );
}