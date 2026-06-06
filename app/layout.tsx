import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fletix - Logística y Transporte de Cargas Argentina',
  description:
    'Estructura base profesional para la administración de logística de cargas de Argentina. Sistema SaaS moderno y premium.',
  keywords: 'logistica, transporte, cargas, argentina, camiones, fletes, saas, dashboard',
  authors: [{ name: 'Fletix Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fletix',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://fletix.com.ar',
    title: 'Fletix - Logística y Transporte',
    description: 'Plataforma Inteligente de Logística y Cargas. Optimiza tu flota y rentabilidad.',
    siteName: 'Fletix',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Fletix Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fletix - Logística y Transporte',
    description: 'Plataforma Inteligente de Logística y Cargas. Optimiza tu flota y rentabilidad.',
    images: ['/icons/icon-512x512.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground transition-colors duration-200`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
