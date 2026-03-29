'use client';

import { useLang } from '../_context/language-context';
import { tr } from '../_config/translations';

export default function SiteFooter() {
  const { lang } = useLang();
  return (
    <footer className="border-t border-[#D4AF37]/20 bg-black px-6 py-12">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-gray-400">{tr('footer_rights', lang)}</p>
      </div>
    </footer>
  );
}
