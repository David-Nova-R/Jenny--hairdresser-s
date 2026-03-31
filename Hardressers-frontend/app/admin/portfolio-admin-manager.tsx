'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Images } from 'lucide-react';
import { PortfolioPhoto } from '@/app/_models/models';
import { FetchAllPortfolioPhotosAdmin } from '@/app/_api/appointment-api';
import PortfolioEditor from '@/app/_components/PortfolioEditor';
import { tr } from '@/app/_config/translations';
import { Lang } from '@/app/_context/language-context';

interface Props {
  lang: Lang;
}

export default function PortfolioAdminManager({ lang }: Props) {
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await FetchAllPortfolioPhotosAdmin();
      const sorted = [...data].sort((a, b) => a.order - b.order);
      setPhotos(sorted);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return (
    <section className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#0a0a0a] to-black p-4 sm:p-5">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black">
            <Images className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-xl font-light text-white sm:text-2xl">
              {tr('portfolio_admin_title', lang)}
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              {tr('portfolio_admin_subtitle', lang)}
            </p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 px-4 py-2.5 text-sm text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black disabled:opacity-50 sm:w-auto sm:py-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {tr('admin_refresh', lang)}
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
        </div>
      ) : error ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-rose-500/30 bg-black text-rose-400">
          <p className="text-sm">{tr('portfolio_admin_error', lang)}</p>
          <button
            onClick={load}
            className="rounded-full border border-rose-500/30 px-4 py-2 text-sm transition hover:bg-rose-500/10"
          >
            {tr('admin_refresh', lang)}
          </button>
        </div>
      ) : (
        <PortfolioEditor
          photos={photos}
          onPhotosChange={setPhotos}
          lang={lang}
        />
      )}
    </section>
  );
}
