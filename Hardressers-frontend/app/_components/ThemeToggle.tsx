'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/_context/theme-context';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Mode jour' : 'Mode nuit'}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/40 transition-all duration-300 hover:scale-110 hover:bg-[#F4D03F]"
    >
      {theme === 'dark'
        ? <Sun  className="h-5 w-5 text-black" />
        : <Moon className="h-5 w-5 text-black" />}
    </button>
  );
}
