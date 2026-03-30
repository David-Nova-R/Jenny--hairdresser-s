'use client';

import { Star } from 'lucide-react';

type Review = {
  authorName?: string | null;
  text: string;
  stars: number;
  createdAt?: string | null;
};

type ReviewCardProps = {
  review: Review;
  index: number;
};

export default function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <div
      data-card
      className="w-[85%] min-w-[85%] shrink-0 snap-center rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10 sm:w-[calc(50%-8px)] sm:min-w-[calc(50%-8px)] sm:snap-start lg:w-[calc(33.333%-16px)] lg:min-w-[calc(33.333%-16px)] lg:p-8"
    >
      <div className="mb-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <Star
            key={`${index}-${starIndex}`}
            className={`h-4 w-4 ${
              starIndex < review.stars
                ? 'fill-[#D4AF37] text-[#D4AF37]'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>

      <p className="mb-6 min-h-[96px] leading-relaxed text-gray-300">
        “{review.text}”
      </p>

      <div className="border-t border-[#D4AF37]/10 pt-4">
        <p className="text-sm font-medium text-white">
          {review.authorName || 'Anonymous'}
        </p>

        {review.createdAt && (
          <p className="mt-1 text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}