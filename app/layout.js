import './globals.css';

export const metadata = {
  title: 'Nat SR — Estrategia, Liderazgo y Estructura',
  description: 'Ayudo a líderes y empresas a construir sistemas más claros, coherentes y funcionales a través de la metodología 4 MIRADAS.',
  openGraph: {
    title: 'Nat SR — Estrategia, Liderazgo y Estructura',
    description: 'Metodología 4 MIRADAS: liderazgo, estructura, operación, tecnología y datos.',
    url: 'https://soynatsr.com',
    siteName: 'Soy Nat SR',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
