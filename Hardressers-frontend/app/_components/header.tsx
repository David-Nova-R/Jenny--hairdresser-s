'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import LogoBrand from './LogoBrand';
import { useEffect, useState } from 'react';
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

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const { openModal } = useModal();
  const { lang, setLang } = useLang();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setLangOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#D4AF37]/20 bg-black/85 py-4 backdrop-blur-md'
          : 'bg-black py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative flex w-full items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center">
            <button
              onClick={() => {
                closeMobileMenu();
                if (pathname !== '/') {
                  router.push('/');
                  return;
                }
                scrollToSection('hero', pathname, router);
              }}
              className="group hover:cursor-pointer hover:opacity-80 transition-opacity duration-200"
            >
              <LogoBrand />
            </button>
          </div>

          {/* LEFT NAV lg */}
          <div className="hidden lg:flex ml-12">
            <nav className="flex items-center gap-10">
              <button
                onClick={() => scrollToSection('HairStyles', pathname, router)}
                className="tracking-wide text-gray-300 transition-colors duration-300 hover:text-[#D4AF37] hover:cursor-pointer"
              >
                {tr('nav_services', lang)}
              </button>
              <button
                onClick={() => scrollToSection('gallery', pathname, router)}
                className="tracking-wide text-gray-300 transition-colors duration-300 hover:text-[#D4AF37] hover:cursor-pointer"
              >
                {tr('nav_gallery', lang)}
              </button>
              <button
                onClick={() => scrollToSection('about', pathname, router)}
                className="tracking-wide text-gray-300 transition-colors duration-300 hover:text-[#D4AF37] hover:cursor-pointer"
              >
                {tr('nav_about', lang)}
              </button>
              <button
                onClick={() => scrollToSection('contact', pathname, router)}
                className="tracking-wide text-gray-300 transition-colors duration-300 hover:text-[#D4AF37] hover:cursor-pointer"
              >
                {tr('nav_contact', lang)}
              </button>
            </nav>
          </div>

          {/* RIGHT md / lg */}
          <div className="hidden items-center gap-3 md:flex lg:gap-6">
            {/* md seulement */}
            <div className="flex items-center gap-3 lg:hidden">
              {user?.app_metadata?.isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="rounded-full border border-[#D4AF37]/30 px-5 py-2 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:cursor-pointer"
                >
                  Admin
                </button>
              )}

              {!user?.app_metadata?.isAdmin && user && (
                <button
                  onClick={() => router.push('/my-appointments')}
                  className="rounded-full border border-[#D4AF37]/30 px-5 py-2 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:cursor-pointer"
                >
                  {tr('nav_appointments', lang)}
                </button>
              )}

              {user ? (
                <button
                  onClick={() => logout()}
                  className="rounded-full bg-red-600 px-6 py-2 text-white transition-all duration-300 hover:bg-red-700 hover:cursor-pointer"
                >
                  {tr('nav_logout', lang)}
                </button>
              ) : (
                <button
                  onClick={() => openModal('login')}
                  className="rounded-full bg-[#D4AF37] px-6 py-2 text-black shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:bg-[#F4D03F] hover:cursor-pointer"
                >
                  {tr('nav_login', lang)}
                </button>
              )}

              {!user?.app_metadata?.isAdmin && (
                <button
                  onClick={() => {
                    scrollToSection('booking', pathname, router);
                    closeMobileMenu();
                  }}
                  className="rounded-full bg-[#D4AF37] px-6 py-3 text-black transition-all hover:bg-[#F4D03F] hover:cursor-pointer"
                >
                  {tr('nav_book_now', lang)}
                </button>
              )}
            </div>

            {/* lg */}
            <div className="hidden items-center gap-6 lg:flex">
              {user?.app_metadata?.isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="rounded-full border border-[#D4AF37]/30 px-5 py-2 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:cursor-pointer"
                >
                  Admin
                </button>
              )}

              {!user?.app_metadata?.isAdmin && user && (
                <button
                  onClick={() => router.push('/my-appointments')}
                  className="rounded-full border border-[#D4AF37]/30 px-5 py-2 text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:cursor-pointer"
                >
                  {tr('nav_appointments', lang)}
                </button>
              )}

              {user ? (
                <button
                  onClick={() => logout()}
                  className="rounded-full bg-red-600 px-6 py-2 text-white transition-all duration-300 hover:bg-red-700 hover:cursor-pointer"
                >
                  {tr('nav_logout', lang)}
                </button>
              ) : (
                <button
                  onClick={() => openModal('login')}
                  className="rounded-full bg-[#D4AF37] px-6 py-2 text-black shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:bg-[#F4D03F] hover:cursor-pointer"
                >
                  {tr('nav_login', lang)}
                </button>
              )}

              {!user?.app_metadata?.isAdmin && (
                <button
                  onClick={() => scrollToSection('booking', pathname, router)}
                  className="rounded-full bg-[#D4AF37] px-6 py-2 text-black shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:bg-[#F4D03F] hover:cursor-pointer"
                >
                  {tr('nav_book_now', lang)}
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 px-5 py-2 text-sm font-medium text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:cursor-pointer"
                >
                  {lang.toUpperCase()}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      langOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#111] shadow-xl shadow-black/50">
                    {LANGS.map(({ code, label }) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLang(code);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center px-5 py-2.5 text-xs font-semibold tracking-wider transition-colors hover:cursor-pointer ${
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
            </div>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-full border border-[#D4AF37]/30 p-2 text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10 hover:cursor-pointer md:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mt-4 border-t border-[#D4AF37]/20 bg-black md:hidden">
          <div className="flex flex-col gap-3 px-6 py-5">
            <button
              onClick={() => {
                scrollToSection('HairStyles', pathname, router);
                closeMobileMenu();
              }}
              className="text-left text-gray-300 transition-colors hover:text-[#D4AF37] hover:cursor-pointer"
            >
              {tr('nav_services', lang)}
            </button>

            <button
              onClick={() => {
                scrollToSection('gallery', pathname, router);
                closeMobileMenu();
              }}
              className="text-left text-gray-300 transition-colors hover:text-[#D4AF37] hover:cursor-pointer"
            >
              {tr('nav_gallery', lang)}
            </button>

            <button
              onClick={() => {
                scrollToSection('about', pathname, router);
                closeMobileMenu();
              }}
              className="text-left text-gray-300 transition-colors hover:text-[#D4AF37] hover:cursor-pointer"
            >
              {tr('nav_about', lang)}
            </button>

            <button
              onClick={() => {
                scrollToSection('contact', pathname, router);
                closeMobileMenu();
              }}
              className="text-left text-gray-300 transition-colors hover:text-[#D4AF37] hover:cursor-pointer"
            >
              {tr('nav_contact', lang)}
            </button>

            <div className="mt-2 flex gap-2">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold hover:cursor-pointer ${
                    lang === code
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                      : 'border-[#D4AF37]/30 text-[#D4AF37]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="mt-3 rounded-full bg-red-600 px-6 py-3 text-white transition-all hover:bg-red-700 hover:cursor-pointer"
              >
                {tr('nav_logout', lang)}
              </button>
            ) : (
              <button
                onClick={() => {
                  openModal('login');
                  closeMobileMenu();
                }}
                className="mt-3 rounded-full bg-[#D4AF37] px-6 py-3 text-black transition-all hover:bg-[#F4D03F] hover:cursor-pointer"
              >
                {tr('nav_login', lang)}
              </button>
            )}

            {user?.app_metadata?.isAdmin && (
              <button
                onClick={() => {
                  router.push('/admin');
                  closeMobileMenu();
                }}
                className="rounded-full border border-[#D4AF37]/30 px-5 py-3 text-center text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black hover:cursor-pointer"
              >
                Admin
              </button>
            )}

            {!user?.app_metadata?.isAdmin && user && (
              <button
                onClick={() => {
                  router.push('/my-appointments');
                  closeMobileMenu();
                }}
                className="rounded-full border border-[#D4AF37]/30 px-5 py-3 text-center text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black hover:cursor-pointer"
              >
                {tr('nav_appointments', lang)}
              </button>
            )}

            {!user?.app_metadata?.isAdmin && (
              <button
                onClick={() => {
                  scrollToSection('booking', pathname, router);
                  closeMobileMenu();
                }}
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-black transition-all hover:bg-[#F4D03F] hover:cursor-pointer"
              >
                {tr('nav_book_now', lang)}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
