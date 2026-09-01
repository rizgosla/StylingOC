/* One-time seed: writes the content in ./content.ts into the Sanity dataset.
   Usage:  npm run seed
   Needs PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET and SANITY_WRITE_TOKEN in .env
   (an Editor token from sanity.io/manage → API → Tokens).
   Safe to re-run: documents are createOrReplace'd by fixed _id; images are re-uploaded
   only when the same filename has not been uploaded before. */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { createReadStream, existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import * as c from './content';
import type { BodyNode, Img, Post } from './content';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env');
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: '2026-08-31', useCdn: false });

const uploaded = new Map<string, string>();
async function imageRef(img: Img | null | undefined) {
  if (!img) return undefined;
  const file = join(process.cwd(), 'public', img.src);
  if (!existsSync(file)) throw new Error(`Image not found: ${file}`);
  const name = basename(file);
  if (!uploaded.has(name)) {
    const existing = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && originalFilename == $name][0]._id`, { name });
    if (existing) uploaded.set(name, existing);
    else {
      process.stdout.write(`  uploading ${name} … `);
      const asset = await client.assets.upload('image', createReadStream(file), { filename: name });
      uploaded.set(name, asset._id);
      console.log('done');
    }
  }
  return { _type: 'picture', asset: { _type: 'reference', _ref: uploaded.get(name)! }, alt: img.alt, caption: img.caption };
}

async function body(nodes: BodyNode[]) {
  const out: any[] = [];
  for (const n of nodes) {
    if (n._type === 'imageBlock') out.push({ _type: 'imageBlock', _key: n._key, width: n.width, image: await imageRef(n.image) });
    else if (n._type === 'serviceCallout') out.push({ _type: 'serviceCallout', _key: n._key, package: { _type: 'reference', _ref: n.package._id } });
    else out.push(n);
  }
  return out;
}

async function postDoc(p: Post) {
  return {
    _id: p._id, _type: 'post',
    title: p.title, slug: { _type: 'slug', current: p.slug }, category: p.category, location: p.location,
    publishedAt: p.publishedAt, standfirst: p.standfirst, dek: p.dek, ratio: p.ratio, photoCredit: p.photoCredit,
    draftNote: p.draftNote, leadImage: await imageRef(p.leadImage), body: await body(p.body),
  };
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset}`);
  const tx = client.transaction();

  for (const s of c.servicePackages) tx.createOrReplace({ ...s, _type: 'servicePackage' });
  for (const t of c.testimonials) tx.createOrReplace({ ...t, _type: 'testimonial' });
  for (const p of c.posts) tx.createOrReplace(await postDoc(p));

  const h = c.homePage;
  tx.createOrReplace({
    _id: 'homePage', _type: 'homePage',
    leadStory: { _type: 'reference', _ref: h.leadStory._id },
    latest: h.latest.map((p, i) => ({ _type: 'reference', _ref: p._id, _key: `l${i}` })),
    featuredPost: { _type: 'reference', _ref: h.featuredPost._id },
    interiorsEyebrow: h.interiorsEyebrow, interiorsHeadline: h.interiorsHeadline, interiorsIntro: h.interiorsIntro,
    stylingEyebrow: h.stylingEyebrow, stylingHeadline: h.stylingHeadline, stylingIntro: h.stylingIntro,
    testimonial: { _type: 'reference', _ref: h.testimonial._id },
    studioEyebrow: h.studioEyebrow, studioHeadline: h.studioHeadline, studioBody: h.studioBody,
    studioPortrait: await imageRef(h.studioPortrait), pillars: h.pillars,
    inquiryEyebrow: h.inquiryEyebrow, inquiryHeadline: h.inquiryHeadline, inquiryIntro: h.inquiryIntro, inquiryNote: h.inquiryNote,
  });

  const s = c.siteSettings;
  tx.createOrReplace({
    _id: 'siteSettings', _type: 'siteSettings',
    title: s.title, description: s.description, tagline: s.tagline, footerTagline: s.footerTagline,
    nav: s.nav.map((l, i) => ({ _type: 'navLink', _key: `n${i}`, ...l })),
    footerColumns: s.footerColumns.map((col, i) => ({
      _type: 'footerColumn', _key: `c${i}`, title: col.title,
      items: col.items.map((l, j) => ({ _type: 'navLink', _key: `c${i}i${j}`, ...l })),
    })),
    email: s.email, phone: s.phone, instagram: s.instagram, location: s.location,
  });

  const res = await tx.commit();
  console.log(`Wrote ${res.results.length} documents.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
