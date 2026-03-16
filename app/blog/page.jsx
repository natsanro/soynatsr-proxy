import Image from 'next/image';
import Link from 'next/link';
import { getBrandCore } from '../../lib/base44.js';

export const revalidate = 3600;

const REVEAL = `(function(){var els=document.querySelectorAll('.reveal');if(!els.length)return;var io=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible')},i*90);io.unobserve(e.target);}});},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){io.observe(el);});})();`;

export const metadata = {
  title: 'Bitácora Estratégica — Natalia Sánchez Rojas',
  description: 'Reflexiones sobre estrategia, liderazgo consciente y las 4 Miradas™ aplicadas al mundo real.',
  openGraph: { title: 'Bitácora Estratégica', url: 'https://soynatsr.com/blog' },
  twitter: { card: 'summary_large_image' },
};

const POSTS_FEATURED = [
  { date:'Mar 11, 2026', mirada:'vi', miradaLabel:'Estratégica', title:'Tu empresa no tiene un problema de estrategia. Tiene un problema de consciencia.', body:'Cada vez que una empresa me llama porque "la estrategia no está funcionando", lo primero que busco no está en los números ni en los procesos. Está en las conversaciones que el líder evita tener.' },
  { date:'Mar 4, 2026', mirada:'fu', miradaLabel:'Organizacional', title:'La cultura que no diseñas se instala sola — y rara vez te gusta.', body:'El problema con la cultura organizacional no es que sea difícil de cambiar. Es que la mayoría de líderes no se dan cuenta de que ya la están diseñando, con cada decisión que toman y cada comportamiento que toleran.' },
];

const POSTS_GRID = [
  { date:'Feb 25, 2026', mirada:'cy', miradaLabel:'Data',           title:'Los 5 datos que toda empresa debería medir y casi ninguna mide bien.',                              body:'No son los KPIs del dashboard. Son los indicadores de fricción interna que predicen los problemas antes de que exploten.' },
  { date:'Feb 18, 2026', mirada:'ye', miradaLabel:'Funcional',      title:'Cuando escalar sin orden se convierte en el mayor riesgo de tu empresa.',                         body:'El crecimiento no ordenado no es un problema de éxito — es una trampa. Y la mayoría de fundadores la ven cuando ya están adentro.' },
  { date:'Feb 11, 2026', mirada:'vi', miradaLabel:'Estratégica',    title:'La brecha entre lo que el líder cree que pasa y lo que realmente ocurre.',                        body:'Hay un diagnóstico que hago en cada empresa y siempre genera incomodidad. No porque sea difícil de escuchar — sino porque ya lo sabían.' },
  { date:'Feb 4, 2026',  mirada:'fu', miradaLabel:'Organizacional', title:'¿Por qué el talento se va? (Y no tiene nada que ver con el salario.)',                            body:'Cuando alguien renuncia, la empresa pierde más que una persona. Pierde el conocimiento acumulado, la red de relaciones y el tiempo invertido en su formación.' },
  { date:'Ene 28, 2026', mirada:'cy', miradaLabel:'Data',           title:'IA en las PyMEs latinoamericanas: oportunidad real o distracción costosa.',                       body:'Todos hablan de inteligencia artificial. Pocos hablan de lo que pasa cuando la implementas en una empresa que todavía opera con planillas de Excel.' },
  { date:'Ene 21, 2026', mirada:'vi', miradaLabel:'Estratégica',    title:'Lo que Davos no te dijo sobre el futuro de los negocios en LATAM.',                               body:'Las tendencias globales que se discuten en los foros de élite llevan 18 meses de retraso antes de impactar el ecosistema latinoamericano.' },
];

export default async function BlogPage() {
  const brandCore = await getBrandCore();
  const newsletterUrl = brandCore.sections?.contacto?.newsletter ?? brandCore.sections?.redes_sociales?.newsletter ?? 'https://www.linkedin.com/newsletters/';

  return (
    <>
      <section className="blog-hero">
        <div className="label">Pensamiento estratégico</div>
        <h1>Bitácora<br /><em>Estratégica</em></h1>
        <p>Ideas, reflexiones y análisis sobre liderazgo, transformación y lo que realmente mueve a las empresas. Publicado los martes.</p>
      </section>

      <div className="blog-featured">
        {POSTS_FEATURED.map((p, i) => (
          <div key={i} className="blog-featured-card reveal">
            <div className="blog-card-meta">
              <span className="blog-card-date">{p.date}</span>
              <span className={`blog-card-mirada mirada-${p.mirada}`}>{p.miradaLabel}</span>
            </div>
            <h2>{p.title}</h2>
            <p>{p.body}</p>
          </div>
        ))}
      </div>

      <div className="blog-grid reveal">
        {POSTS_GRID.map((p, i) => (
          <div key={i} className="blog-grid-card">
            <div className="blog-card-meta">
              <span className="blog-card-date">{p.date}</span>
              <span className={`blog-card-mirada mirada-${p.mirada}`}>{p.miradaLabel}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>

      <section style={{padding:'5rem 4rem',borderTop:'1px solid var(--gray-700)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'3rem'}} className="reveal">
        <div>
          <h2 style={{fontFamily:'var(--font-playfair),serif',fontSize:'clamp(1.5rem,2.5vw,2.2rem)',fontWeight:'700',marginBottom:'0.8rem'}}>Recibe la Bitácora cada martes.</h2>
          <p style={{color:'var(--gray-300)',fontSize:'0.88rem'}}>Ideas estratégicas sin ruido. Directo a tu correo.</p>
        </div>
        <div style={{display:'flex',gap:'0',maxWidth:'400px',width:'100%'}}>
          <input type="email" placeholder="tu@email.com" style={{flex:'1',background:'var(--gray-900)',border:'1px solid var(--gray-700)',borderRight:'none',color:'var(--white)',padding:'1rem 1.2rem',fontFamily:'var(--font-syne),sans-serif',fontSize:'0.88rem',outline:'none'}} />
          <a href={newsletterUrl} className="btn-primary" target="_blank" rel="noopener" style={{whiteSpace:'nowrap'}}>Suscribirse</a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">{logoUrl ? <Image src={logoUrl} alt="Soy Nat SR" width={120} height={36} style={{objectFit:'contain'}} /> : <>NAT<span>.</span></>}</div>
        <ul className="footer-links">
          <li><Link href="/">Inicio</Link></li><li><Link href="/metodo">4 Miradas™</Link></li><li><Link href="/contacto">Contacto</Link></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} Natalia Sánchez Rojas</p>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: REVEAL }} />
    </>
  );
}
