import Image from 'next/image';
import Link from 'next/link';
import { getServices, getBrandAssets, getBrandCore, getCEOProfile } from '../lib/base44.js';
import Nav from './components/Nav.js';
import Cursor from './components/Cursor.js';

function detectCategory(svc) {
  if (svc.service_category) return svc.service_category.toLowerCase().replace(/\s+/g, '_');
  const text = `${svc.name} ${svc.description} ${svc.tagline}`.toLowerCase();
  if (['plataforma','app ','software','4 miradas os','saas'].some(k => text.includes(k))) return 'aplicaciones';
  return 'consultoria';
}

const MIRADAS_4 = [
  { n:'1', short:'Estratégica',    label:'Mirada Estratégica',    question:'¿Qué transformar?',       desc:'Consciencia del líder · Visión · Dirección estratégica · Modelo de negocio' },
  { n:'2', short:'Funcional',      label:'Mirada Funcional',      question:'¿Cómo opera el sistema?', desc:'Procesos · Roles · Flujos de trabajo · Eficiencia operacional' },
  { n:'3', short:'Data',           label:'Mirada Data',           question:'¿Qué se mide?',           desc:'Tecnología · Métricas · Gaps de información · Decisiones basadas en datos' },
  { n:'4', short:'Organizacional', label:'Mirada Organizacional', question:'¿Qué opera debajo?',      desc:'Cultura · Patrones invisibles · Energía del equipo · Liderazgo consciente' },
];

const TICKER_ITEMS = [
  'Mirada Estratégica','Mirada Funcional','Mirada Data','Mirada Organizacional',
  'Estrategia','Transformación','Liderazgo Consciente',
  'Mirada Estratégica','Mirada Funcional','Mirada Data','Mirada Organizacional',
  'Estrategia','Transformación','Liderazgo Consciente',
];

const REVEAL_SCRIPT = `(function(){
  var els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){
      if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible')},i*90);io.unobserve(e.target);}
    });
  },{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){io.observe(el);});
})();`;

export async function generateMetadata() {
  const assets = await getBrandAssets();
  const hero = assets.find(a => a.category === 'natalia' && (a.asset_type === 'photo' || a.asset_type === 'hero')) || assets.find(a => a.category === 'natalia');
  const images = hero?.file_url ? [{ url: hero.file_url, width: 1200, height: 630, alt: 'Natalia Sánchez Rojas' }] : [];
  return {
    openGraph: { url: 'https://soynatsr.com', images },
    twitter: { images: images.map(i => i.url) },
  };
}

export default async function HomePage() {
  const [services, assets, brandCore, ceoProfile] = await Promise.all([
    getServices(), getBrandAssets(), getBrandCore(), getCEOProfile(),
  ]);

  const { sections } = brandCore;
  const narrative = sections?.narrativa ?? {};
  const position  = sections?.posicionamiento ?? {};

  const isLogoType = (t) => t && ['logo','logos'].includes(t.toLowerCase());
  const logoAsset =
    assets.find(a => isLogoType(a.asset_type) && /negro|dark|blanca|white/i.test(`${a.title??''} ${a.notes??''}`)) ||
    assets.find(a => isLogoType(a.asset_type));
  const logoUrl = logoAsset?.file_url ?? null;

  const heroAsset =
    assets.find(a => a.category === 'natalia' && (a.asset_type === 'photo' || a.asset_type === 'hero')) ||
    assets.find(a => a.category === 'natalia') ||
    assets.find(a => a.asset_type === 'photo');

  const aboutAsset = assets.find(a => a.category === 'natalia' && a.id !== heroAsset?.id) || heroAsset;

  const heroTitle = narrative.hero_titulo ?? position.propuesta_valor ?? 'Lo que <em>no ves</em> es lo que más te cuesta.';
  const heroSub   = narrative.hero_subtitulo ?? position.descripcion_corta ?? 'Trabajo con líderes y empresas que quieren crecer — pero que sienten que algo invisible los frena. Mi metodología 4 Miradas™ convierte ese ruido en claridad estratégica.';

  const calendlyUrl   = sections?.contacto?.calendly ?? sections?.contacto?.agenda_url ?? 'https://calendly.com/natsr';
  const newsletterUrl = sections?.contacto?.newsletter ?? sections?.redes_sociales?.newsletter ?? 'https://www.linkedin.com/newsletters/';

  return (
    <>
      <Cursor />
      <Nav logoUrl={logoUrl} />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow anim-fade-up anim-delay-1">Estrategia · Transformación · 4 Miradas™</p>
          <h1 className="hero-headline anim-fade-up anim-delay-2">
            Lo que <em>no ves</em><br />
            es lo que más<br />
            te cuesta.
          </h1>
          <p className="hero-body anim-fade-up anim-delay-3">{heroSub}</p>
          <div className="hero-actions anim-fade-up anim-delay-4">
            <Link href="/metodo" className="btn-primary">Conocer el método</Link>
            <Link href="/contacto" className="btn-outline">Agendar sesión</Link>
          </div>
          <div className="hero-scroll anim-fade-up anim-delay-5">Sigue leyendo</div>
        </div>
        <div className="hero-right" style={{position:'relative'}}>
          {heroAsset?.file_url
            ? <Image fill priority className="anim-fade-in" src={heroAsset.file_url} alt="Natalia Sánchez Rojas" style={{objectFit:'cover'}} />
            : <div style={{width:'100%',height:'100%',background:'var(--gray-900)'}} />
          }
          <div className="hero-right-overlay" />
          <p className="hero-right-corner">"Las empresas son el espejo de sus líderes."</p>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="ticker-item">{item} <span>◆</span></span>
          ))}
        </div>
      </div>

      {/* ── SYMPTOMS / DIAGNÓSTICO ── */}
      <section className="symptoms-section">
        <div className="symptoms-left reveal">
          <div className="label">El diagnóstico real</div>
          <h2>Tu empresa funciona.<br />Pero podría funcionar<br /><em>mucho mejor.</em></h2>
          <p style={{marginTop:'1.5rem'}}>Hay algo en los procesos que no fluye. Datos que existen pero nadie usa. Equipos que trabajan en paralelo sin saberlo. No es una crisis — es ruido acumulado. Y el ruido cuesta.</p>
        </div>
        <div className="symptoms-list reveal">
          {[
            'Tomás decisiones con información incompleta o que llega tarde.',
            'Tus operaciones dependen de personas, no de sistemas.',
            'Creces en ventas pero el margen no acompaña el crecimiento.',
            'Cada área trabaja en su propio idioma. Nadie habla el mismo.',
            'Tenés tecnología, pero no la estás aprovechando realmente.',
            'Sabés que hay valor invisible en tu empresa. No sabés dónde está.',
          ].map((s, i) => <div key={i} className="symptom-item">{s}</div>)}
        </div>
      </section>

      {/* ── 4 MIRADAS TEASER ── */}
      <section className="miradas-teaser">
        <div className="miradas-teaser-header reveal">
          <div>
            <div className="label">La metodología</div>
            <h2>Cuatro miradas.<br />Una transformación <em>completa.</em></h2>
          </div>
          <p>4 Miradas™ no es un diagnóstico estándar. Es un sistema de cuatro perspectivas simultáneas que revela qué está pasando, por qué ocurre y qué hacer al respecto — con claridad que se puede accionar hoy.</p>
        </div>
        <div className="miradas-4-grid reveal">
          {MIRADAS_4.map(m => (
            <div key={m.n} className="mirada-card" data-mirada={m.n}>
              <div className="mirada-num">{m.short}</div>
              <div className="mirada-tag-label">0{m.n} · Mirada</div>
              <h3 className="mirada-name">{m.label}</h3>
              <p className="mirada-question">{m.question}</p>
              <p className="mirada-desc">{m.desc}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:'3rem'}} className="reveal">
          <Link href="/metodo" className="btn-primary">Ver el método completo</Link>
        </div>
      </section>

      {/* ── ABOUT TEASER ── */}
      <section className="home-nat">
        <div className="home-nat-text reveal">
          <div className="label">Quién está detrás</div>
          <h2>Estratega.<br />Fundadora.<br /><em>La confidente estratégica.</em></h2>
          <p>He pasado años trabajando con empresas que hacen bien muchas cosas, pero que no ven con claridad lo que las limita. <strong>Empecé a notar un patrón:</strong> el problema casi nunca está donde el líder cree que está.</p>
          <p>Está en los espacios entre las áreas. En los datos que se ignoran. En las decisiones que se toman por inercia. <strong>En lo que nadie se atreve a nombrar en la reunión.</strong></p>
          <div style={{marginTop:'2.5rem',display:'flex',gap:'1rem',flexWrap:'wrap'}}>
            <Link href="/sobre" className="btn-primary">Mi historia</Link>
            <Link href="/metodo" className="btn-outline">El método</Link>
          </div>
        </div>
        <div className="home-nat-visual reveal" style={{position:'relative'}}>
          {aboutAsset?.file_url
            ? <Image fill src={aboutAsset.file_url} alt="Natalia Sánchez Rojas" style={{objectFit:'cover'}} />
            : <div style={{width:'100%',height:'500px',background:'var(--gray-900)'}} />
          }
          <div className="home-nat-badge">
            <p>"Las empresas son el espejo de sus líderes — todo lo que no se trabaja adentro, opera afuera."</p>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="home-cta-band reveal">
        <h2>Hay algo en tu empresa<br />que está esperando<br /><em>ser visto.</em></h2>
        <div className="home-cta-band-actions">
          <a href={calendlyUrl} className="btn-primary" target="_blank" rel="noopener">Agendar sesión estratégica</a>
          <span className="home-cta-note">Sin costo · 60 minutos · Solo claridad</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-brand">
          {logoUrl ? <Image src={logoUrl} alt="Soy Nat SR" width={120} height={36} style={{objectFit:'contain'}} /> : <>NAT<span>.</span></>}
        </div>
        <ul className="footer-links">
          <li><Link href="/metodo">4 Miradas™</Link></li>
          <li><Link href="/servicios">Servicios</Link></li>
          <li><Link href="/blog">Bitácora</Link></li>
          <li><Link href="/contacto">Contacto</Link></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} Natalia Sánchez Rojas</p>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
    </>
  );
}
