'use client';

import { Scissors, ChevronDown } from 'lucide-react';
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-black/85 backdrop-blur-md border-b border-[#D4AF37]/20 py-4'
                : 'bg-black py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <button
                    onClick={() => {
                        if (pathname !== '/') {
                            router.push('/');
                            return;
                        }
                        scrollToSection('hero', pathname, router);
                    }}
                    className="flex items-center gap-3 group"
                >
                    <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className="text-xl tracking-wider font-light text-white">
                        LUXURY <span className="text-[#D4AF37]">HAIR</span>
                    </span>
                </button>

                {/* Liens de navigation centrés */}
                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-2/3">
                    {user?.app_metadata?.isAdmin && (
                        <button
                            onClick={() => router.push('/admin')}
                            className="border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                        >
                            Admin
                        </button>
                    )}
                    <button
                        onClick={() => scrollToSection('HairStyles', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        {tr('nav_services', lang)}
                    </button>
                    <button
                        onClick={() => scrollToSection('gallery', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        {tr('nav_gallery', lang)}
                    </button>
                    <button
                        onClick={() => scrollToSection('about', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        {tr('nav_about', lang)}
                    </button>
                    <button
                        onClick={() => scrollToSection('contact', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        {tr('nav_contact', lang)}
                    </button>
                </nav>

                {/* Actions à droite */}
                <div className="hidden md:flex items-center gap-3">
                    {!user?.app_metadata?.isAdmin && user && (
                        <button
                            onClick={() => router.push('/my-appointments')}
                            className="border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                        >
                            {tr('nav_appointments', lang)}
                        </button>
                    )}

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => logout()}
                                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300"
                                >
                                    {tr('nav_logout', lang)}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => openModal('login')}
                                className="bg-[#D4AF37] text-black px-6 py-2 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-lg shadow-[#D4AF37]/20"
                            >
                                {tr('nav_login', lang)}
                            </button>
                        )}

                        <button
                            onClick={() => scrollToSection('booking', pathname, router)}
                            className="bg-[#D4AF37] text-black px-6 py-2 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-lg shadow-[#D4AF37]/20"
                        >
                            {tr('nav_book_now', lang)}
                        </button>

                        {/* Dropdown langue */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen((o) => !o)}
                                className="flex items-center gap-1 rounded-full border border-[#D4AF37]/30 px-3 py-2 text-xs font-semibold tracking-wider text-[#D4AF37] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                            >
                                {lang.toUpperCase()}
                                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {langOpen && (
                                <div className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#111] shadow-xl shadow-black/50">
                                    {LANGS.map(({ code, label }) => (
                                        <button
                                            key={code}
                                            onClick={() => { setLang(code); setLangOpen(false); }}
                                            className={`flex w-full items-center px-5 py-2.5 text-xs font-semibold tracking-wider transition-colors ${
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
            </div>
        </header>
    );
}
