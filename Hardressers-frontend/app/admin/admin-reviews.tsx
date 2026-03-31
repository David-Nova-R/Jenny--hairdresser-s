'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, RefreshCw, Star, Trash2 } from 'lucide-react';
import { DeleteReview, FetchAllReviewsAdmin, PutVisibilityReview } from '@/app/_api/appointment-api';
import { AdminReviewDTO } from '@/app/_models/models';
import { useLang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';

export default function AdminReviews() {
  const { lang } = useLang();
  const [reviews, setReviews] = useState<AdminReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FetchAllReviewsAdmin();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError(tr('reviews_error_load', lang));
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadReviews(); }, []);

  const handleToggleVisibility = async (reviewId: number) => {
    try {
      setTogglingId(reviewId);
      await PutVisibilityReview(reviewId);
      setReviews(prev =>
        prev.map(r => r.id === reviewId ? { ...r, isVisible: !r.isVisible } : r)
      );
    } catch (err) {
      console.error('Failed to toggle review visibility:', err);
      setError(tr('reviews_error_visibility', lang));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      setDeletingId(reviewId);
      await DeleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review:', err);
      setError(tr('reviews_error_delete', lang));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-4 sm:p-5">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-light sm:text-2xl">{tr('admin_tab_reviews', lang)}</h2>
          <p className="mt-1 text-sm text-gray-400">{tr('reviews_admin_subtitle', lang)}</p>
        </div>
        <button
          onClick={() => void loadReviews()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 px-4 py-2.5 text-sm text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black sm:w-auto sm:py-2"
        >
          <RefreshCw className="h-4 w-4" />
          {tr('admin_refresh', lang)}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-black text-gray-400">
          {tr('reviews_admin_empty', lang)}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="rounded-2xl border border-[#D4AF37]/10 bg-black p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <p className="text-lg font-medium text-white">
                      {review.authorName || tr('reviews_anonymous', lang)}
                    </p>
                    <span className={`rounded-full px-3 py-1 text-xs ${
                      review.isVisible
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-gray-500/10 text-gray-300'
                    }`}>
                      {review.isVisible ? tr('reviews_visible', lang) : tr('reviews_hidden', lang)}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${
                        i < review.stars ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'
                      }`} />
                    ))}
                  </div>

                  <p className="mb-3 whitespace-pre-line leading-relaxed text-gray-300">
                    {review.text}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString(
                      lang === 'es' ? 'es-MX' : lang === 'fr' ? 'fr-CA' : 'en-CA'
                    )}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 lg:flex-col lg:gap-2">
                  <button
                    type="button"
                    onClick={() => void handleToggleVisibility(review.id)}
                    disabled={togglingId === review.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 px-4 py-2.5 text-sm text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black disabled:opacity-60 sm:w-auto sm:py-2 lg:w-full lg:py-2.5"
                  >
                    {togglingId === review.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : review.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {review.isVisible ? tr('reviews_hide', lang) : tr('reviews_show', lang)}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-60 sm:w-auto sm:py-2 lg:w-full lg:py-2.5"
                  >
                    {deletingId === review.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />}
                    {tr('editor_delete_confirm_btn', lang)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
