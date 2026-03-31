'use client';

import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { tr } from '@/app/_config/translations';
import { PortfolioPhoto } from '@/app/_models/models';
import { ImageWithFallback } from '@/app/ImageWithFallBack';
import PortfolioEditor from '@/app/_components/PortfolioEditor';
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

  const visiblePhotos = photos.filter(p => p.isVisible);

  return (
    <section id="gallery" className="bg-black px-4 py-16 sm:px-6 sm:py-24">
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

          {/* Admin edit toggle */}
          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setEditMode(v => !v)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                  editMode
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                    : 'border-[#D4AF37]/30 bg-transparent text-[#D4AF37] hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10'
                }`}
              >
                {editMode
                  ? <><X className="h-4 w-4" />{tr('editor_done', lang)}</>
                  : <><Pencil className="h-4 w-4" />{tr('editor_toggle', lang)}</>}
              </button>
            </div>
          )}
        </div>

        {/* Edit mode */}
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
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            {visiblePhotos.map(photo => (
              <div
                key={photo.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a] transition-all duration-300 hover:border-[#D4AF37]/50"
              >
                <ImageWithFallback
                  src={photo.photoUrl}
                  alt={photo.title ?? `Portfolio ${photo.order + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {photo.title && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="w-full p-4 text-sm font-medium text-white">
                      {photo.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
