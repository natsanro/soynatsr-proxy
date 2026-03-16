'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Ocultar cuando la ruta nueva ya cargó
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  // Mostrar inmediatamente al hacer click en cualquier link interno
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      // Solo links internos (no externos, no mailto, no anclas)
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#')) return;
      // No mostrar si ya estamos en esa página
      if (href === pathname) return;
      setLoading(true);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="page-loading">
      <div className="page-loading-bar" />
    </div>
  );
}
