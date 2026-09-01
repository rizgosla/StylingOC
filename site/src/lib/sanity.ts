/* Data layer.
   With PUBLIC_SANITY_PROJECT_ID set, everything is read from Sanity (published
   perspective, CDN). Without it, the site renders the local seed content so the
   design can be built and reviewed before the CMS exists. Pages never know which. */

import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import * as local from '@seed/content';
import type { HomePage, Img, Post, Ratio, ServicePackage, SiteSettings } from '@seed/content';

export type { HomePage, Img, Post, Ratio, ServicePackage, SiteSettings };

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || 'production';
export const usingSanity = Boolean(projectId);

let _client: SanityClient | null = null;
function client(): SanityClient {
  if (!_client) {
    _client = createClient({ projectId: projectId!, dataset, apiVersion: '2026-08-31', useCdn: true, perspective: 'published' });
  }
  return _client;
}

/* ---------- GROQ ---------- */
const IMG = `{
  "sanity": { asset, hotspot, crop },
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  alt, caption
}`;
const PKG = `{ _id, line, numeral, title, items, price, priceNote, note, "image": image ${IMG} }`;
const CARD = `{
  _id, title, "slug": slug.current, category, location, publishedAt, standfirst, dek, ratio, photoCredit, draftNote,
  "leadImage": leadImage ${IMG}
}`;
const POST = `{
  ...${CARD},
  body[]{
    ...,
    _type == "imageBlock" => { "image": image ${IMG} },
    _type == "serviceCallout" => { "package": package-> ${PKG} }
  }
}`;
const HOME = `{
  "home": *[_type == "homePage"][0]{
    ...,
    "leadStory": leadStory-> ${CARD},
    "latest": latest[]-> ${CARD},
    "featuredPost": featuredPost-> ${CARD},
    "testimonial": testimonial->{ _id, quote, attribution, role },
    "studioPortrait": studioPortrait ${IMG},
    "interiorsImage": interiorsImage ${IMG},
    "stylingImage": stylingImage ${IMG}
  },
  "settings": *[_type == "siteSettings"][0],
  "packages": *[_type == "servicePackage"] | order(line asc, numeral asc) ${PKG},
  "newest": *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...4] ${CARD}
}`;

/* ---------- normalisation ---------- */
const cleanImg = (i: any): Img | null => (i && i.src ? i : null);
const cleanPost = (p: any): Post | null => {
  if (!p || !p.slug) return null;
  return {
    ...p,
    leadImage: cleanImg(p.leadImage),
    ratio: p.ratio || '4:5',
    body: (p.body || []).map((n: any) => (n._type === 'imageBlock' ? { ...n, image: cleanImg(n.image) } : n)),
  };
};

/* ---------- memoised fetches (one round-trip per build) ---------- */
let homeMemo: Promise<{ home: HomePage; settings: SiteSettings; packages: ServicePackage[] }> | null = null;

export function getHome() {
  if (homeMemo) return homeMemo;
  homeMemo = (async () => {
    if (!usingSanity) {
      return { home: local.homePage, settings: local.siteSettings, packages: local.servicePackages };
    }
    const r = await client().fetch(HOME);
    if (!r.home || !r.settings) {
      throw new Error('Sanity has no "homePage" / "siteSettings" document yet. Run `npm run seed` once, or create them in /studio.');
    }
    const newest: Post[] = (r.newest || []).map(cleanPost).filter(Boolean);
    const lead = cleanPost(r.home.leadStory) || newest[0];
    if (!lead) throw new Error('Sanity has no published Journal post. Publish at least one post before building.');
    const latestPicked: Post[] = (r.home.latest || []).map(cleanPost).filter(Boolean);
    const latest = latestPicked.length ? latestPicked : newest.slice(0, 3);
    const featured = cleanPost(r.home.featuredPost) || newest.find((p) => p._id !== lead._id) || lead;
    const home: HomePage = {
      ...local.homePage, // defaults for any field the editor has not filled in
      ...stripNulls(r.home),
      leadStory: lead,
      latest,
      featuredPost: featured,
      testimonial: r.home.testimonial || local.homePage.testimonial,
      studioPortrait: cleanImg(r.home.studioPortrait),
      interiorsImage: cleanImg(r.home.interiorsImage),
      stylingImage: cleanImg(r.home.stylingImage),
      studioBody: r.home.studioBody?.length ? r.home.studioBody : local.homePage.studioBody,
      pillars: r.home.pillars?.length ? r.home.pillars : local.homePage.pillars,
    };
    const settings: SiteSettings = { ...local.siteSettings, ...stripNulls(r.settings) };
    if (!settings.nav?.length) settings.nav = local.siteSettings.nav;
    if (!settings.footerColumns?.length) settings.footerColumns = local.siteSettings.footerColumns;
    const packages: ServicePackage[] = r.packages?.length
      ? r.packages.map((p: any) => ({ ...p, image: cleanImg(p.image) }))
      : local.servicePackages;
    return { home, settings, packages };
  })();
  return homeMemo;
}

export async function getSettings() {
  return (await getHome()).settings;
}

let postsMemo: Promise<Post[]> | null = null;
export function getPosts(): Promise<Post[]> {
  if (postsMemo) return postsMemo;
  postsMemo = (async () => {
    if (!usingSanity) return [...local.posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const r = await client().fetch(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${POST}`);
    return r.map(cleanPost).filter(Boolean) as Post[];
  })();
  return postsMemo;
}

export async function getPost(slug: string): Promise<Post | null> {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getRelated(slug: string, n = 3): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.slug !== slug).slice(0, n);
}

function stripNulls<T extends Record<string, any>>(o: T): Partial<T> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(o)) if (v !== null && v !== undefined && v !== '') out[k] = v;
  return out as Partial<T>;
}

/* ---------- images ---------- */
export const RATIO: Record<Ratio, number> = { '3:2': 3 / 2, '4:5': 4 / 5, '3:4': 3 / 4, '1:1': 1 };
const WIDTHS = [480, 768, 1024, 1440, 1920];

let _builder: ReturnType<typeof imageUrlBuilder> | null = null;
function builder() {
  if (!_builder) _builder = imageUrlBuilder({ projectId: projectId!, dataset });
  return _builder;
}

export interface Srcset { src: string; srcset?: string; width: number; height: number; objectPosition?: string }

/** Build src/srcset for a picture at an optional fixed ratio. Local files are served as-is. */
export function picture(img: Img, ratio?: Ratio): Srcset {
  const r = ratio ? RATIO[ratio] : img.width / img.height;
  if (!usingSanity || !img.sanity?.asset?._ref) {
    const hs = (img as any).sanity?.hotspot;
    return { src: img.src, width: img.width, height: Math.round(img.width / r), objectPosition: hs ? `${Math.round(hs.x * 100)}% ${Math.round(hs.y * 100)}%` : undefined };
  }
  const base = builder().image(img.sanity).auto('format').fit('crop');
  const at = (w: number) => base.width(w).height(Math.round(w / r)).url();
  const widths = WIDTHS.filter((w) => w <= Math.max(img.width, 480));
  const largest = widths[widths.length - 1] ?? 480;
  return {
    src: at(largest),
    srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
    width: largest,
    height: Math.round(largest / r),
  };
}

/* ---------- small formatters ---------- */
export const CATEGORY_LABEL: Record<string, string> = { interiors: 'Interiors', styling: 'Personal styling', studio: 'The studio' };
export const formatDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? 'T12:00:00Z' : '')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
export const kicker = (p: Post) => [CATEGORY_LABEL[p.category] ?? p.category, p.location].filter(Boolean).join(' · ');

/** First paragraph of a post body, for the feature block's drop-cap paragraph. */
export function firstParagraph(p: Post): string {
  const b = p.body.find((n: any) => n._type === 'block' && n.style === 'normal' && !n.listItem) as any;
  return b ? b.children.map((c: any) => c.text).join('') : p.dek;
}
