import { getServices, getBrandAssets, getBrandCore, getCEOProfile } from '../lib/base44.js';

// ─── Service category mapping ───────────────────────────────────────────────
const CATEGORY_MAP = {
  consultoria: {
    label: 'Consultoría',
    names: ['Arquitectura Viva', 'Te regalo una mirada', 'Performance Tech'],
  },
  experiencias: {
    label: 'Experiencias',
    names: ['Mesa de Líderes'],
  },
  aplicaciones: {
    label: 'Aplicaciones',
    names: ['4 MIRADAS', 'Miradas'],
  },
};

function categorizeServices(services) {
  const result = [];
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    const cards = cat.names.map(name => {
      const found = services.find(s => s.name?.toLowerCase().includes(name.toLowerCase()));
      return found ?? { name, tagline: '', description: '' };
    });
    result.push({ key, label: cat.label, services: cards });
  }
  return result;
}

// ─── Build CSS variables from BrandCore colors section ──────────────────────
// Smart: detects actual color values (hex/rgb) regardless of field_name
function buildCssVars(sections) {
  const colorSection = sections?.colores ?? {};
  const typogSection = sections?.tipografias ?? {};

  const isColor = (v) => v && (/^#([0-9A-Fa-f]{3,8})$/.test(v.trim()) || /^rgb/i.test(v.trim()));

  // Keyword hints for semantic matching (order matters: first match wins)
  const semanticSlots = [
    { cssVar: '--accent',          keywords: ['principal', 'primario', 'acento', 'main', 'primary', 'marca', 'brand'] },
    { cssVar: '--accent-alt',      keywords: ['secundario', 'second', 'complemento', 'alt', 'highlight'] },
    { cssVar: '--bg',              keywords: ['fondo', 'background', 'base', 'bg', 'oscuro', 'dark'] },
    { cssVar: '--bg-card',         keywords: ['tarjeta', 'card', 'superficie', 'surface', 'panel'] },
    { cssVar: '--text',            keywords: ['texto', 'text', 'tipografia', 'fuente', 'blanco', 'white', 'claro'] },
    { cssVar: '--text-secondary',  keywords: ['secundario_texto', 'texto_sec', 'muted', 'gris', 'gray', 'grey'] },
  ];

  const assignments = {};
  const usedKeys = new Set();

  // First pass: semantic matching
  for (const { cssVar, keywords } of semanticSlots) {
    for (const [fieldName, fieldValue] of Object.entries(colorSection)) {
      if (usedKeys.has(fieldName) || !isColor(fieldValue)) continue;
      if (keywords.some(kw => fieldName.toLowerCase().includes(kw))) {
        assignments[cssVar] = fieldValue.trim();
        usedKeys.add(fieldName);
        break;
      }
    }
  }

  // Second pass: remaining color values fill unassigned slots in order
  const remainingColors = Object.entries(colorSection)
    .filter(([k, v]) => !usedKeys.has(k) && isColor(v))
    .map(([, v]) => v.trim());
  const unfilledSlots = semanticSlots.map(s => s.cssVar).filter(v => !assignments[v]);
  remainingColors.forEach((color, i) => {
    if (unfilledSlots[i]) assignments[unfilledSlots[i]] = color;
  });

  // Typography: find any font name in tipografias section
  const fontEntry = Object.entries(typogSection)
    .find(([k]) => ['principal', 'fuente', 'font', 'titulo', 'body'].some(kw => k.toLowerCase().includes(kw)));
  const fontFamily = fontEntry?.[1] ?? null;

  const lines = [];
  for (const [varName, value] of Object.entries(assignments)) {
    if (value) lines.push(`  ${varName}: ${value};`);
  }
  if (fontFamily && !isColor(fontFamily)) {
    lines.push(`  --font: '${fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif;`);
  }

  return lines.length ? `:root {\n${lines.join('\n')}\n}` : '';
}

// ─── Extract best text from a BrandCore section ─────────────────────────────
// Returns the longest/most relevant field value, ignoring very short entries
function pickText(sectionObj, minLen = 30) {
  if (!sectionObj) return null;
  const entries = Object.values(sectionObj).filter(v => typeof v === 'string' && v.length >= minLen);
  if (!entries.length) return null;
  return entries.reduce((a, b) => (b.length > a.length ? b : a));
}

// ─── Pillar icons ────────────────────────────────────────────────────────────
const PILLARS = [
  { icon: '◈', label: 'Liderazgo' },
  { icon: '⬡', label: 'Estructura' },
  { icon: '◎', label: 'Operación' },
  { icon: '⟁', label: 'Tecnología' },
  { icon: '∿', label: 'Datos' },
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

  // Dynamic CSS vars injected from BrandCore
  const cssVars = buildCssVars(sections);

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

  // Logo — BrandAsset with type 'logo', fallback to BrandCore elementos_graficos
  const logoAsset = assets.find(a => a.asset_type === 'logo');
  const logoUrl   = logoAsset?.file_url ?? sections?.elementos_graficos?.logo_url ?? null;

  const categorized = categorizeServices(services);

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

  // About copy — CEOProfile bio is the best source, then BrandCore
  const aboutText =
    ceoProfile?.bio             ??
    narrative.sobre_mi          ??
    identity.descripcion        ??
    sections?.historia?.resumen ??
    pickText(sections?.historia, 80) ??
    pickText(identity, 80)      ??
    'Soy estratega, diseño sistemas claros para líderes que quieren ordenar su realidad y construir estructuras que funcionen de verdad. Integro liderazgo, operación, tecnología y datos desde la metodología 4 MIRADAS.';

  const aboutTagline =
    ceoProfile?.tagline         ??
    narrative.tagline           ??
    identity.tagline            ??
    sections?.promesa?.tagline  ??
    null;

  // Contact
  const calendlyUrl = contactBC.calendly ?? contactBC.agenda_url ?? 'https://calendly.com/natsr';

  return (
    <>
      {/* ── Dynamic brand colors from BrandCore ─────────────────── */}
      {cssVars && <style dangerouslySetInnerHTML={{ __html: cssVars }} />}

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          {logoUrl
            ? <img src={logoUrl} alt="Soy Nat SR" className="nav-logo-img" />
            : <>Soy Nat <span>SR</span></>
          }
        </a>
        <ul className="nav-links">
          <li><a href="#consultoria">Consultoría</a></li>
          <li><a href="#experiencias">Experiencias</a></li>
          <li><a href="#aplicaciones">Aplicaciones</a></li>
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

      {/* ── PILLARS ────────────────────────────────────────────────── */}
      <div className="pillars reveal">
        <div className="pillars-inner">
          <span className="pillars-text">Mi trabajo integra</span>
          <div className="pillars-list">
            {PILLARS.map(p => (
              <span key={p.label} className="pillar-tag">
                <span className="pillar-icon">{p.icon}</span>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ───────────────────────────────────────────────── */}
      <section id="servicios" style={{ background: 'var(--bg)' }}>
        <div className="services-inner">
          <div className="services-header reveal">
            <span className="section-label">Portfolio</span>
            <h2 className="section-title">Servicios</h2>
            <p className="section-subtitle">
              Acompaño a líderes y empresas a ordenar su realidad y construir
              sistemas que funcionen con claridad y coherencia.
            </p>
          </div>

          <div className="categories">
            {categorized.map((cat, ci) => (
              <div key={cat.key} id={cat.key} className="reveal" style={{ transitionDelay: `${ci * 0.1}s` }}>
                <p className="category-label">{cat.label}</p>
                <div className="cards-grid">
                  {cat.services.map((svc, si) => (
                    <div key={si} className="service-card">
                      <h3 className="service-card-name">{svc.name}</h3>
                      {svc.tagline && <p className="service-card-tagline">{svc.tagline}</p>}
                      {svc.description && (
                        <p className="service-card-desc">
                          {svc.description.length > 160
                            ? svc.description.slice(0, 160) + '…'
                            : svc.description}
                        </p>
                      )}
                      <a href="#contacto" className="btn-ghost" style={{ marginTop: 'auto' }}>
                        Ver servicio →
                      </a>
                    </div>
                  ))}
                </div>
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

      {/* ── NEWSLETTER ─────────────────────────────────────────────── */}
      <section className="newsletter">
        <div className="newsletter-box reveal">
          <span className="section-label">Newsletter</span>
          <h2 className="section-title">Recibí mi mirada estratégica</h2>
          <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
            Comparto reflexiones sobre liderazgo, decisiones difíciles y cómo construir
            empresas con más claridad.{' '}
            <strong style={{ color: 'var(--text)' }}>No es marketing. Es una forma de pensar.</strong>
          </p>
          <form className="newsletter-form" onSubmit="return false;">
            <input
              type="email"
              className="newsletter-input"
              placeholder="tu@email.com"
              required
            />
            <button type="submit" className="btn-primary">Suscribirme</button>
          </form>
          <p className="newsletter-disclaimer">Sin spam. Podés darte de baja cuando quieras.</p>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────── */}
      <section id="contacto" className="contact">
        <div className="contact-inner reveal">
          <span className="section-label">Trabajemos juntos</span>
          <h2 className="section-title">¿Querés trabajar conmigo?</h2>
          <p className="section-subtitle">
            Si querés ordenar tu realidad, rediseñar tu estructura y construir un
            sistema más claro para tu empresa, agendá una llamada estratégica.
          </p>
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
            <li><a href="#consultoria">Consultoría</a></li>
            <li><a href="#experiencias">Experiencias</a></li>
            <li><a href="#aplicaciones">Aplicaciones</a></li>
            <li><a href="#sobre-mi">Sobre mí</a></li>
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
