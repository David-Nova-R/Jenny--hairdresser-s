'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import LogoBrand from './LogoBrand';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/_context/auth-context';
import { useModal } from '@/app/_context/modal-context';
import { useLang, Lang } from '@/app/_context/language-context';
import { tr } from '@/app/_config/translations';

const scrollToSection = (
  id: string,
  pathname: string,
  router: ReturnType<typeof useRouter>
) => {
  if (pathname !== '/') {
    router.push(`/#${id}`);
    return;
  }

  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });

    if (id === 'booking') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('highlightBookingBtn'));
      }, 600);
    }
  }
};

const LANGS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

const NAV_ITEMS = [
  { id: 'HairStyles', key: 'nav_services' },
  { id: 'Gallery', key: 'nav_gallery' },
  { id: 'Contact', key: 'nav_contact' },
  { id: 'Reviews', key: 'nav_reviews' },
] as const;

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const { openModal } = useModal();
  const { lang, setLang } = useLang();
  const router = useRouter();
  const pathname = usePathname();

  const [screen, setScreen] = useState<'sm' | 'md' | 'lg'>('lg');
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 600) {
        setScreen('sm');
      } else if (width <= 955) {
        setScreen('md');
      } else {
        setScreen('lg');
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setLangOpen(false);
    setMobileOpen(false);
  }, [pathname, screen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setLangOpen(false);
  };

  const handleNavClick = (id: string) => {
    scrollToSection(id, pathname, router);
    closeMenus();
  };

  const secondaryBtn =
    'inline-flex items-center justify-center rounded-full border border-[#D4AF37]/25 px-4 py-2 text-sm font-medium text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F4D03F] hover:cursor-pointer';

  const primaryBtn =
    'inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:bg-[#F4D03F] hover:cursor-pointer';

  const dangerBtn =
    'inline-flex items-center justify-center rounded-full border border-red-500/35 px-4 py-2 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 hover:cursor-pointer';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#D4AF37]/15 bg-black/80 backdrop-blur-xl'
          : 'bg-black/95'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 h-20">
          {/* LEFT / BRAND */}
          <div className="flex items-center">
            <button
              onClick={() => {
                closeMenus();
                if (pathname !== '/') {
                  router.push('/');
                  return;
                }
                scrollToSection('hero', pathname, router);
              }}
              className="group flex items-center transition-opacity duration-200 hover:cursor-pointer hover:opacity-80"
              aria-label="Go to homepage"
            >
              <LogoBrand />
            </button>
          </div>

          {/* CENTER / NAV - LG ONLY */}
          {screen === 'lg' ? (
            <div className="flex justify-center px-4">
              <nav className="flex items-center gap-5">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="group relative text-sm font-medium tracking-wide text-gray-300 transition-colors duration-300 hover:text-[#D4AF37]"
                  >
                    {tr(item.key, lang)}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}
              </nav>
            </div>
          ) : (
            <div />
          )}

          {/* RIGHT / ACTIONS */}
          <div className="flex items-center justify-end gap-2">
            {/* LANGUAGE - MD + LG */}
            {(screen === 'md' || screen === 'lg') && (
              <div ref={langMenuRef} className="relative">
                <button
                  onClick={() => setLangOpen((prev) => !prev)}
                  className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:cursor-pointer"
                >
                  {lang.toUpperCase()}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      langOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[84px] overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#0F0F0F] shadow-2xl shadow-black/40">
                    {LANGS.map(({ code, label }) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLang(code);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center justify-center px-4 py-2.5 text-xs font-semibold tracking-wider transition-colors hover:cursor-pointer ${
                          lang === code
                            ? 'bg-[#D4AF37] text-black'
                            : 'text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* divider only on lg */}
            {screen === 'lg' && (
              <div className="h-6 w-px bg-[#D4AF37]/15" />
            )}

            {/* MD ACTIONS */}
            {screen === 'md' && (
              <div className="flex items-center gap-2">
                {user?.app_metadata?.isAdmin && (
                  <button
                    onClick={() => router.push('/admin')}
                    className={secondaryBtn}
                  >
                    Admin
                  </button>
                )}

                {!user?.app_metadata?.isAdmin && user && (
                  <button
                    onClick={() => router.push('/my-appointments')}
                    className={secondaryBtn}
                  >
                    {tr('nav_appointments', lang)}
                  </button>
                )}

                {user ? (
                  <button onClick={() => logout()} className={dangerBtn}>
                    {tr('nav_logout', lang)}
                  </button>
                ) : (
                  <button
                    onClick={() => openModal('login')}
                    className={secondaryBtn}
                  >
                    {tr('nav_login', lang)}
                  </button>
                )}

                {!user?.app_metadata?.isAdmin && (
                  <button
                    onClick={() => handleNavClick('booking')}
                    className={primaryBtn}
                  >
                    {tr('nav_book_now', lang)}
                  </button>
                )}
              </div>
            )}

            {/* LG ACTIONS */}
            {screen === 'lg' && (
              <div className="flex items-center gap-2">
                {user?.app_metadata?.isAdmin && (
                  <button
                    onClick={() => router.push('/admin')}
                    className={secondaryBtn}
                  >
                    Admin
                  </button>
                )}

                {!user?.app_metadata?.isAdmin && user && (
                  <button
                    onClick={() => router.push('/my-appointments')}
                    className={secondaryBtn}
                  >
                    {tr('nav_appointments', lang)}
                  </button>
                )}

                {user ? (
                  <button onClick={() => logout()} className={dangerBtn}>
                    {tr('nav_logout', lang)}
                  </button>
                ) : (
                  <button
                    onClick={() => openModal('login')}
                    className={secondaryBtn}
                  >
                    {tr('nav_login', lang)}
                  </button>
                )}

                {!user?.app_metadata?.isAdmin && (
                  <button
                    onClick={() => handleNavClick('booking')}
                    className={primaryBtn}
                  >
                    {tr('nav_book_now', lang)}
                  </button>
                )}
              </div>
            )}

            {/* BURGER - SM ONLY */}
            {screen === 'sm' && (
              <button
                onClick={() => {
                  setMobileOpen((prev) => !prev);
                  setLangOpen(false);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/25 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37]/10 hover:cursor-pointer"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE PANEL - SM ONLY */}
      {screen === 'sm' && mobileOpen && (
        <div className="border-t border-[#D4AF37]/10 bg-black/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/15 bg-[#0B0B0B] shadow-2xl shadow-black/40">
              {/* nav */}
              <div className="flex flex-col p-4">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="rounded-2xl px-3 py-3 text-center text-base font-medium text-gray-300 transition-all duration-300 hover:bg-[#D4AF37]/8 hover:text-[#D4AF37] hover:cursor-pointer"
                  >
                    {tr(item.key, lang)}
                  </button>
                ))}
              </div>

              {/* langs */}
              <div className="border-t border-[#D4AF37]/10 px-4 py-4">
                <div className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Language
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {LANGS.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all hover:cursor-pointer ${
                        lang === code
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                          : 'border-[#D4AF37]/25 text-[#D4AF37] hover:bg-[#D4AF37]/10'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* actions */}
              <div className="border-t border-[#D4AF37]/10 p-4">
                <div className="grid gap-3">
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        closeMenus();
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-red-500/35 px-5 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:cursor-pointer"
                    >
                      {tr('nav_logout', lang)}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openModal('login');
                        closeMenus();
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/25 px-5 py-3 text-sm font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10 hover:cursor-pointer"
                    >
                      {tr('nav_login', lang)}
                    </button>
                  )}

                  {user?.app_metadata?.isAdmin && (
                    <button
                      onClick={() => {
                        router.push('/admin');
                        closeMenus();
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/25 px-5 py-3 text-sm font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10 hover:cursor-pointer"
                    >
                      Admin
                    </button>
                  )}

                  {!user?.app_metadata?.isAdmin && user && (
                    <button
                      onClick={() => {
                        router.push('/my-appointments');
                        closeMenus();
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/25 px-5 py-3 text-sm font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10 hover:cursor-pointer"
                    >
                      {tr('nav_appointments', lang)}
                    </button>
                  )}

                  {!user?.app_metadata?.isAdmin && (
                    <button
                      onClick={() => handleNavClick('booking')}
                      className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-[#D4AF37]/20 transition-all hover:bg-[#F4D03F] hover:cursor-pointer"
                    >
                      {tr('nav_book_now', lang)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}