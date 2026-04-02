'use client';

import { useRef, useState } from 'react';
import { Eye, EyeOff, GripVertical, Plus, X, Check, Loader2, Trash2, ArchiveRestore, AlertTriangle, ZoomIn } from 'lucide-react';
import Lightbox from '@/app/_components/Lightbox';
import { PortfolioPhoto } from '../_models/models';
import {
  UploadPortfolioPhoto,
  UpdatePortfolioPhoto,
  UpdatePortfolioPhotoOrder,
  DeletePortfolioPhoto,
} from '../_api/appointment-api';
import { ImageWithFallback } from '../ImageWithFallBack';
import { tr } from '../_config/translations';
import { Lang } from '../_context/language-context';

interface Props {
  photos: PortfolioPhoto[];
  onPhotosChange: (photos: PortfolioPhoto[]) => void;
  lang: Lang;
}

export default function PortfolioEditor({ photos, onPhotosChange, lang }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<PortfolioPhoto | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPool, setLightboxPool] = useState<{ src: string; alt: string }[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visiblePhotos = photos.filter(p => p.isVisible);
  const hiddenPhotos  = photos.filter(p => !p.isVisible);

  // ── Drag & drop (visible grid only) ───────────────────────────────────────
  const handleDragStart = (i: number) => setDragIndex(i);

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (i !== dragOverIndex) setDragOverIndex(i);
  };

  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) { handleDragEnd(); return; }
    const reordered = [...visiblePhotos];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    const withOrder = reordered.map((p, i) => ({ ...p, order: i }));
    onPhotosChange([...withOrder, ...hiddenPhotos]);
    handleDragEnd();

    setSavingOrder(true);
    try {
      await UpdatePortfolioPhotoOrder(withOrder.map(p => ({ id: p.id, order: p.order, isVisible: p.isVisible })));
    } catch (e) { console.error(e); }
    finally { setSavingOrder(false); }
  };

  // ── Visibility ─────────────────────────────────────────────────────────────
  const toggleVisibility = async (photo: PortfolioPhoto) => {
    const newVal = !photo.isVisible;
    setSavingIds(p => [...p, photo.id]);
    try {
      await UpdatePortfolioPhoto(photo.id, { isVisible: newVal });
      onPhotosChange(photos.map(p => p.id === photo.id ? { ...p, isVisible: newVal } : p));
    } catch (e) { console.error(e); }
    finally { setSavingIds(p => p.filter(id => id !== photo.id)); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (photo: PortfolioPhoto) => setConfirmDelete(photo);

  const confirmDeletePhoto = async () => {
    if (!confirmDelete) return;
    const photo = confirmDelete;
    setConfirmDelete(null);
    setDeletingIds(p => [...p, photo.id]);
    try {
      await DeletePortfolioPhoto(photo.id);
      onPhotosChange(photos.filter(p => p.id !== photo.id));
    } catch (e) { console.error(e); }
    finally { setDeletingIds(p => p.filter(id => id !== photo.id)); }
  };

  // ── File picker & upload ───────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAddFile(file);
    setAddPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAdd = async () => {
    if (!addFile) return;
    setAdding(true);
    try {
      const nextOrder = visiblePhotos.length;
      const newPhoto = await UploadPortfolioPhoto(addFile, addTitle.trim() || undefined, nextOrder);
      onPhotosChange([...photos, newPhoto]);
      setAddFile(null); setAddPreview(null); setAddTitle('');
      setShowAddForm(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) { console.error(e); }
    finally { setAdding(false); }
  };

  const cancelAdd = () => {
    setShowAddForm(false); setAddFile(null); setAddPreview(null); setAddTitle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Shared card actions ────────────────────────────────────────────────────
  const ActionBtn = ({
    onClick, disabled, className, children,
  }: { onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl bg-black/60 p-2 backdrop-blur-sm transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <>
    <div className="space-y-10">
      {/* ── Saving indicator ────────────────────────────────────────────────── */}
      {savingOrder && (
        <div className="flex items-center justify-center gap-2 text-sm text-[#D4AF37]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {tr('editor_saving', lang)}
        </div>
      )}

      {/* ══ ACTIVE PHOTOS (visible) ══════════════════════════════════════════ */}
      <div>
        <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]/60">
          {tr('editor_active', lang)} — {visiblePhotos.length}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePhotos.map((photo, i) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-[3/4] overflow-hidden rounded-2xl border transition-all duration-200
                ${dragIndex === i ? 'scale-95 opacity-40' : ''}
                ${dragOverIndex === i && dragIndex !== i
                  ? 'border-[#D4AF37] shadow-xl shadow-[#D4AF37]/30 scale-[1.02]'
                  : 'border-[#D4AF37]/30'}
              `}
            >
              <ImageWithFallback
                src={photo.photoUrl}
                alt={photo.title ?? `Portfolio ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45" />

              {/* Drag handle */}
              <div className="absolute left-2 top-2 cursor-grab rounded-xl bg-black/60 p-2 text-white backdrop-blur-sm active:cursor-grabbing">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Actions top-right */}
              <div className="absolute right-2 top-2 flex flex-col gap-1.5">
                <ActionBtn
                  onClick={() => {
                    setLightboxPool(visiblePhotos.map(p => ({ src: p.photoUrl, alt: p.title ?? '' })));
                    setLightboxIndex(i);
                  }}
                  className="hover:bg-black/80"
                >
                  <ZoomIn className="h-4 w-4 text-white" />
                </ActionBtn>
                <ActionBtn onClick={() => toggleVisibility(photo)} disabled={savingIds.includes(photo.id)} className="hover:bg-black/80">
                  {savingIds.includes(photo.id)
                    ? <Loader2 className="h-4 w-4 animate-spin text-white" />
                    : <EyeOff className="h-4 w-4 text-amber-400" />}
                </ActionBtn>
                <ActionBtn onClick={() => handleDelete(photo)} disabled={deletingIds.includes(photo.id)} className="hover:bg-rose-500/30">
                  {deletingIds.includes(photo.id)
                    ? <Loader2 className="h-4 w-4 animate-spin text-white" />
                    : <Trash2 className="h-4 w-4 text-rose-400" />}
                </ActionBtn>
              </div>

              {/* Order badge */}
              <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-[11px] font-bold text-[#D4AF37]">
                {i + 1}
              </div>

              {/* Title */}
              {photo.title && (
                <p className="absolute bottom-2 right-2 max-w-[55%] truncate text-right text-xs text-white/70">
                  {photo.title}
                </p>
              )}
            </div>
          ))}

          {/* Add photo card */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#D4AF37]/30 bg-[#0a0a0a] text-[#D4AF37] transition-all hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{tr('editor_add', lang)}</span>
            </button>
          ) : (
            <div className="flex aspect-[3/4] flex-col justify-center gap-3 rounded-2xl border border-[#D4AF37]/30 bg-[#0a0a0a] p-5">
              <p className="text-center text-sm font-semibold text-[#D4AF37]">{tr('editor_add', lang)}</p>

              {addPreview ? (
                <div className="relative mx-auto h-28 w-full overflow-hidden rounded-xl border border-[#D4AF37]/20">
                  <img src={addPreview} alt="preview" className="h-full w-full object-cover" />
                  <button onClick={() => { setAddFile(null); setAddPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1">
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D4AF37]/20 bg-black text-[#D4AF37] transition hover:border-[#D4AF37]/50">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">{tr('editor_url_placeholder', lang)}</span>
                </button>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <input type="text" placeholder={tr('editor_title_placeholder', lang)} value={addTitle}
                onChange={e => setAddTitle(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/20 bg-black px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/50" />

              <div className="flex gap-2">
                <button onClick={handleAdd} disabled={!addFile || adding}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-2.5 text-sm font-semibold text-black transition hover:bg-[#F4D03F] disabled:opacity-50">
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {tr('editor_add_btn', lang)}
                </button>
                <button onClick={cancelAdd}
                  className="rounded-xl border border-[#D4AF37]/20 px-3 py-2.5 text-gray-400 transition hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ HIDDEN BENCH ════════════════════════════════════════════════════ */}
      {hiddenPhotos.length > 0 && (
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-[#D4AF37]/10" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {tr('editor_bench', lang)} — {hiddenPhotos.length}
            </p>
            <div className="h-[1px] flex-1 bg-[#D4AF37]/10" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {hiddenPhotos.map(photo => (
              <div key={photo.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 opacity-60 transition hover:opacity-80">
                <ImageWithFallback
                  src={photo.photoUrl}
                  alt={photo.title ?? `Hidden`}
                  className="h-full w-full object-cover grayscale transition group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/50" />

                {/* Restore button — always visible on mobile, hover-only on sm+ */}
                <button
                  onClick={() => toggleVisibility(photo)}
                  disabled={savingIds.includes(photo.id)}
                  title={tr('editor_restore', lang)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white opacity-100 transition-opacity disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  {savingIds.includes(photo.id)
                    ? <Loader2 className="h-6 w-6 animate-spin" />
                    : <>
                        <ArchiveRestore className="h-6 w-6 text-emerald-400" />
                        <span className="text-[11px] font-semibold text-emerald-400">{tr('editor_restore', lang)}</span>
                      </>
                  }
                </button>

                {/* Zoom — hidden bench */}
                <button
                  onClick={() => {
                    setLightboxPool(hiddenPhotos.map(p => ({ src: p.photoUrl, alt: p.title ?? '' })));
                    setLightboxIndex(hiddenPhotos.indexOf(photo));
                  }}
                  className="absolute left-1.5 top-1.5 rounded-lg bg-black/60 p-1.5 text-white opacity-100 transition hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>

                {/* Delete — always visible on mobile, hover-only on sm+ */}
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deletingIds.includes(photo.id)}
                  className="absolute right-1.5 top-1.5 rounded-lg bg-black/60 p-1.5 text-rose-400 opacity-100 transition hover:bg-rose-500/30 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  {deletingIds.includes(photo.id)
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Trash2 className="h-3.5 w-3.5" />}
                </button>

                {/* Title */}
                {photo.title && (
                  <p className="absolute bottom-1.5 left-0 right-0 truncate px-1.5 text-center text-[10px] text-white/60">
                    {photo.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

      {/* ══ LIGHTBOX ════════════════════════════════════════════════════════ */}
      {lightboxIndex !== null && lightboxPool.length > 0 && (
        <Lightbox
          images={lightboxPool}
          currentIndex={lightboxIndex}
          onClose={() => { setLightboxIndex(null); setLightboxPool([]); }}
          onPrev={() => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex(i => (i !== null && i < lightboxPool.length - 1 ? i + 1 : i))}
        />
      )}

      {/* ══ DELETE CONFIRMATION POPUP ════════════════════════════════════════ */}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-rose-500/30 bg-[#111] shadow-2xl">

            {/* Preview strip */}
            <div className="relative h-36 w-full overflow-hidden">
              <ImageWithFallback
                src={confirmDelete.photoUrl}
                alt={confirmDelete.title ?? ''}
                className="h-full w-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]" />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 ring-2 ring-rose-500/50">
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-4 text-center">
              <h3 className="text-lg font-semibold text-white">
                {tr('editor_delete_title', lang)}
              </h3>
              {confirmDelete.title && (
                <p className="mt-1 text-sm font-medium text-[#D4AF37]">"{confirmDelete.title}"</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                {tr('editor_delete_body', lang)}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/30 hover:text-white"
                >
                  {tr('modal_close', lang)}
                </button>
                <button
                  onClick={confirmDeletePhoto}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                  {tr('editor_delete_confirm_btn', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
