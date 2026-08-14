import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { BottomNav } from '@/components/navigation/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Sargazo Watch — Monitoreo Ciudadano de Sargazo en Playas del Caribe',
  description: 'Consulta en tiempo real el estado de las playas de Cancún, Playa del Carmen, Tulum, Cozumel e Isla Mujeres. Reporta sargazo con fotos geolocalizadas 100% gratis.',
  keywords: ['sargazo', 'playas mexico', 'cancun sargazo', 'tulum sargazo', 'playa del carmen sargazo', 'monitoreo playas', 'caribe mexicano'],
  authors: [{ name: 'Comunidad Sargazo Watch' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Sargazo Watch — Monitoreo Ciudadano del Caribe',
    description: 'Estado de las playas en tiempo real reportado por la comunidad.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0891b2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} font-sans`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-8 max-w-7xl w-full mx-auto px-4 pt-4">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
