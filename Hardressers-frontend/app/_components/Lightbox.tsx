'use client';

import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const current = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && hasNext) {
      onNext();
    } else if (distance < -minSwipeDistance && hasPrev) {
      onPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={e => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={e => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative z-10 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[85vh] max-w-[88vw] rounded-2xl object-contain shadow-2xl select-none"
          draggable={false}
        />
        {current.alt && (
          <p className="mt-3 text-center text-sm text-white/50">{current.alt}</p>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => {
                e.stopPropagation();
                if (i < currentIndex) onPrev();
                else if (i > currentIndex) onNext();
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-5 bg-[#D4AF37]'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}