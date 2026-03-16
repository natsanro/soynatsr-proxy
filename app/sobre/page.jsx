import Image from 'next/image';
import Link from 'next/link';
import { getBrandAssets, getBrandCore, getCEOProfile } from '../../lib/base44.js';

const REVEAL = `(function(){var els=document.querySelectorAll('.reveal');if(!els.length)return;var io=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible')},i*90);io.unobserve(e.target);}});},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){io.observe(el);});})();`;

export async function generateMetadata() {
  const assets = await getBrandAssets();
  const hero = assets.find(a => a.category === 'natalia' && (a.asset_type === 'photo' || a.asset_type === 'hero')) || assets.find(a => a.category === 'natalia');
  const images = hero?.file_url ? [{ url: hero.file_url, width: 1200, height: 630, alt: 'Natalia Sánchez Rojas' }] : [];
  return {
    title: 'Sobre mí — Natalia Sánchez Rojas',
    openGraph: { title: 'Sobre mí — Natalia Sánchez Rojas', url: 'https://soynatsr.com/sobre', images },
    twitter: { images: images.map(i => i.url) },
  };
}

export default async function SobrePage() {
  const [assets, brandCore, ceoProfile] = await Promise.all([getBrandAssets(), getBrandCore(), getCEOProfile()]);
  const calendlyUrl = brandCore.sections?.contacto?.calendly ?? 'https://calendly.com/natsr';

  const heroAsset = assets.find(a => a.category === 'natalia' && (a.asset_type === 'photo' || a.asset_type === 'hero')) || assets.find(a => a.category === 'natalia');
  const bio = ceoProfile?.bio ?? brandCore.sections?.historia?.acerca_de_mi ?? null;

  return (
    <>
      <section className="sobre-hero">
        <div className="sobre-hero-left">
          <div className="label">Quién soy</div>
          <h1>Natalia<br />Sánchez<br /><em>Rojas</em></h1>
          <p className="subtitle">Estratega · 4 Miradas™ · La mirada que se formó entre código, directorios y preguntas incómodas</p>
          <p>Las 4 Miradas no las inventé.<br />Se fueron formando mientras intentaba entender <strong>por qué.</strong></p>
          {bio && <p style={{marginTop:'1rem'}}>{bio}</p>}
        </div>
        <div className="sobre-hero-right" style={{position:'relative'}}>
          {heroAsset?.file_url
            ? <Image fill priority src={heroAsset.file_url} alt="Natalia Sánchez Rojas" style={{objectFit:'cover'}} />
            : <div style={{width:'100%',height:'100%',background:'var(--gray-800)'}} />
          }
        </div>
      </section>

      <section className="sobre-stats">
        {[
          {num:'Código',  label:'Empezó escribiendo sistemas'},
          {num:'Banca',   label:'Lideró equipos de desarrollo en fintech'},
          {num:'EMBA',    label:'Universidad de San Andrés · Buenos Aires'},
          {num:'4',       label:'Miradas que lo explican todo'},
        ].map((s, i) => (
          <div key={i} className="stat-item reveal">
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="sobre-story">
        <div className="sobre-story-text reveal">
          <div className="label">Por qué</div>
          <p>Por qué las empresas que tenían la mejor tecnología fracasaban estratégicamente.</p>
          <p>Por qué las que tenían visión clara no lograban ejecutar.</p>
          <p>Por qué las que medían todo <strong>no sabían qué hacer con los datos.</strong></p>
          <p>Por qué las que hablaban de cultura no podían sostener el crecimiento.</p>
          <p style={{marginTop:'2rem'}}>Pasé de escribir código en sistemas a liderar equipos de desarrollo en banca y fintech. De ahí a un Executive MBA buscando entender el otro lado. Y en el medio, muchos procesos internos profundos que me enseñaron que <strong>la consciencia del líder es el techo del sistema.</strong></p>
          <p>Hoy trabajo con CEOs que sienten que algo no cierra en su empresa pero no pueden ver qué.</p>
          <p style={{color:'var(--violet)',fontWeight:'600',marginTop:'1.5rem'}}>Les regalo la mirada que se formó entre líneas de código, salas de directorio y preguntas incómodas.</p>
        </div>
        <div className="reveal">
          <div className="sobre-credo">
            <p className="sobre-credo-title">Esta es mi mirada. Te la regalo.</p>
            <blockquote>"La consciencia del líder es el techo del sistema."</blockquote>
            <div className="sobre-credo-items">
              <span>Las empresas con mejor tecnología pueden fracasar estratégicamente.</span>
              <span>La visión sin ejecución es solo una idea costosa.</span>
              <span>Los datos sin interpretación no deciden nada.</span>
              <span>La cultura que no se diseña se instala sola.</span>
            </div>
          </div>
          <div style={{marginTop:'3rem'}}>
            <div className="label" style={{marginBottom:'1rem'}}>Trayectoria</div>
            {[
              'Ingeniería de sistemas → Desarrollo de software',
              'Liderazgo de equipos tech en banca y fintech',
              'Executive MBA · Universidad de San Andrés · Buenos Aires',
              'Procesos de consciencia y liderazgo profundo',
            ].map((t, i) => <p key={i} className="trayectoria-item">{t}</p>)}
            <p className="trayectoria-item highlight">Creadora de 4 Miradas™</p>
          </div>
        </div>
      </section>

      <section className="center-section reveal">
        <h2>¿Trabajamos juntos?</h2>
        <p>La mejor forma de saber si hay fit es conversar. 60 minutos sin compromiso.</p>
        <a href={calendlyUrl} className="btn-primary" target="_blank" rel="noopener">Agendar una conversación</a>
      </section>

      <footer>
        <div className="footer-brand">{logoUrl ? <Image src={logoUrl} alt="Soy Nat SR" width={120} height={36} style={{objectFit:'contain'}} /> : <>NAT<span>.</span></>}</div>
        <ul className="footer-links">
          <li><Link href="/metodo">4 Miradas™</Link></li><li><Link href="/servicios">Servicios</Link></li><li><Link href="/contacto">Contacto</Link></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} Natalia Sánchez Rojas</p>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: REVEAL }} />
    </>
  );
}
