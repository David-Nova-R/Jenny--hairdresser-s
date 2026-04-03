'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

const SWIPE_THRESHOLD = 50; // px minimum pour déclencher un swipe

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
  const touchStartX = useRef<number | null>(null);

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

  const scrollCarousel = (direction: 'left' | 'right') => {
    const maxIndex = getMaxIndex();
    setIndex((prev) => {
      const next =
        direction === 'left'
          ? Math.max(0, prev - 1)
          : Math.min(maxIndex, prev + 1);
      scrollRef.current?.scrollTo({
        left: next * getScrollAmount(),
        behavior: 'smooth',
      });
      return next;
    });
  };

  const scrollToIndex = (nextIndex: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: nextIndex * getScrollAmount(),
      behavior: 'smooth',
    });
    setIndex(nextIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      scrollCarousel(delta > 0 ? 'right' : 'left');
    }
    touchStartX.current = null;
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

  const atStart = index === 0;
  const atEnd   = index >= getMaxIndex();

  return (
    <div className="flex flex-col gap-6">
      {/* Row: left arrow + scroll area + right arrow */}
      <div className="flex items-center gap-3 lg:gap-4">

        {/* Left arrow */}
        <button
          onClick={() => scrollCarousel('left')}
          disabled={atStart}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black text-[#D4AF37] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-[#D4AF37]/30 disabled:hover:bg-black disabled:hover:text-[#D4AF37] lg:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={syncIndex}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex flex-1 gap-4 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-[7.5%] py-4 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden sm:px-0 lg:gap-6"
        >
          {children}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollCarousel('right')}
          disabled={atEnd}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black text-[#D4AF37] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-[#D4AF37]/30 disabled:hover:bg-black disabled:hover:text-[#D4AF37] lg:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dot indicators */}
      {mounted && itemsLength > 1 && (
        <div className="flex justify-center gap-2">
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
