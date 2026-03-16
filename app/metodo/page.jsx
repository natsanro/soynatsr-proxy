import Image from 'next/image';
import { getBrandAssets, getBrandCore } from '../../lib/base44.js';
import Nav from '../components/Nav.js';
import Cursor from '../components/Cursor.js';

const REVEAL = `(function(){var els=document.querySelectorAll('.reveal');if(!els.length)return;var io=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible')},i*90);io.unobserve(e.target);}});},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){io.observe(el);});})();`;

export const metadata = {
  title: 'Metodología 4 Miradas™ — Natalia Sánchez Rojas',
  description: 'Un sistema de diagnóstico y transformación desde cuatro perspectivas simultáneas: Estratégica, Funcional, Data y Organizacional.',
  openGraph: { title: 'Metodología 4 Miradas™', url: 'https://soynatsr.com/metodo' },
  twitter: { card: 'summary_large_image' },
};

export default async function MetodoPage() {
  const [assets, brandCore] = await Promise.all([getBrandAssets(), getBrandCore()]);
  const isLogoType = (t) => t && ['logo','logos'].includes(t.toLowerCase());
  const logoAsset = assets.find(a => isLogoType(a.asset_type) && /negro|dark|blanca|white/i.test(`${a.title??''} ${a.notes??''}`)) || assets.find(a => isLogoType(a.asset_type));
  const logoUrl = logoAsset?.file_url ?? null;
  const calendlyUrl = brandCore.sections?.contacto?.calendly ?? 'https://calendly.com/natsr';

  return (
    <>
      <Cursor />
      <Nav logoUrl={logoUrl} />
      <section className="metodo-hero">
        <div className="label">La metodología</div>
        <div className="metodo-hero-inner">
          <h1>4 Miradas<em>™</em></h1>
          <div className="metodo-hero-body">
            <p>Un sistema de diagnóstico y transformación que aborda tu empresa desde cuatro perspectivas simultáneas. No es consultoría convencional — es la capacidad de ver lo que tú, desde adentro, no puedes ver.</p>
            <p><strong>Cada Mirada tiene su propio ángulo, su propia pregunta y su propio color.</strong> Juntas, forman una imagen completa de lo que está pasando y lo que hay que transformar.</p>
          </div>
        </div>
      </section>

      {[
        {
          color:'violet', num:'01', title:'Estratégica', question:'¿Qué necesita transformarse?',
          body:[
            'Toda empresa es el reflejo de la consciencia de su líder. Antes de cambiar procesos o estructuras, necesitamos entender <strong>desde dónde estás mirando.</strong>',
            'La Mirada Estratégica diagnostica tu modelo de negocio, tus supuestos no cuestionados, la coherencia entre lo que dices que eres y lo que opera realmente.',
            'Aquí es donde aparece la brecha más costosa: la distancia entre la visión y la realidad diaria de tu equipo.',
          ],
          pills:['Visión y dirección','Modelo de negocio','Consciencia del líder','Brechas estratégicas','Supuestos ocultos'],
          visual:[
            {title:'¿Para quién es?', text:'Fundadores y CEOs que sienten que la empresa creció pero la estrategia no evolucionó con ella.'},
            {title:'¿Qué se diagnostica?', text:'Alineación entre visión, cultura y operación. Dónde hay coherencia y dónde hay ruido estratégico que cuesta.'},
            {title:'¿Qué se entrega?', text:'Un mapa claro de dónde estás, a dónde puedes ir y cuáles son los tres movimientos estratégicos de mayor impacto.'},
          ],
        },
        {
          color:'yellow', num:'02', title:'Funcional', question:'¿Cómo opera el sistema?',
          body:[
            'Los procesos que funcionan por costumbre rara vez son los que funcionan mejor. La Mirada Funcional <strong>mapea cómo fluye el trabajo realmente</strong> — no como está documentado, sino como ocurre.',
            'Identificamos cuellos de botella invisibles, roles que se superponen, decisiones que se repiten innecesariamente y estructuras que frenan la velocidad de ejecución.',
            'El resultado: operaciones que escalan, no que dependen de personas específicas para no caer.',
          ],
          pills:['Procesos y flujos','Roles y responsabilidades','Cuellos de botella','Eficiencia operacional','Escalabilidad'],
          visual:[
            {title:'¿Para quién es?', text:'Empresas que crecen en ventas pero sienten que la operación no acompaña ese crecimiento sin caos.'},
            {title:'¿Qué se diagnostica?', text:'El mapa real de cómo opera tu empresa: dónde se pierde tiempo, dónde depende de individuos, dónde hay fricción que se naturalizó.'},
            {title:'¿Qué se entrega?', text:'Rediseño de los procesos clave con priorización de impacto — lo que hay que cambiar ahora vs. lo que puede esperar.'},
          ],
        },
        {
          color:'cyan', num:'03', title:'Data', question:'¿Qué se está midiendo?',
          body:[
            'La mayoría de empresas tienen más datos de los que usan, y menos de los que necesitan. <strong>La información existe — el problema es que no está conectada a las decisiones.</strong>',
            'La Mirada Data audita qué métricas existen, cuáles importan, cuáles son ruido y qué brechas de información están generando decisiones con información incompleta.',
            'Convertimos datos en inteligencia operativa que llega a tiempo y a quien la necesita.',
          ],
          pills:['Métricas clave','Tecnología y sistemas','Gaps de información','Dashboards operativos','Decisiones basadas en datos'],
          visual:[
            {title:'¿Para quién es?', text:'Empresas que tienen tecnología pero no la están aprovechando, o que toman decisiones "de intuición" porque los datos no llegan a tiempo.'},
            {title:'¿Qué se diagnostica?', text:'El ecosistema de datos actual: qué se mide, qué falta, qué sobra y dónde hay oportunidades de decisión que hoy se están perdiendo.'},
            {title:'¿Qué se entrega?', text:'Un modelo de indicadores accionables + hoja de ruta de implementación para que los datos soporten las decisiones estratégicas.'},
          ],
        },
        {
          color:'fuchsia', num:'04', title:'Organizacional', question:'¿Qué opera debajo de lo visible?',
          body:[
            'Debajo de cada organigrama hay una cultura real — patrones de comportamiento, creencias tácitas, dinámicas de poder y formas de relacionarse que <strong>nadie puso en ningún manual pero que gobiernan todo.</strong>',
            'La Mirada Organizacional hace visible lo que opera en el inconsciente colectivo de tu empresa: por qué ciertos cambios no pegan, por qué el talento se va, por qué la energía del equipo no acompaña la visión del líder.',
          ],
          pills:['Cultura organizacional','Patrones invisibles','Energía del equipo','Liderazgo consciente','Cambio sostenible'],
          visual:[
            {title:'¿Para quién es?', text:'Líderes que implementan cambios pero estos no duran, o que sienten que la cultura de la empresa no responde a lo que quieren construir.'},
            {title:'¿Qué se diagnostica?', text:'La cultura real vs. la cultura declarada. Los patrones que se repiten y frenan el cambio.'},
            {title:'¿Qué se entrega?', text:'Un diagnóstico cultural profundo + palancas de intervención concretas para generar cambio que dure más allá del proyecto.'},
          ],
        },
      ].map(m => (
        <section key={m.color} className="mirada-full reveal" data-color={m.color}>
          <div className="mirada-full-left">
            <div className="label">{m.num}</div>
            <div className="mirada-full-number">Mirada</div>
            <h2 className="mirada-full-title">{m.title}</h2>
            <p className="mirada-full-question">{m.question}</p>
            <div className="mirada-full-body">
              {m.body.map((p, i) => <p key={i} dangerouslySetInnerHTML={{__html: p}} />)}
            </div>
            <div className="mirada-full-pills">
              {m.pills.map((p, i) => <span key={i} className="pill">{p}</span>)}
            </div>
          </div>
          <div className="mirada-full-visual">
            {m.visual.map((v, i) => (
              <div key={i} className="visual-item">
                <p className="visual-item-title">{v.title}</p>
                <p className="visual-item-text">{v.text}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="center-section reveal">
        <div className="label">¿Por dónde empezamos?</div>
        <h2>La primera mirada<br /><em>es sin costo.</em></h2>
        <p>En 60 minutos entendemos dónde estás y cuál es el acompañamiento que tiene más sentido para tu momento actual.</p>
        <a href={calendlyUrl} className="btn-primary" target="_blank" rel="noopener">Agendar mi sesión de diagnóstico</a>
      </section>

      <footer>
        <div className="footer-brand">{logoUrl ? <Image src={logoUrl} alt="Soy Nat SR" width={120} height={36} style={{objectFit:'contain'}} /> : <>NAT<span>.</span></>}</div>
        <ul className="footer-links">
          <li><a href="/">Inicio</a></li><li><a href="/servicios">Servicios</a></li><li><a href="/contacto">Contacto</a></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} Natalia Sánchez Rojas</p>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: REVEAL }} />
    </>
  );
}
