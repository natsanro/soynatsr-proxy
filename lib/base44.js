const BASE44_API = 'https://app.base44.com';
const APP_ID = process.env.BASE44_APP_ID;
const API_KEY = process.env.BASE44_API_KEY;

/**
 * Fetch a published Experience from Base44 using server-side API key.
 * Base44 app stays PRIVATE — this proxy is the only public-facing layer.
 */
export async function getExperience(filter) {
  if (!APP_ID || !API_KEY) {
    throw new Error('BASE44_APP_ID and BASE44_API_KEY env vars are required');
  }

  // Build query string from filter object
  const params = new URLSearchParams(filter).toString();
  const url = `${BASE44_API}/api/apps/${APP_ID}/entities/Experience?${params}`;

  const response = await fetch(url, {
    headers: {
      'api_key': API_KEY,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Base44 API error: ${response.status}`);
  }

  const data = await response.json();
  // data might be an array or { results: [...] }
  const results = Array.isArray(data) ? data : (data.results ?? data.items ?? []);
  return results;
}
