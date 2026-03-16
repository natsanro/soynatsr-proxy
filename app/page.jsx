import { getServices, getBrandAssets, getBrandCore, getCEOProfile } from '../lib/base44.js';

// ─── Service category mapping ───────────────────────────────────────────────
// Uses service_category field if present; falls back to keyword detection in name/description
const CATEGORY_LABELS = {
  consultoria:  'Consultoría',
  experiencias: 'Experiencias',
  aplicaciones: 'Aplicaciones',
};

const CATEGORY_KEYWORDS = {
  // Only match when clearly a digital product / platform
  aplicaciones: ['plataforma', 'app ', 'software', 'sistema operativo', '4 miradas os', 'saas', 'suscripción digital', 'herramienta digital'],
  // Only match when clearly a live/group experience
  experiencias: ['taller', 'workshop', 'mesa de', 'mesa redonda', 'evento', 'retiro', 'cohort', 'bootcamp', 'programa grupal', 'sesión grupal', 'experiencia colectiva'],
};

function detectCategory(svc) {
  if (svc.service_category) return svc.service_category.toLowerCase().replace(/\s+/g, '_');
  const text = `${svc.name} ${svc.description} ${svc.tagline}`.toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some(kw => text.includes(kw))) return cat;
  }
  return 'consultoria';
}

function categorizeServices(services) {
  const buckets = { consultoria: [], experiencias: [], aplicaciones: [] };
  for (const svc of services) {
    const cat = detectCategory(svc);
    if (buckets[cat]) buckets[cat].push(svc);
    else buckets.consultoria.push(svc);
  }
  return Object.entries(buckets)
    .filter(([, svcs]) => svcs.length > 0)
    .map(([key, svcs]) => ({ key, label: CATEGORY_LABELS[key] ?? key, services: svcs }));
}

// ─── Build CSS variables from BrandCore colors section ──────────────────────
// Handles both pure hex fields AND hex colors embedded in text descriptions
// e.g. "Violeta #B400FF, Amarillo #F7EA00, Cian #00F9F9 y Fucsia #FF0099"
function buildCssVars(sections) {
  const colorSection = sections?.colores ?? {};
  const typogSection = sections?.tipografias ?? {};

  const isPureHex = (v) => v && /^#([0-9A-Fa-f]{3,8})$/.test(v.trim());
  const isPureRgb = (v) => v && /^rgb/i.test(v.trim());
  const isColor   = (v) => isPureHex(v) || isPureRgb(v);

  // Extract { hex, context } tokens from all fields in colores section
  // Supports both pure-hex field values and hex codes embedded in text
  const tokens = [];
  for (const [fieldName, fieldValue] of Object.entries(colorSection)) {
    if (!fieldValue || typeof fieldValue !== 'string') continue;
    if (isPureHex(fieldValue.trim())) {
      tokens.push({ hex: fieldValue.trim(), context: fieldName.toLowerCase() });
    } else if (isPureRgb(fieldValue.trim())) {
      tokens.push({ hex: fieldValue.trim(), context: fieldName.toLowerCase() });
    } else {
      // Extract all #RRGGBB occurrences with surrounding text as context
      const matches = [...fieldValue.matchAll(/#([0-9A-Fa-f]{6})\b/g)];
      for (const m of matches) {
        const start = Math.max(0, m.index - 50);
        const end   = Math.min(fieldValue.length, m.index + 20);
        const ctx   = fieldValue.slice(start, end).toLowerCase();
        tokens.push({ hex: m[0], context: ctx });
      }
    }
  }

  // Semantic slots — keywords matched against field name + surrounding text
  const semanticSlots = [
    { cssVar: '--bg',             keywords: ['fondo', 'background', 'base', 'bg', 'oscuro', 'dark', 'negro', 'black', '000000'] },
    { cssVar: '--text',           keywords: ['texto', 'text', 'blanco', 'white', 'claro', 'light', 'ffffff'] },
    { cssVar: '--accent',         keywords: ['violeta', 'purple', 'principal', 'primario', 'acento', 'main', 'primary', 'marca', 'brand', 'electrico', 'eléctrico', 'b400ff'] },
    { cssVar: '--accent-alt',     keywords: ['amarillo', 'yellow', 'secundario', 'second', 'alt', 'complemento', 'f7ea00'] },
    { cssVar: '--accent-cyan',    keywords: ['cian', 'cyan', 'turquesa', 'teal', '00f9f9'] },
    { cssVar: '--accent-pink',    keywords: ['fucsia', 'fuchsia', 'rosa', 'pink', 'magenta', 'ff0099'] },
  ];

  const assignments = {};
  const usedHex = new Set();

  // First pass: semantic matching on context
  for (const { cssVar, keywords } of semanticSlots) {
    for (const { hex, context } of tokens) {
      if (usedHex.has(hex)) continue;
      if (keywords.some(kw => context.includes(kw))) {
        assignments[cssVar] = hex;
        usedHex.add(hex);
        break;
      }
    }
  }

  // Second pass: fill remaining unassigned slots in order
  const remainingTokens = tokens.filter(t => !usedHex.has(t.hex));
  const unfilledSlots   = semanticSlots.map(s => s.cssVar).filter(v => !assignments[v]);
  remainingTokens.forEach(({ hex }, i) => {
    if (unfilledSlots[i]) assignments[unfilledSlots[i]] = hex;
  });

  // Derive dim/border variants from --accent
  if (assignments['--accent']) {
    assignments['--accent-dim']    = assignments['--accent'] + '18';
    assignments['--accent-border'] = assignments['--accent'] + '40';
  }

  // Typography: find any font name in tipografias section
  const fontEntry = Object.entries(typogSection)
    .find(([k]) => ['principal', 'fuente', 'font', 'titulo', 'body', 'primaria'].some(kw => k.toLowerCase().includes(kw)));
  const fontFamily = fontEntry?.[1] ?? null;

  const lines = [];
  for (const [varName, value] of Object.entries(assignments)) {
    if (value) lines.push(`  ${varName}: ${value};`);
  }
  const resolvedFont = fontFamily && !isColor(fontFamily) ? fontFamily : null;
  if (resolvedFont) {
    lines.push(`  --font: '${resolvedFont}', -apple-system, BlinkMacSystemFont, sans-serif;`);
  }

  return {
    css: lines.length ? `:root {\n${lines.join('\n')}\n}` : '',
    fontFamily: resolvedFont,
  };
}

// ─── Extract best text from a BrandCore section ─────────────────────────────
// Returns the longest/most relevant field value, ignoring very short entries
function pickText(sectionObj, minLen = 30) {
  if (!sectionObj) return null;
  const entries = Object.values(sectionObj).filter(v => typeof v === 'string' && v.length >= minLen);
  if (!entries.length) return null;
  return entries.reduce((a, b) => (b.length > a.length ? b : a));
}

// ─── Truncate bio to first N sentences ──────────────────────────────────────
// Prevents the full raw historia from flooding the "Sobre mí" section
function truncateBio(text, maxSentences = 3, maxChars = 400) {
  if (!text) return null;
  // Sentence split on ". ", "! ", "? " boundaries
  const sentences = text.trim().split(/(?<=[.!?])\s+/);
  const slice = sentences.slice(0, maxSentences).join(' ');
  if (slice.length <= maxChars) return slice;
  // Fallback hard-trim at word boundary
  return slice.slice(0, maxChars).replace(/\s+\S*$/, '') + '…';
}

// ─── 4 MIRADAS methodology — full descriptions matching Experience page ───────
const MIRADAS_4 = [
  { label: 'Mirada Estratégica',    desc: 'Consciencia del líder y visión. ¿Hacia dónde vas realmente? ¿Qué decisiones te acercan o alejan de tu propósito?',                                  color: '#B400FF' },
  { label: 'Mirada Funcional',      desc: 'Procesos, roles y flujos. Diseñamos cómo funciona tu empresa para crecer con orden sin perder agilidad.',                                            color: '#F7EA00' },
  { label: 'Mirada Data',           desc: 'Tecnología, métricas e información. Transformamos datos en decisiones, y la tecnología en una aliada estratégica.',                                  color: '#00F9F9' },
  { label: 'Mirada Organizacional', desc: 'Cultura, patrones y energía del equipo. Alineamos a las personas con la estrategia para que el cambio sea evolución.',                              color: '#FF0099' },
];

// ─── Scroll reveal script ────────────────────────────────────────────────────
const REVEAL_SCRIPT = `
(function(){
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
`;

// ─── Page (Server Component) ─────────────────────────────────────────────────
export default async function PortfolioWebsiteTemplate() {
  const [services, assets, brandCore, ceoProfile] = await Promise.all([
    getServices(),
    getBrandAssets(),
    getBrandCore(),
    getCEOProfile(),
  ]);

  const { sections } = brandCore;
  const identity  = sections?.identidad       ?? {};
  const narrative = sections?.narrativa       ?? {};
  const position  = sections?.posicionamiento ?? {};
  const tone      = sections?.tono            ?? {};
  const contactBC = sections?.contacto        ?? {};

  // Dynamic CSS vars + font family from BrandCore
  const { css: cssVars, fontFamily: brandFont } = buildCssVars(sections);
  // If BrandCore has a custom font, inject Google Fonts @import so the browser loads it
  const fontImport = brandFont
    ? `@import url('https://fonts.googleapis.com/css2?family=${brandFont.trim().replace(/\s+/g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');`
    : null;

  // Hero image
  const heroAsset =
    assets.find(a => a.category === 'natalia' && (a.asset_type === 'photo' || a.asset_type === 'hero')) ||
    assets.find(a => a.category === 'natalia') ||
    assets.find(a => a.asset_type === 'photo') ||
    assets.find(a => a.category === 'visual');

  // About image
  const aboutAsset =
    assets.find(a => a.category === 'natalia' && a.id !== heroAsset?.id) ||
    heroAsset;

  // Logo — flexible match: 'logo', 'logos', 'LOGOS', etc. Prefers dark-bg version for dark site
  const isLogoType = (t) => t && ['logo', 'logos'].includes(t.toLowerCase());
  const logoAsset =
    assets.find(a => isLogoType(a.asset_type) && /negro|dark|blanca|white/i.test(`${a.title} ${a.notes ?? ''}`)) ||
    assets.find(a => isLogoType(a.asset_type));
  const logoUrl   = logoAsset?.file_url ?? sections?.elementos_graficos?.logo_url ?? null;

  // Mesa de Líderes — pulled out as its own cinematic section
  const mesaService        = services.find(s => /mesa/i.test(s.name));
  const consultoriaServices = services.filter(s => detectCategory(s) === 'consultoria' && !/mesa/i.test(s.name));
  const aplicacionesServices = services.filter(s => detectCategory(s) === 'aplicaciones');

  // Photo for Mesa de Líderes section — look for BrandAsset with "mesa" in title/notes
  const mesaPhoto = assets.find(a => /mesa/i.test(`${a.title ?? ''} ${a.notes ?? ''}`));

  // Hero copy — specific field names first, then pick longest text in section
  const heroTitle =
    narrative.hero_titulo    ??
    narrative.titulo         ??
    position.propuesta_valor ??
    position.titulo          ??
    pickText(position, 40)   ??
    'Ayudo a líderes a rediseñar su estructura, ordenar su realidad y construir sistemas que realmente funcionen.';

  const heroSub =
    narrative.hero_subtitulo    ??
    narrative.subtitulo         ??
    position.descripcion_corta  ??
    tone.voz                    ??
    pickText(tone, 40)          ??
    'Integro liderazgo, estructura, operación, tecnología y datos para que tu empresa avance con más claridad y coherencia.';

  // About copy — CEOProfile bio is the best source, then BrandCore historia
  // Always truncate to avoid dumping the full raw text
  const rawAbout =
    ceoProfile?.bio             ??
    narrative.sobre_mi          ??
    identity.descripcion        ??
    sections?.historia?.resumen ??
    pickText(sections?.historia, 80) ??
    pickText(identity, 80)      ??
    'Soy estratega, diseño sistemas claros para líderes que quieren ordenar su realidad y construir estructuras que funcionen de verdad. Integro liderazgo, operación, tecnología y datos desde la metodología 4 MIRADAS.';
  const aboutText = truncateBio(rawAbout, 3, 420);

  const aboutTagline =
    ceoProfile?.tagline         ??
    narrative.tagline           ??
    identity.tagline            ??
    sections?.promesa?.tagline  ??
    null;

  // Contact
  const calendlyUrl    = contactBC.calendly ?? contactBC.agenda_url ?? 'https://calendly.com/natsr';
  const newsletterUrl  = contactBC.newsletter ?? contactBC.newsletter_url ?? sections?.redes_sociales?.newsletter ?? 'https://www.linkedin.com/newsletters/';

  // ── All editable site texts from BrandCore (narrativa section) ──────────────
  const metodologiaTitle   = narrative.metodologia_titulo   ?? 'Una mirada completa para una transformación real.';
const serviciosTitulo    = narrative.servicios_titulo     ?? 'El acompañamiento que tu empresa necesita hoy.';
  const mesaHeadline       = narrative.mesa_headline        ?? 'Todo líder necesita un espacio íntimo para intercambiar miradas.';
  const aplicacionesTitulo = narrative.aplicaciones_titulo  ?? 'Herramientas digitales para líderes en movimiento.';
  const newsletterTitulo   = narrative.newsletter_titulo    ?? null;
  const newsletterBodyText = narrative.newsletter_body      ?? null;
  const contactoTitulo     = narrative.contacto_titulo      ?? '¿Querés trabajar conmigo?';
  const contactoSub        = narrative.contacto_sub         ?? 'Si querés ordenar tu realidad, rediseñar tu estructura y construir un sistema más claro para tu empresa, agendá una llamada estratégica.';

  return (
    <>
      {/* ── Brand styles: custom font @import + CSS variables ───── */}
      {(fontImport || cssVars) && (
        <style dangerouslySetInnerHTML={{ __html: [fontImport, cssVars].filter(Boolean).join('\n\n') }} />
      )}

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          {logoUrl
            ? <img src={logoUrl} alt="Soy Nat SR" className="nav-logo-img" />
            : <>Soy Nat <span>SR</span></>
          }
        </a>
        <ul className="nav-links">
          <li><a href="#metodologia">Metodología</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#sobre-mi">Sobre mí</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <a href="https://cuatromiradas.soynatsr.com" className="btn-login" target="_blank" rel="noopener">
          Login
        </a>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-tag">Metodología 4 MIRADAS</span>
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-sub">{heroSub}</p>
            <div className="hero-actions">
              <a href="#servicios" className="btn-primary">Conocé mis servicios</a>
              <a href="#contacto" className="btn-secondary">Agendar llamada estratégica</a>
            </div>
          </div>

          {heroAsset?.file_url ? (
            <div className="hero-image">
              <img src={heroAsset.file_url} alt="Natalia Sánchez Rojas" />
              <div className="hero-image-overlay" />
            </div>
          ) : (
            <div className="hero-image" style={{ background: 'var(--bg-card)', borderRadius: '16px', minHeight: '480px' }} />
          )}
        </div>
      </section>

      {/* ── DIAGNÓSTICO REAL ───────────────────────────────────────── */}
      <section className="diagnostico">
        <div className="diagnostico-inner reveal">
          <div className="diagnostico-eyebrow">
            <span>El Diagnóstico Real</span>
          </div>
          <h2 className="diagnostico-heading">
            Tu empresa funciona.<br />
            Pero podría funcionar<br />
            <em>mucho mejor.</em>
          </h2>
          <p className="diagnostico-body">
            Hay algo en los procesos que no fluye. Datos que existen pero nadie usa. Equipos que trabajan en paralelo sin saberlo. No es una crisis — es ruido acumulado. Y el ruido cuesta.
          </p>
          <ul className="diagnostico-list">
            <li>Tomás decisiones con información incompleta o que llega tarde.</li>
            <li>Tus operaciones dependen de personas, no de sistemas.</li>
            <li>Creces en ventas pero el margen no acompaña el crecimiento.</li>
            <li>Cada área trabaja en su propio idioma. Nadie habla el mismo.</li>
            <li>Tenés tecnología, pero no la estás aprovechando realmente.</li>
            <li>Sabés que hay valor invisible en tu empresa. No sabés dónde está.</li>
          </ul>
        </div>
      </section>

      {/* ── 4 MIRADAS METHODOLOGY ──────────────────────────────────── */}
      <section id="metodologia" className="methodology">
        <div className="methodology-inner reveal">
          <h2 className="methodology-title">{metodologiaTitle}</h2>
          <div className="methodology-grid">
            {MIRADAS_4.map(m => (
              <div key={m.label} className="mirada-item">
                <h3 className="mirada-name" style={{ color: m.color }}>{m.label}</h3>
                <p className="mirada-desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────── */}
      <section id="sobre-mi" className="about">
        <div className="about-inner">
          <div className="about-image reveal">
            {aboutAsset?.file_url ? (
              <img src={aboutAsset.file_url} alt="Natalia Sánchez Rojas" />
            ) : (
              <div style={{ width: '100%', height: '480px', background: 'var(--bg-card)', borderRadius: '16px' }} />
            )}
          </div>
          <div className="about-body reveal" style={{ transitionDelay: '0.15s' }}>
            <span className="section-label">Sobre mí</span>
            <h2 className="section-title">
              {ceoProfile?.name || 'Natalia Sánchez Rojas'}
            </h2>
            <p>{aboutText}</p>
            {aboutTagline && <p style={{ marginTop: '1rem' }}>{aboutTagline}</p>}
          </div>
        </div>
      </section>

      {/* ── CONSULTORÍA ─────────────────────────────────────────────── */}
      {consultoriaServices.length > 0 && (
        <section id="servicios" className="services-section">
          <div className="services-inner">
            <div className="services-header reveal">
              <span className="section-label">Consultoría</span>
              <h2 className="section-title">{serviciosTitulo}</h2>
            </div>
            <div className="cards-grid reveal" style={{ transitionDelay: '0.1s' }}>
              {consultoriaServices.map((svc, si) => (
                <div key={si} className="service-card">
                  <h3 className="service-card-name">{svc.name}</h3>
                  {svc.tagline && <p className="service-card-tagline">{svc.tagline}</p>}
                  {svc.description && (
                    <p className="service-card-desc">
                      {svc.description.length > 220 ? svc.description.slice(0, 220) + '…' : svc.description}
                    </p>
                  )}
                  <a href={calendlyUrl} className="btn-primary service-card-cta" target="_blank" rel="noopener">
                    Más información
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MESA DE LÍDERES — cinematic split ───────────────────────── */}
      {mesaService && (
        <section className="mesa-section">
          <div
            className="mesa-photo"
            style={mesaPhoto?.file_url ? { backgroundImage: `url(${mesaPhoto.file_url})` } : {}}
          />
          <div className="mesa-content reveal">
            <span className="section-label">Experiencias</span>
            <h2 className="mesa-headline">{mesaHeadline}</h2>
            <h3 className="mesa-name">{mesaService.name}</h3>
            {mesaService.tagline && (
              <p className="mesa-tagline">{mesaService.tagline}</p>
            )}
            {mesaService.description && (
              <p className="mesa-desc">{mesaService.description}</p>
            )}
            <a href={calendlyUrl} className="btn-primary" target="_blank" rel="noopener">
              Únete a la Mesa
            </a>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ─────────────────────────────────────────────── */}
      <section className="newsletter">
        <div className="newsletter-box reveal">
          <h2 className="newsletter-title">{newsletterTitulo ?? <>Despeja el ruido.<br />Recibe una mirada distinta.</>}</h2>
          <p className="newsletter-body">
            {newsletterBodyText ?? <>Cada martes, en mi newsletter <strong>Bitácora 4 MIRADAS</strong>, comparto reflexiones sobre liderazgo, estrategia, tecnología y cultura organizacional. No son parches, son perspectivas profundas para entender tu empresa desde sus raíces y decidir con claridad. Esta es una mirada que te regalo, directo a tu bandeja de entrada.</>}
          </p>
          <a href={newsletterUrl} className="btn-newsletter" target="_blank" rel="noopener">
            Suscríbete a la Bitácora 4 MIRADAS
          </a>
        </div>
      </section>

      {/* ── APLICACIONES ────────────────────────────────────────────── */}
      {aplicacionesServices.length > 0 && (
        <section className="services-section" style={{ paddingTop: '5rem' }}>
          <div className="services-inner">
            <div className="services-header reveal">
              <span className="section-label">Aplicaciones</span>
              <h2 className="section-title">{aplicacionesTitulo}</h2>
            </div>
            <div className="cards-grid reveal" style={{ transitionDelay: '0.1s' }}>
              {aplicacionesServices.map((svc, si) => (
                <div key={si} className="service-card">
                  <h3 className="service-card-name">{svc.name}</h3>
                  {svc.tagline && <p className="service-card-tagline">{svc.tagline}</p>}
                  {svc.description && (
                    <p className="service-card-desc">
                      {svc.description.length > 220 ? svc.description.slice(0, 220) + '…' : svc.description}
                    </p>
                  )}
                  <a href="https://cuatromiradas.soynatsr.com" className="btn-primary service-card-cta" target="_blank" rel="noopener">
                    Acceder
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT ────────────────────────────────────────────────── */}
      <section id="contacto" className="contact">
        <div className="contact-inner reveal">
          <span className="section-label">Trabajemos juntos</span>
          <h2 className="section-title">{contactoTitulo}</h2>
          <p className="section-subtitle">{contactoSub}</p>
          <div className="contact-actions">
            <a href={calendlyUrl} className="btn-primary" target="_blank" rel="noopener">
              Agendar llamada estratégica
            </a>
            <a href="https://cuatromiradas.soynatsr.com" className="btn-secondary" target="_blank" rel="noopener">
              Acceder a 4 MIRADAS
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <a href="/" className="footer-logo">
            {logoUrl
              ? <img src={logoUrl} alt="Soy Nat SR" className="footer-logo-img" />
              : <>Soy Nat <span>SR</span></>
            }
          </a>
          <ul className="footer-links">
            <li><a href="#metodologia">Metodología</a></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#sobre-mi">Sobre mí</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li><a href="https://www.linkedin.com/in/nataliasanchezrojas" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="https://www.instagram.com/soynatsr" target="_blank" rel="noopener">Instagram</a></li>
          </ul>
          <p className="footer-copy">© {new Date().getFullYear()} Soy Nat SR. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ── Scroll reveal script ─────────────────────────────────── */}
      <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
    </>
  );
}
