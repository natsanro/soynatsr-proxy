const BASE44_API = 'https://app.base44.com';
const APP_ID = process.env.BASE44_APP_ID;
const API_KEY = process.env.BASE44_API_KEY;

function headers() {
  if (!APP_ID || !API_KEY) throw new Error('BASE44_APP_ID and BASE44_API_KEY env vars are required');
  return { 'api_key': API_KEY, 'Content-Type': 'application/json' };
}

/** Generic entity fetcher */
export async function getEntities(entityName, filter = {}) {
  const qs = Object.keys(filter).length ? '?' + new URLSearchParams(filter).toString() : '';
  const url = `${BASE44_API}/api/apps/${APP_ID}/entities/${entityName}${qs}`;
  try {
    const res = await fetch(url, { headers: headers(), cache: 'no-store' });
    if (!res.ok) { console.error(`Base44 ${entityName} error: ${res.status}`); return []; }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results ?? data.items ?? []);
  } catch (e) {
    console.error(`Base44 fetch error (${entityName}):`, e.message);
    return [];
  }
}

/** Backwards compat — used by [[...slug]]/route.js */
export async function getExperience(filter) {
  return getEntities('Experience', filter);
}

export async function getServices() {
  return getEntities('Service', { status: 'activo' });
}

export async function getBrandAssets(filter = {}) {
  return getEntities('BrandAsset', filter);
}

export async function getBrandCore() {
  const r = await getEntities('BrandCore');
  return r[0] ?? null;
}

export async function getCEOProfile() {
  const r = await getEntities('CEOProfile');
  return r[0] ?? null;
}
