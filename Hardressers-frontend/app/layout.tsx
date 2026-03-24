import './globals.css';
import { AuthProvider } from './_context/auth-context';
import { ModalProvider } from './_context/modal-context';
import SiteHeader from './_components/header';
import SiteFooter from './_components/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
        <AuthProvider>
          <ModalProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}