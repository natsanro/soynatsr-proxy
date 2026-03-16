'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav({ logoUrl }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const active = (href) => path === href ? 'active' : '';

  return (
    <nav>
      <Link href="/" className="nav-logo">
        {logoUrl
          ? <img src={logoUrl} alt="Soy Nat SR" />
          : <>NAT<span>.</span></>
        }
      </Link>
      <ul className={`nav-links${open ? ' open' : ''}`}>
        <li><Link href="/"          className={active('/')}          data-page="home"      onClick={() => setOpen(false)}>Inicio</Link></li>
        <li><Link href="/metodo"    className={active('/metodo')}    data-page="metodo"    onClick={() => setOpen(false)}>4 Miradas™</Link></li>
        <li><Link href="/servicios" className={active('/servicios')} data-page="servicios" onClick={() => setOpen(false)}>Servicios</Link></li>
        <li><Link href="/sobre"     className={active('/sobre')}     data-page="sobre"     onClick={() => setOpen(false)}>Sobre mí</Link></li>
        <li><Link href="/blog"      className={active('/blog')}      data-page="blog"      onClick={() => setOpen(false)}>Bitácora</Link></li>
        <li><Link href="/contacto"  className="nav-cta"              onClick={() => setOpen(false)}>Contacto</Link></li>
      </ul>
      <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}
