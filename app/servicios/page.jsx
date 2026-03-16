import Image from 'next/image';
import Link from 'next/link';
import { getServices, getBrandCore } from '../../lib/base44.js';

export const revalidate = 3600;

const REVEAL = `(function(){var els=document.querySelectorAll('.reveal');if(!els.length)return;var io=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible')},i*90);io.unobserve(e.target);}});},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){io.observe(el);});})();`;

export const metadata = {
  title: 'Servicios — Natalia Sánchez Rojas',
  description: 'Consultoría estratégica, acompañamiento 1:1, Mesa de Líderes y aplicaciones. Cada servicio nace de las 4 Miradas™.',
  openGraph: { title: 'Servicios — Natalia Sánchez Rojas', url: 'https://soynatsr.com/servicios' },
  twitter: { card: 'summary_large_image' },
};

function detectCategory(svc) {
  if (svc.service_category) return svc.service_category.toLowerCase().replace(/\s+/g,'_');
  const t = `${svc.name} ${svc.description} ${svc.tagline}`.toLowerCase();
  if (['plataforma','app ','software','4 miradas os','saas'].some(k => t.includes(k))) return 'aplicaciones';
  if (['mesa','taller','workshop','retiro','cohort'].some(k => t.includes(k))) return 'experiencias';
  return 'consultoria';
}

export default async function ServiciosPage() {
  const [services, brandCore] = await Promise.all([getServices(), getBrandCore()]);
  const calendlyUrl = brandCore.sections?.contacto?.calendly ?? 'https://calendly.com/natsr';

  const mesaService = services.find(s => /mesa/i.test(s.name));
  const consultoria = services.filter(s => detectCategory(s) === 'consultoria' && !/mesa/i.test(s.name) && !/miradas/i.test(s.name));

  return (
    <>
      <section className="servicios-hero">
        <div className="label">Servicios</div>
        <h1>No hay un formato<br />único.<br /><em>Hay el tuyo.</em></h1>
        <p>El punto de entrada depende de dónde estás y qué mirada necesitás primero.</p>
      </section>

      {/* CONSULTORÍA */}
      {consultoria.length > 0 && (
        <>
          <div className="servicios-category-label" style={{borderTop:'1px solid var(--gray-700)'}}>
            <p style={{color:'var(--violet)'}}>— Servicios 1:1</p>
          </div>
          <div className="servicios-list">
            {consultoria.map((svc, i) => (
              <div key={svc.id} className="servicio-row reveal">
                <div className="servicio-num">0{i+1}</div>
                <div className="servicio-info">
                  <h3>{svc.name}</h3>
                  {svc.tagline && <p className="servicio-tagline">{svc.tagline}</p>}
                  {svc.description && <p>{svc.description}</p>}
                </div>
                <div className="servicio-meta">
                  <span className="servicio-tipo">Consultoría</span>
                  <a href={calendlyUrl} className="tag" target="_blank" rel="noopener" style={{color:'var(--violet)',borderColor:'rgba(180,0,255,0.4)',textDecoration:'none',display:'block',marginTop:'0.5rem'}}>Más información →</a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MESA DE LÍDERES */}
      {mesaService && (
        <>
          <div className="servicios-category-label" style={{borderTop:'1px solid var(--gray-700)',marginTop:'2rem'}}>
            <p style={{color:'var(--yellow)'}}>— Espacios para pensar con otros</p>
          </div>
          <div className="servicios-list">
            <div className="servicio-row reveal" style={{background:'rgba(247,234,0,0.02)'}}>
              <div className="servicio-num" style={{color:'rgba(247,234,0,0.2)'}}>
                {String(consultoria.length + 1).padStart(2,'0')}
              </div>
              <div className="servicio-info">
                <h3>{mesaService.name}</h3>
                {mesaService.tagline && <p className="servicio-tagline">{mesaService.tagline}</p>}
                {mesaService.description && <p>{mesaService.description}</p>}
              </div>
              <div className="servicio-meta">
                <span className="servicio-tipo" style={{color:'var(--yellow)'}}>Comunidad</span>
                <a href={calendlyUrl} className="tag" target="_blank" rel="noopener" style={{color:'var(--yellow)',borderColor:'rgba(247,234,0,0.4)',textDecoration:'none',display:'block',marginTop:'0.5rem'}}>Únete a la Mesa →</a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* APLICACIONES */}
      <div className="servicios-category-label" style={{borderTop:'1px solid var(--gray-700)',marginTop:'2rem'}}>
        <p style={{color:'var(--cyan)'}}>— Aplicaciones</p>
      </div>
      <div className="apps-grid">
        <div className="app-card reveal">
          <p className="app-card-label">Para consultores y líderes que piensan empresas completas</p>
          <h3>4 Miradas OS</h3>
          <p>El espacio donde organizás diagnósticos, mapeas empresas desde las 4 perspectivas y estructurás todo tu conocimiento estratégico en un solo lugar.</p>
          <a href="https://cuatromiradas.soynatsr.com" className="tag" target="_blank" rel="noopener" style={{color:'var(--cyan)',borderColor:'rgba(0,249,249,0.35)',textDecoration:'none'}}>Acceder →</a>
        </div>
        <div className="app-card reveal">
          <p className="app-card-label">Para comunidades que perdieron el control</p>
          <h3>Miradas</h3>
          <p>Gestioná grupos, reuniones y decisiones sin que nada se pierda en WhatsApp. Minutas automáticas. Memoria colectiva. Estructura que escala.</p>
          <a href="https://cuatromiradas.soynatsr.com" className="tag" target="_blank" rel="noopener" style={{color:'var(--cyan)',borderColor:'rgba(0,249,249,0.35)',textDecoration:'none'}}>Acceder →</a>
        </div>
      </div>

      <section className="center-section reveal" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',textAlign:'left',alignItems:'center'}}>
        <div>
          <div className="label">¿Por dónde empezar?</div>
          <h2 style={{fontSize:'clamp(2rem,3vw,3rem)',maxWidth:'none',margin:'0 0 0 0'}}>
            Si no estás seguro —<br /><em>empecemos por la mirada.</em>
          </h2>
        </div>
        <div>
          <p style={{color:'var(--gray-300)',fontSize:'0.95rem',lineHeight:'1.85',marginBottom:'2rem'}}>En 60 minutos entendemos dónde estás y cuál es el acompañamiento que tiene más sentido para tu momento actual.</p>
          <a href={calendlyUrl} className="btn-primary" target="_blank" rel="noopener">Agendar sesión</a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">{logoUrl ? <Image src={logoUrl} alt="Soy Nat SR" width={120} height={36} style={{objectFit:'contain'}} /> : <>NAT<span>.</span></>}</div>
        <ul className="footer-links">
          <li><Link href="/metodo">4 Miradas™</Link></li><li><Link href="/sobre">Sobre mí</Link></li><li><Link href="/contacto">Contacto</Link></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} Natalia Sánchez Rojas</p>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: REVEAL }} />
    </>
  );
}
