import type { Metadata, Viewport } from 'next';
import './globals.css';
import { weddingConfig } from '@/config/weddingConfig';

export const metadata: Metadata = {
  title: `${weddingConfig.groomName} & ${weddingConfig.brideName} - Düğün Davetiyesi`,
  description: `${weddingConfig.displayDate} tarihinde gerçekleşecek düğünümüze davetlisiniz. ${weddingConfig.slogan}`,
  openGraph: {
    title: `${weddingConfig.groomName} & ${weddingConfig.brideName} - Dijital Düğün Davetiyesi`,
    description: weddingConfig.slogan,
    type: 'website',
    locale: 'tr_TR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#070707',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark scroll-smooth">
      <body className="bg-[#070707] text-[#fcfbf7] antialiased min-h-screen selection:bg-gold-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
