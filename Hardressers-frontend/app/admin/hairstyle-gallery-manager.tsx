'use client';

import { ChangeEvent, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload, ZoomIn } from 'lucide-react';
import Lightbox from '@/app/_components/Lightbox';

import { ImageWithFallback } from '../ImageWithFallBack';
import { HairStyleWithPhotos } from '../_models/models';
import { DeleteHairStylePhoto, UploadHairStylePhoto } from '../_api/appointment-api';


type Props = {
  hairStyles: HairStyleWithPhotos[];
  isAdmin: boolean;
  accessToken?: string;
  onRefresh: () => Promise<void>;
};

export default function HairStyleGalleryManager({
  hairStyles,
  isAdmin,
  accessToken,
  onRefresh,
}: Props) {
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleUpload = async (
    hairStyleId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploadingFor(hairStyleId);

    try {
      await UploadHairStylePhoto(hairStyleId, file);

      setSuccess('Image ajoutée avec succès.');
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload.");
    } finally {
      setUploadingFor(null);
      event.target.value = '';
    }
  };

  const handleDelete = async (photoId: number) => {
    setError(null);
    setSuccess(null);
    setDeletingPhotoId(photoId);

    try {
      await DeleteHairStylePhoto(photoId);

      setSuccess('Image supprimée avec succès.');
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression.');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  return (
    <div className="space-y-12">
      {(error || success) && (
        <div className="space-y-3">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {success}
            </div>
          )}
        </div>
      )}

      {hairStyles.map((hairStyle) => (
        <div
          key={hairStyle.id}
          className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-6"
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-normal text-white">{hairStyle.name}</h3>
              <p className="mt-1 text-[#D4AF37]">
                À partir de ${hairStyle.priceMin}
                {hairStyle.priceMax ? ` - $${hairStyle.priceMax}` : ''}
              </p>
            </div>

            {isAdmin && (
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#F4D03F]">
                {uploadingFor === hairStyle.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Ajouter une image
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => void handleUpload(hairStyle.id, e)}
                  disabled={uploadingFor === hairStyle.id}
                />
              </label>
            )}
          </div>

          {(hairStyle.photos?.length ?? 0) === 0 ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/20 bg-black/40 text-center">
              <ImageIcon className="mb-3 h-8 w-8 text-[#D4AF37]" />
              <p className="text-gray-400">Aucune image pour cette coiffure.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hairStyle.photos?.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-[#D4AF37]/20"
                >
                  <ImageWithFallback
                    src={photo.photoUrl}
                    alt={hairStyle.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Zoom button */}
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxImages((hairStyle.photos ?? []).map(p => ({ src: p.photoUrl, alt: hairStyle.name })));
                      setLightboxIndex(idx);
                    }}
                    className="absolute left-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/80 group-hover:opacity-100"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => void handleDelete(photo.id)}
                      disabled={deletingPhotoId === photo.id}
                      className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-2 text-sm text-white shadow-lg transition hover:bg-red-600 disabled:opacity-60"
                    >
                      {deletingPhotoId === photo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => { setLightboxIndex(null); setLightboxImages([]); }}
          onPrev={() => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex(i => (i !== null && i < lightboxImages.length - 1 ? i + 1 : i))}
        />
      )}
    </div>
  );
}