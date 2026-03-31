'use client';

import { tr } from '@/app/_config/translations';
import { useLang } from '@/app/_context/language-context';
import CarouselShell from '../carousels/carousel-shell';
import ReviewCard from '../review-card';

type Review = {
  authorName?: string | null;
  text: string;
  stars: number;
  createdAt?: string | null;
};

type ReviewsSectionProps = {
  reviews: Review[];
  loading: boolean;
};

export default function ReviewsSection({ reviews, loading }: ReviewsSectionProps) {
  const { lang } = useLang();

  return (
    <section id="reviews" className="bg-black px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-20">
          <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            {tr('reviews_badge', lang)}
          </span>
          <h2 className="mt-4 mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
            {tr('reviews_title', lang)}
          </h2>
          <div className="mx-auto h-[1px] w-24 bg-[#D4AF37]" />
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <span className="text-gray-400">{tr('reviews_loading', lang)}</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-[#0a0a0a] text-gray-400">
            {tr('reviews_empty', lang)}
          </div>
        ) : (
          <CarouselShell itemsLength={reviews.length}>
            {reviews.map((review, index) => (
              <ReviewCard
                key={`${review.authorName ?? 'review'}-${index}`}
                review={review}
                index={index}
              />
            ))}
          </CarouselShell>
        )}
      </div>
    </section>
  );
}
