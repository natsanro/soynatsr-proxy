const BASE44_API = 'https://app.base44.com';
const APP_ID = process.env.BASE44_APP_ID;
const API_KEY = process.env.BASE44_API_KEY;

function headers() {
  if (!APP_ID || !API_KEY) throw new Error('BASE44_APP_ID and BASE44_API_KEY env vars are required');
  return { 'api_key': API_KEY, 'Content-Type': 'application/json' };
}

// Brand/config data: cache 5 min. Services: 2 min. Experiences (slug pages): no cache.
const REVALIDATE = {
  BrandCore:  300,
  BrandAsset: 300,
  CEOProfile: 300,
  Service:    120,
  Experience:   0,
};

/** Generic entity fetcher */
export async function getEntities(entityName, filter = {}) {
  const qs = Object.keys(filter).length ? '?' + new URLSearchParams(filter).toString() : '';
  const url = `${BASE44_API}/api/apps/${APP_ID}/entities/${entityName}${qs}`;
  const ttl = REVALIDATE[entityName] ?? 120;
  const fetchOpts = ttl === 0
    ? { headers: headers(), cache: 'no-store' }
    : { headers: headers(), next: { revalidate: ttl } };
  try {
    const res = await fetch(url, fetchOpts);
    if (!res.ok) { console.error(`Base44 ${entityName} error: ${res.status}`); return []; }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results ?? data.items ?? []);
  } catch (e) {
    console.error(`Base44 fetch error (${entityName}):`, e.message);
    return [];
  }
}

/** Backwards compat — used by [...slug]/route.js */
export async function getExperience(filter) {
  return getEntities('Experience', filter);
}

export async function getServices() {
  return getEntities('Service', { status: 'activo' });
}

export async function getBrandAssets(filter = {}) {
  return getEntities('BrandAsset', filter);
}

/**
 * Returns all BrandCore records and a parsed sections map.
 * sections['colores']['color_principal'] === '#F7EA00'
 */
export async function getBrandCore() {
  const records = await getEntities('BrandCore');
  const sections = {};
  for (const r of records) {
    if (!r.section_name) continue;
    if (!sections[r.section_name]) sections[r.section_name] = {};
    sections[r.section_name][r.field_name] = r.field_value;
  }
  return { records, sections };
}

export async function getCEOProfile() {
  const r = await getEntities('CEOProfile');
  return r[0] ?? null;
}
