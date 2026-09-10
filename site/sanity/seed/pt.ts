/* Styling OC — the shapes a Journal post body is made of, and the builders that
   write them by hand. Imported by ./content.ts (which re-exports everything) and
   by ../templates.ts. This module must not import ./content.ts: the Studio bundle
   pulls it in for the "Create new" templates and has no use for the seed data. */

export type Ratio = '3:2' | '4:5' | '3:4' | '1:1';
export type BlockWidth = 'column' | 'wide' | 'full';
/** Page shape of a post. Mirrors LAYOUTS in ../schemas/documents.ts. */
export type Layout = 'feature' | 'essay' | 'interview' | 'note' | 'guide';

/** A picture. Locally a /images path; from Sanity a resolved asset. */
export interface Img {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  /** Sanity only: raw image object so crops/hotspots and srcsets can be built. */
  sanity?: { asset: { _ref: string }; hotspot?: unknown; crop?: unknown };
  lqip?: string;
}

export interface Span { _type: 'span'; _key: string; text: string; marks: string[] }
export interface Block {
  _type: 'block'; _key: string; style: 'normal' | 'h2' | 'h3';
  children: Span[]; markDefs: Array<{ _key: string; _type: 'link'; href: string }>; listItem?: 'bullet'; level?: number;
}
export interface ImageBlock { _type: 'imageBlock'; _key: string; image: Img | null; width: BlockWidth }
export interface QuoteBlock { _type: 'quoteBlock'; _key: string; quote: string; attribution: string; role?: string }
export interface ServiceCallout { _type: 'serviceCallout'; _key: string; package: ServicePackage }
/** One to three plates across, sharing a crop. Items from Sanity also carry a _key. */
export interface Gallery { _type: 'gallery'; _key: string; items: Array<Img | null>; ratio: Ratio; caption?: string }
/** One exchange in an interview. An empty answer renders as "Answer to come". */
export interface QaPair { _type: 'qaPair'; _key: string; question: string; answer: Block[] }
export type BodyNode = Block | ImageBlock | QuoteBlock | ServiceCallout | Gallery | QaPair;

export interface ServicePackage {
  _id: string; line: 'interiors' | 'styling'; numeral: string; title: string;
  items: string[]; price: string; priceNote?: string; note?: string; image?: Img | null;
}

/* ---------- helpers for hand-written Portable Text ---------- */
let k = 0;
export const key = () => `k${(++k).toString(36)}`;
export const span = (text: string, marks: string[] = []): Span => ({ _type: 'span', _key: key(), text, marks });
export const p = (...parts: Array<string | Span>): Block => ({
  _type: 'block', _key: key(), style: 'normal', markDefs: [],
  children: parts.map((x) => (typeof x === 'string' ? span(x) : x)),
});
export const em = (text: string) => span(text, ['em']);
export const strong = (text: string) => span(text, ['strong']);
export const h2 = (text: string): Block => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
export const h3 = (text: string): Block => ({ _type: 'block', _key: key(), style: 'h3', markDefs: [], children: [span(text)] });
export const li = (text: string): Block => ({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span(text)] });
export const quote = (q: string, attribution: string, role?: string): QuoteBlock => ({ _type: 'quoteBlock', _key: key(), quote: q, attribution, role });
export const imageBlock = (image: Img | null, width: BlockWidth = 'wide'): ImageBlock => ({ _type: 'imageBlock', _key: key(), image, width });
export const callout = (pkg: ServicePackage): ServiceCallout => ({ _type: 'serviceCallout', _key: key(), package: pkg });
export const gallery = (items: Array<Img | null>, ratio: Ratio = '4:5', caption?: string): Gallery => ({ _type: 'gallery', _key: key(), items, ratio, caption });
export const qa = (question: string, ...answer: Block[]): QaPair => ({ _type: 'qaPair', _key: key(), question, answer });

/* ---------- filler ----------
   Placeholder prose for the draft posts and the Studio's "Create new" templates, so
   layouts can be reviewed before the client writes them. Anything built from `lorem`
   carries a `draftNote`. */
const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
];
/** n lorem sentences, joined into one paragraph. */
export const lorem = (n: number) => Array.from({ length: n }, (_, i) => LOREM[i % LOREM.length]).join(' ');
