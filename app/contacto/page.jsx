export const runtime = 'edge';

import Image from 'next/image';
import Link from 'next/link';
import { getBrandAssets, getBrandCore } from '../../lib/base44.js';
import Nav from '../components/Nav.js';
import Cursor from '../components/Cursor.js';

export const metadata = {
  title: 'Contacto — Natalia Sánchez Rojas',
  description: 'Agendá una sesión estratégica de 60 minutos sin costo. La primera mirada es gratis.',
  openGraph: { title: 'Contacto — Natalia Sánchez Rojas', url: 'https://soynatsr.com/contacto' },
  twitter: { card: 'summary_large_image' },
};

const FORM_SCRIPT = `document.querySelector('.contact-form')?.addEventListener('submit',function(e){e.preventDefault();var btn=e.target.querySelector('.form-submit');btn.textContent='✓ Mensaje enviado';btn.style.background='#1a8a1a';setTimeout(function(){btn.textContent='Enviar mensaje';btn.style.background='';},3000);});`;

export default async function ContactoPage() {
  const [assets, brandCore] = await Promise.all([getBrandAssets(), getBrandCore()]);
  const isLogoType = (t) => t && ['logo','logos'].includes(t.toLowerCase());
  const logoAsset = assets.find(a => isLogoType(a.asset_type) && /negro|dark|blanca|white/i.test(`${a.title??''} ${a.notes??''}`)) || assets.find(a => isLogoType(a.asset_type));
  const logoUrl = logoAsset?.file_url ?? null;
  const calendlyUrl = brandCore.sections?.contacto?.calendly ?? 'https://calendly.com/natsr';

  return (
    <>
      <Cursor />
      <Nav logoUrl={logoUrl} />
      <div className="contacto-wrap">
        <div className="contacto-left">
          <div className="label">Hablemos</div>
          <h1>Empieza<br />con una<br /><em>mirada.</em></h1>
          <p>La mejor manera de saber si hay fit es una conversación directa. Te ofrezco 60 minutos de diagnóstico sin costo — sin guión de ventas, solo claridad estratégica.</p>
          <div className="contacto-options">
            <a href={calendlyUrl} className="contacto-opt" target="_blank" rel="noopener" style={{textDecoration:'none',color:'inherit',display:'block'}}>
              <p className="contacto-opt-title">💜 Sesión de diagnóstico gratuita</p>
              <p className="contacto-opt-desc">60 minutos para entender dónde estás y qué mirada necesitas primero.</p>
            </a>
            <div className="contacto-opt">
              <p className="contacto-opt-title">📋 Propuesta de proyecto</p>
              <p className="contacto-opt-desc">¿Tenés un reto específico? Cuéntame y te armo una propuesta a medida.</p>
            </div>
            <div className="contacto-opt">
              <p className="contacto-opt-title">✉️ Solo quiero escribirte</p>
              <p className="contacto-opt-desc">hola@soynatsr.com · Respondo en menos de 48hs.</p>
            </div>
          </div>
        </div>
        <div className="contacto-right">
          <div className="label">Envíame un mensaje</div>
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" placeholder="Tu nombre" />
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input type="text" placeholder="Tu empresa" />
              </div>
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input type="email" placeholder="tu@correo.com" />
            </div>
            <div className="form-group">
              <label>¿Qué necesitás?</label>
              <select defaultValue="">
                <option value="" disabled>Selecciona una opción</option>
                <option>Sesión de diagnóstico gratuita</option>
                <option>Diagnóstico 4 Miradas™</option>
                <option>Transformación estratégica</option>
                <option>Advisory mensual</option>
                <option>Mesa de Líderes</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Cuéntame más</label>
              <textarea placeholder="¿Cuál es el reto principal de tu empresa en este momento?" />
            </div>
            <button type="submit" className="form-submit">Enviar mensaje</button>
            <p className="form-note">Respondo en menos de 48 horas hábiles.</p>
          </form>
        </div>
      </div>
      <footer>
        <div className="footer-brand">{logoUrl ? <Image src={logoUrl} alt="Soy Nat SR" width={120} height={36} style={{objectFit:'contain'}} /> : <>NAT<span>.</span></>}</div>
        <ul className="footer-links">
          <li><Link href="/">Inicio</Link></li><li><Link href="/metodo">4 Miradas™</Link></li><li><Link href="/servicios">Servicios</Link></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} Natalia Sánchez Rojas</p>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: FORM_SCRIPT }} />
    </>
  );
}
