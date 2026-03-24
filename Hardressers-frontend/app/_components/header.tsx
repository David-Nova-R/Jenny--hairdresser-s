'use client';

import { Scissors } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/_context/auth-context';
import { useModal } from '@/app/_context/modal-context';

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
    }
};

export default function SiteHeader() {
    const { user, logout } = useAuth();
    const { openModal } = useModal();
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

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

                <nav className="hidden md:flex items-center gap-8">
                    {user?.app_metadata?.isAdmin && (
                        <button
                            onClick={() => router.push('/admin')}
                            className="border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                        >
                            Admin
                        </button>
                    )}
                    {!user?.app_metadata?.isAdmin && user &&
                        <button
                            onClick={() => router.push('/my-appointments')}
                            className="border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                        >
                            My Appointments
                        </button>
                    }
                    <button
                        onClick={() => scrollToSection('HairStyles', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        HairStyles
                    </button>
                    <button
                        onClick={() => scrollToSection('gallery', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        Gallery
                    </button>
                    <button
                        onClick={() => scrollToSection('about', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        About
                    </button>
                    <button
                        onClick={() => scrollToSection('contact', pathname, router)}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 tracking-wide"
                    >
                        Contact
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        {user ? (
                            <div className="flex items-center gap-3 border-x border-[#D4AF37]/20 px-3">

                                <span className="text-gray-300 text-sm">{user.email}</span>

                                <button
                                    onClick={() => logout()}
                                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => openModal('login')}
                                className="bg-[#D4AF37] text-black px-6 py-2 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-lg shadow-[#D4AF37]/20"
                            >
                                Login
                            </button>
                        )}

                        <button
                            onClick={() => scrollToSection('booking', pathname, router)}
                            className="bg-[#D4AF37] text-black px-6 py-2 rounded-full hover:bg-[#F4D03F] transition-all duration-300 shadow-lg shadow-[#D4AF37]/20"
                        >
                            Book Now
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}