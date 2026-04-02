import './globals.css';
import { Dancing_Script } from 'next/font/google';
import { AuthProvider } from './_context/auth-context';
import { ModalProvider } from './_context/modal-context';
import { LanguageProvider } from './_context/language-context';
import { ThemeProvider } from './_context/theme-context';
import SiteHeader from './_components/header';
import SiteFooter from './_components/footer';
import ThemeToggle from './_components/ThemeToggle';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-dancing',
});

export const metadata = {
  title: {
    default: "Jenny Styliste",
    template: "%s | Jenny Styliste",
  },
  description:
    "Professional hairstylist in Montreal specializing in modern styles and beauty services.",
  openGraph: {
    title: "Jenny Styliste",
    description:
      "Professional hairstylist in Montreal specializing in modern styles and beauty services.",
    images: ["/favicon.ico"],
  },
  Icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={dancingScript.variable}>
      <body className="bg-black text-white">
        <link rel="icon" href="/favicon.jpg" />
        <ThemeProvider>
          <AuthProvider>
            <ModalProvider>
              <LanguageProvider>
                <SiteHeader />
                <main>{children}</main>
                <SiteFooter />
                <ThemeToggle />
              </LanguageProvider>
            </ModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}