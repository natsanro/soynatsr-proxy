import './globals.css';

export const metadata = {
  title: 'Natalia Sánchez Rojas — Estrategia · 4 Miradas™',
  description: 'Trabajo con líderes y empresas que quieren crecer — pero que sienten que algo invisible los frena. Mi metodología 4 Miradas™ convierte ese ruido en claridad estratégica.',
  metadataBase: new URL('https://soynatsr.com'),
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
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
