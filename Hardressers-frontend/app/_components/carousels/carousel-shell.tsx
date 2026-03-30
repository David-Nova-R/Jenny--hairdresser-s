'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

type CarouselShellProps = {
  itemsLength: number;
  children: ReactNode;
};

export default function CarouselShell({
  itemsLength,
  children,
}: CarouselShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();
    setMounted(true);

    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const getMaxIndex = () => Math.max(0, itemsLength - visibleCards);

  const getScrollAmount = () => {
    if (!scrollRef.current) return 0;

    const firstCard = scrollRef.current.querySelector('[data-card]') as HTMLElement | null;
    if (!firstCard) return 0;

    const styles = window.getComputedStyle(scrollRef.current);
    const gap = parseInt(styles.gap || '16', 10) || 16;

    return firstCard.offsetWidth + gap;
  };

  const scrollToIndex = (nextIndex: number) => {
    if (!scrollRef.current) return;

    const amount = getScrollAmount();

    scrollRef.current.scrollTo({
      left: nextIndex * amount,
      behavior: 'smooth',
    });

    setIndex(nextIndex);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const maxIndex = getMaxIndex();

    setIndex((prev) => {
      const next =
        direction === 'left'
          ? Math.max(0, prev - 1)
          : Math.min(maxIndex, prev + 1);

      const amount = getScrollAmount();

      scrollRef.current?.scrollTo({
        left: next * amount,
        behavior: 'smooth',
      });

      return next;
    });
  };

  const syncIndex = () => {
    if (!scrollRef.current) return;

    const amount = getScrollAmount();
    if (!amount) return;

    setIndex(Math.round(scrollRef.current.scrollLeft / amount));
  };

  useEffect(() => {
    if (!mounted) return;

    const handleResizeReset = () => {
      setIndex(0);
      scrollRef.current?.scrollTo({ left: 0, behavior: 'auto' });
    };

    window.addEventListener('resize', handleResizeReset);
    return () => window.removeEventListener('resize', handleResizeReset);
  }, [mounted]);

  return (
    <div className="relative">
      {itemsLength > 1 && (
        <>
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black/90 text-[#D4AF37] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black lg:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => scrollCarousel('right')}
            className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black/90 text-[#D4AF37] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black lg:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        onScroll={syncIndex}
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-[7.5%] pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden sm:px-0 lg:gap-6"
      >
        {children}
      </div>

      {mounted && itemsLength > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: getMaxIndex() + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 bg-[#D4AF37]'
                  : 'w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}