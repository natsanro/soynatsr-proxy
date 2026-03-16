const BASE_URL = 'https://soynatsr.com';

export default function sitemap() {
  const pages = [
    { url: '/',          priority: 1.0, changeFrequency: 'weekly' },
    { url: '/metodo',    priority: 0.9, changeFrequency: 'monthly' },
    { url: '/servicios', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/sobre',     priority: 0.8, changeFrequency: 'monthly' },
    { url: '/blog',      priority: 0.7, changeFrequency: 'weekly'  },
    { url: '/contacto',  priority: 0.6, changeFrequency: 'yearly'  },
  ];

  return pages.map(p => ({
    url: `${BASE_URL}${p.url}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
