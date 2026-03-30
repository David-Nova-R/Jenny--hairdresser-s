'use client';

import { Phone, X, AlertTriangle } from 'lucide-react';
import { useLang } from '../_context/language-context';
import { tr } from '../_config/translations';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function ServerErrorModal({ show, onClose }: Props) {
  const { lang } = useLang();
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-8 text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>

        <h2 className="mb-3 text-2xl font-light text-white">
          {tr('error_title', lang)}
        </h2>

        <p className="mb-6 leading-relaxed text-gray-400">
          {tr('error_body', lang)}
        </p>

        <div className="mx-auto mb-6 h-[1px] w-16 bg-[#D4AF37]/40" />

        <p className="mb-4 text-sm text-gray-400">
          {tr('error_contact_hint', lang)}
        </p>

        <a
          href="tel:+15551234567"
          className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37] px-8 py-3 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
        >
          <Phone className="h-4 w-4" />
          +1 (555) 123-4567
        </a>
      </div>
    </div>
  );
}
