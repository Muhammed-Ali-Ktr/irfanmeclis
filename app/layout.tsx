import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'İrfan Meclisi 2026 | TİMAV Önderliğinde',
  description: 'Türkiye İmam Hatipliler Vakfı (TİMAV) öncülüğünde “Kökümüz İrfan, Sözümüz İstikbal” anlayışıyla 23-24-25 Ekim 2026 tarihlerinde Konya Selçuklu Kongre Merkezi\'nde düzenlenecek olan İrfan Meclisi resmi web portalı. 8 ihtisas komisyonu, 250 delege ve yasa simülasyonu.',
  keywords: [
    'İrfan Meclisi',
    'TİMAV',
    'Gençlik Meclisi',
    'Kökümüz İrfan Sözümüz İstikbal',
    'Konya 2026',
    'Meclis Simülasyonu',
    'Selçuklu Kongre Merkezi',
    'Delege Başvurusu'
  ],
  authors: [{ name: 'TİMAV' }],
  openGraph: {
    title: 'İrfan Meclisi 2026 | TİMAV Önderliğinde',
    description: '“Kökümüz İrfan, Sözümüz İstikbal” - 23-24-25 Ekim 2026 Konya Selçuklu Kongre Merkezi.',
    url: 'https://irfanmeclisi.timav.org.tr',
    siteName: 'İrfan Meclisi',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable} font-sans`}>
      <body className="min-h-screen flex flex-col bg-[#061A33] text-slate-100 antialiased selection:bg-[#4DA3FF] selection:text-white w-full max-w-full overflow-x-hidden relative">
        <Navbar />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

