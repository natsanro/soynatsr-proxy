import { Playfair_Display, DM_Mono, Syne } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata = {
  title: 'Natalia Sánchez Rojas — Estrategia · 4 Miradas™',
  description: 'Trabajo con líderes y empresas que quieren crecer — pero que sienten que algo invisible los frena. Mi metodología 4 Miradas™ convierte ese ruido en claridad estratégica.',
  metadataBase: new URL('https://soynatsr.com'),
  verification: { google: 'mRp8WEbNQTO7wukIPjI2_0_2VFIojM_Bl7a2bi-3ZsE' },
  openGraph: {
    title: 'Natalia Sánchez Rojas — Estrategia · 4 Miradas™',
    description: 'Metodología 4 Miradas™: liderazgo, estructura, operación, tecnología y datos.',
    url: 'https://soynatsr.com',
    siteName: 'Soy Nat SR',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natalia Sánchez Rojas — Estrategia · 4 Miradas™',
    description: 'Metodología 4 Miradas™: liderazgo, estructura, operación, tecnología y datos.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmMono.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
