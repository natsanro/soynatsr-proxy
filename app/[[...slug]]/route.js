import { getExperience } from '../../lib/base44.js';
import { notFoundHTML, errorHTML } from '../../lib/html.js';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const slugArr = (await params).slug;
  const slug = slugArr && slugArr.length > 0 ? slugArr[0] : null;

  // Skip internal paths
  if (slug === 'api' || slug === '_next' || slug === 'favicon.ico') {
    return new Response('Not found', { status: 404 });
  }

  try {
    let experiences;

    if (!slug) {
      // Root "/" → look for published website
      experiences = await getExperience({ status: 'published', experience_type: 'website' });
    } else {
      // "/natalia-sanchez-rojas" → look for landing with that slug
      experiences = await getExperience({ status: 'published', slug });
    }

    const exp = experiences?.[0];

    if (!exp) {
      return new Response(notFoundHTML(), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const html = exp.final_html || exp.generated_html || exp.html_content;

    if (!html) {
      return new Response(notFoundHTML(), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('Proxy error:', err.message);
    return new Response(errorHTML(), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
