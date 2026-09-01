/* Cloudflare Pages Function: POST /api/inquiry
   Stores the intake as a Sanity `inquiry` document (the "Inquiries" inbox in Studio)
   and redirects back to the form with a thank-you state. No JavaScript is required
   on the page; the form is a plain <form method="post">.

   Environment (Cloudflare Pages → Settings → Variables and Secrets):
     PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN (secret) */

interface Env {
  PUBLIC_SANITY_PROJECT_ID: string;
  PUBLIC_SANITY_DATASET?: string;
  SANITY_WRITE_TOKEN: string;
}

const FIELDS: Record<string, number> = {
  name: 120, email: 200, phone: 40, city: 120, service: 40,
  projectType: 80, budget: 40, scope: 300, experience: 80, goals: 300,
  timeline: 60, source: 60, message: 4000,
};
const SERVICES = new Set(['Interior design', 'Personal styling', 'Both']);

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const back = (state: 'sent' | 'error') => Response.redirect(`${url.origin}/inquire/?inquiry=${state}`, 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back('error');
  }

  // Honeypot: real people never see or fill this field.
  if (clean(form.get('company'), 10)) return back('sent');

  const doc: Record<string, string> = { _type: 'inquiry', receivedAt: new Date().toISOString() };
  for (const [name, max] of Object.entries(FIELDS)) {
    const v = clean(form.get(name), max);
    if (v) doc[name] = v;
  }
  if (!doc.name || !doc.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(doc.email) || !doc.message) return back('error');
  if (!SERVICES.has(doc.service)) doc.service = 'Both';
  // Keep only the details that belong to the chosen service line.
  if (doc.service === 'Personal styling') { delete doc.projectType; delete doc.budget; delete doc.scope; }
  if (doc.service === 'Interior design') { delete doc.experience; delete doc.goals; }

  const dataset = env.PUBLIC_SANITY_DATASET || 'production';
  const endpoint = `https://${env.PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2026-08-31/data/mutate/${dataset}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${env.SANITY_WRITE_TOKEN}` },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
  });
  if (!res.ok) {
    console.error('Sanity mutate failed', res.status, await res.text());
    return back('error');
  }
  return back('sent');
};

export const onRequestGet: PagesFunction = async () => new Response('Method not allowed', { status: 405 });
