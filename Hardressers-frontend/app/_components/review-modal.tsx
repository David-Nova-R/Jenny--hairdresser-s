'use client';

import { useMemo, useState } from 'react';
import { X, Star } from 'lucide-react';
import { PostReview } from '../_api/appointment-api';
import { tr } from '../_config/translations';
import { useLang } from '../_context/language-context';

type ReviewModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ReviewModal({
  show,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { lang } = useLang();

  const displayedRating = useMemo(
    () => hoverValue ?? rating,
    [hoverValue, rating]
  );

  if (!show) return null;

  const handleStarClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;

    const value = isHalf ? index + 0.5 : index + 1;
    setRating(value);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!text.trim()) {
      setErrorMessage(tr('review_error_text_required', lang));
      return;
    }

    if (rating < 0.5) {
      setErrorMessage(tr('review_error_rating_required', lang));
      return;
    }

    const dto = {
      text: text.trim(),
      stars: Math.round(rating * 2),
    };

    try {
      setLoading(true);
      await PostReview(dto);

      setSuccessMessage(tr('review_success', lang));
      setText('');
      setRating(0);
      setHoverValue(null);

      onSuccess?.();

      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error?.message || tr('review_error_generic', lang)
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStarFill = (starNumber: number) => {
    if (displayedRating >= starNumber) return 100;
    if (displayedRating >= starNumber - 0.5) return 50;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#D4AF37]/30 bg-[#111] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-light">
            {tr('review_modal_title', lang)}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-white/10"
            aria-label={tr('modal_close', lang)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-400">
          {tr('review_modal_rating_info', lang)}
        </p>

        <div className="mb-3 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star, index) => {
            const fill = renderStarFill(star);

            return (
              <button
                key={star}
                type="button"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const hoverX = e.clientX - rect.left;
                  const isHalf = hoverX < rect.width / 2;
                  setHoverValue(isHalf ? index + 0.5 : index + 1);
                }}
                onMouseLeave={() => setHoverValue(null)}
                onClick={(e) => handleStarClick(e, index)}
                className="relative h-10 w-10"
                aria-label={`${tr('review_selected', lang)} ${star}`}
              >
                <Star className="absolute inset-0 h-10 w-10 text-gray-600" />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill}%` }}
                >
                  <Star className="h-10 w-10 fill-[#D4AF37] text-[#D4AF37]" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="mb-6 text-sm text-[#D4AF37]">
          {tr('review_selected', lang)} : {displayedRating || 0}/5
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={1000}
          placeholder={tr('review_text_placeholder', lang)}
          className="mb-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
        />

        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {successMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-[#D4AF37] px-6 py-3 font-medium text-black transition hover:bg-[#F4D03F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? tr('review_loading', lang)
              : tr('review_submit', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}