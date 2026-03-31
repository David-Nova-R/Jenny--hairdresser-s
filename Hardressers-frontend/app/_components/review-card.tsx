'use client';

import { Star } from 'lucide-react';
import { tr } from '@/app/_config/translations';
import { useLang } from '@/app/_context/language-context';

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
  const { lang } = useLang();

  const rating = review.stars / 2;

  return (
    <div
      data-card
      className="w-[85%] min-w-[85%] shrink-0 snap-center rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10 sm:w-[calc(50%-8px)] sm:min-w-[calc(50%-8px)] sm:snap-start lg:w-[calc(33.333%-16px)] lg:min-w-[calc(33.333%-16px)] lg:p-8"
    >
      <div className="mb-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = rating >= i + 1;
          const isHalf = rating >= i + 0.5 && rating < i + 1;

          return (
            <div key={`${index}-${i}`} className="relative h-4 w-4">
              {/* empty */}
              <Star className="absolute inset-0 h-4 w-4 text-gray-600" />

              {/* full */}
              {isFull && (
                <Star className="absolute inset-0 h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
              )}

              {/* half */}
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mb-6 min-h-[96px] leading-relaxed text-gray-300">
        "{review.text}"
      </p>

      <div className="border-t border-[#D4AF37]/10 pt-4">
        <p className="text-sm font-medium text-white">
          {review.authorName || tr('reviews_anonymous', lang)}
        </p>

        {review.createdAt && (
          <p className="mt-1 text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString(
              lang === 'es' ? 'es-MX' : lang === 'fr' ? 'fr-CA' : 'en-CA'
            )}
          </p>
        )}
      </div>
    </div>
  );
}