import './globals.css';
import { AuthProvider } from './_context/auth-context';
import { ModalProvider } from './_context/modal-context';
import { LanguageProvider } from './_context/language-context';
import SiteHeader from './_components/header';
import SiteFooter from './_components/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        <AuthProvider>
          <ModalProvider>
            <LanguageProvider>
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </LanguageProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}