/* Cloudflare Pages Function: POST /api/inquiry
   Stores the inquiry as a Sanity `inquiry` document (the "Inquiries" inbox in Studio)
   and redirects back to the form with a thank-you state. No JavaScript is required
   on the page; the form is a plain <form method="post">.

   Environment (Cloudflare Pages → Settings → Variables and Secrets):
     PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN (secret) */

interface Env {
  PUBLIC_SANITY_PROJECT_ID: string;
  PUBLIC_SANITY_DATASET?: string;
  SANITY_WRITE_TOKEN: string;
}

const MAX = { name: 120, email: 200, phone: 40, interest: 40, message: 4000 } as const;
const INTERESTS = new Set(['Interior design', 'Personal styling', 'Both']);

const clean = (v: FormDataEntryValue | null, max: number) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const back = (state: 'sent' | 'error') => Response.redirect(`${url.origin}/?inquiry=${state}#inquire`, 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back('error');
  }

  // Honeypot: real people never see or fill this field.
  if (clean(form.get('company'), 10)) return back('sent');

  const doc = {
    _type: 'inquiry',
    name: clean(form.get('name'), MAX.name),
    email: clean(form.get('email'), MAX.email),
    phone: clean(form.get('phone'), MAX.phone),
    interest: clean(form.get('interest'), MAX.interest),
    message: clean(form.get('message'), MAX.message),
    receivedAt: new Date().toISOString(),
  };
  if (!doc.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(doc.email) || !doc.message) return back('error');
  if (!INTERESTS.has(doc.interest)) doc.interest = 'Both';

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
