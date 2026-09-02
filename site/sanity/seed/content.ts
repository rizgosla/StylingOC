/* Styling OC — seed content.
   Single source for (a) `npm run seed`, which writes these documents to Sanity, and
   (b) the local fallback the site renders when PUBLIC_SANITY_PROJECT_ID is unset.
   Copy is verbatim from the client collateral wherever it exists; sentences written
   for this site are flagged with `draftNote` so the client can rewrite them in Studio. */

export type Category = 'interiors' | 'styling' | 'studio';
export type Ratio = '3:2' | '4:5' | '3:4' | '1:1';
export type BlockWidth = 'column' | 'wide' | 'full';

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
export type BodyNode = Block | ImageBlock | QuoteBlock | ServiceCallout;

export interface ServicePackage {
  _id: string; line: 'interiors' | 'styling'; numeral: string; title: string;
  items: string[]; price: string; priceNote?: string; note?: string; image?: Img | null;
}
export interface Testimonial { _id: string; quote: string; attribution: string; role?: string }
export interface Post {
  _id: string; title: string; slug: string; category: Category; location?: string; publishedAt: string;
  standfirst: string; dek: string; leadImage: Img | null; ratio: Ratio; body: BodyNode[];
  photoCredit?: string; draftNote?: string;
}
export interface NavLink { label: string; href: string }
export interface FooterColumn { title: string; items: NavLink[] }
export interface SiteSettings {
  title: string; description: string; tagline: string; footerTagline: string;
  nav: NavLink[]; footerColumns: FooterColumn[]; email?: string; phone?: string; instagram?: string; location: string;
}
export interface HomePage {
  leadStory: Post; heroHeadline?: string; latest: Post[]; featuredPost: Post;
  interiorsEyebrow: string; interiorsHeadline: string; interiorsIntro: string;
  stylingEyebrow: string; stylingHeadline: string; stylingIntro: string;
  testimonial: Testimonial;
  studioEyebrow: string; studioHeadline: string; studioBody: string[]; studioPortrait: Img | null; pillars: string[];
  inquiryEyebrow: string; inquiryHeadline: string; inquiryIntro: string; inquiryNote: string;
}

/* ---------- helpers for hand-written Portable Text ---------- */
let k = 0;
const key = () => `k${(++k).toString(36)}`;
const span = (text: string, marks: string[] = []): Span => ({ _type: 'span', _key: key(), text, marks });
export const p = (...parts: Array<string | Span>): Block => ({
  _type: 'block', _key: key(), style: 'normal', markDefs: [],
  children: parts.map((x) => (typeof x === 'string' ? span(x) : x)),
});
export const em = (text: string) => span(text, ['em']);
export const h2 = (text: string): Block => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
export const li = (text: string): Block => ({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span(text)] });
export const quote = (q: string, attribution: string, role?: string): QuoteBlock => ({ _type: 'quoteBlock', _key: key(), quote: q, attribution, role });
export const imageBlock = (image: Img | null, width: BlockWidth = 'wide'): ImageBlock => ({ _type: 'imageBlock', _key: key(), image, width });
export const callout = (pkg: ServicePackage): ServiceCallout => ({ _type: 'serviceCallout', _key: key(), package: pkg });

/* ---------- images (the five originals; everything else is a placeholder) ---------- */
export const images = {
  livingMarble: { src: '/images/interior-living-marble.jpeg', width: 868, height: 1280, alt: 'A curved bouclé sofa in front of a book-matched grey marble fireplace wall, with a black marble side table and a glass globe floor lamp.', caption: 'Living room, Orange County' } satisfies Img,
  poolView: { src: '/images/interior-pool-view.jpeg', width: 976, height: 1280, alt: 'Two curved cream sofas around a round black coffee table, facing floor-to-ceiling glass onto a pool and palms.', caption: 'Living room, looking out to the pool' } satisfies Img,
  foundersDenim: { src: '/images/founders-denim.jpeg', width: 1320, height: 1879, alt: 'Jenn and Merlyn standing against a white wall in the studio, in denim and silk shirts.', caption: 'Jenn and Merlyn in the studio' } satisfies Img,
  foundersWarm: { src: '/images/founders-portrait-warm.jpeg', width: 1320, height: 1906, alt: 'Jenn seated in a cream bouclé chair with Merlyn perched on its arm, against a warm taupe studio ground.', caption: 'Portrait of the founders' } satisfies Img,
  foundersGray: { src: '/images/founders-studio-gray.jpeg', width: 1313, height: 1798, alt: 'Jenn and Merlyn laughing together in black and navy tailoring against a grey studio ground.', caption: 'Jenn and Merlyn' } satisfies Img,
  /* Interiors portfolio photographs, added by the studio (media/, Meads project). */
  /* The five room photographs cropped from the printed interiors menu (small files;
     soft at large sizes — the Meads photographs are the sharper alternative). */
  flyerConsultation: { src: '/images/flyer-consultation.jpg', width: 215, height: 401, alt: 'A black vase of greenery and a stack of books on a round travertine coffee table.' } satisfies Img,
  flyerFullService: { src: '/images/flyer-full-service.jpg', width: 217, height: 401, alt: 'Open oak shelving with ceramics above a stone counter and a boucle stool.' } satisfies Img,
  flyerEDesign: { src: '/images/flyer-e-design.jpg', width: 215, height: 401, alt: 'Fabric and stone samples laid out beside a pencil sketch.' } satisfies Img,
  flyerTurnkey: { src: '/images/flyer-turnkey.jpg', width: 217, height: 401, alt: 'A marble kitchen island with two cream counter stools and a vase of olive branches.' } satisfies Img,
  flyerBasicRoom: { src: '/images/flyer-basic-room.jpg', width: 425, height: 300, alt: 'A living room at dusk with a lit fireplace, cream sofas and candles on a dark coffee table.' } satisfies Img,
  meadsFireplaceLiving: { src: '/images/meads-fireplace-living.jpg', width: 1600, height: 1068, alt: 'A living room in the evening: a lit brick fireplace under a white mantel, dark built-in shelving and two cream sofas.' } satisfies Img,
  meadsVaultedLiving: { src: '/images/meads-vaulted-living.jpg', width: 1600, height: 1068, alt: 'A double-height white living room with black french doors open to a courtyard, curved boucle sofas around a stone coffee table.' } satisfies Img,
  meadsFamilyRoom: { src: '/images/meads-family-room.jpg', width: 1600, height: 1068, alt: 'A beamed great room flowing into a white kitchen, with swivel chairs and french doors onto the garden.' } satisfies Img,
  meadsDiningKitchen: { src: '/images/meads-dining-kitchen.jpg', width: 1600, height: 1067, alt: 'An open dining room and kitchen: a dark oak table with cream chairs and a long marble island with black stools.' } satisfies Img,
  meadsDiningHall: { src: '/images/meads-dining-hall.jpg', width: 1600, height: 1068, alt: 'A dining table below a panelled staircase, fiddle-leaf figs at the windows.' } satisfies Img,
  meadsDiningEntry: { src: '/images/meads-dining-entry.jpg', width: 1600, height: 1067, alt: 'The dining room toward the entry, a brass mirror over a reclaimed-wood console.' } satisfies Img,
  meadsOffice: { src: '/images/meads-office.jpg', width: 1600, height: 1068, alt: 'A study with a glass trestle desk, steel doors to the patio and a fiddle-leaf fig by a round mirror.' } satisfies Img,
  meadsFormalLiving: { src: '/images/meads-formal-living.jpg', width: 1600, height: 1068, alt: 'A formal living room: four boucle swivel chairs around a travertine table in a bay window, fire burning.' } satisfies Img,
  meadsBedroom: { src: '/images/meads-bedroom.jpg', width: 1600, height: 1068, alt: 'A primary bedroom with a channel-tufted headboard and two pairs of french doors open to the garden.' } satisfies Img,
  meadsLoft: { src: '/images/meads-loft.jpg', width: 1600, height: 1069, alt: 'A lounge loft with boucle seating, a black round coffee table and a cowhide rug.' } satisfies Img,
};

/* ---------- service packages — verbatim from the two printed menus ---------- */
export const servicePackages: ServicePackage[] = [
  { _id: 'package-interiors-01', line: 'interiors', numeral: '01', title: 'Consultation-Only Package', items: ['One-time meeting (in person or virtual) for advice, ideas, color selection, furniture arrangement, and general styling tips.'], price: '$500 per hour', image: images.meadsFormalLiving },
  { _id: 'package-interiors-02', line: 'interiors', numeral: '02', title: 'Full-Service Interior Design Package', items: ['End-to-end service, including concept development, space planning, furniture and décor selection, ordering, contractor coordination, and final styling.'], price: '$20,000 – $40,000', priceNote: 'Depending on square footage and design considerations.', image: images.meadsVaultedLiving },
  { _id: 'package-interiors-03', line: 'interiors', numeral: '03', title: 'E-Design Package', items: ['A remote design service where the designer provides a mood board, shopping list, floor plan, and styling tips. Clients handle purchases and execution.'], price: '$3,000 per room', image: images.meadsOffice },
  { _id: 'package-interiors-04', line: 'interiors', numeral: '04', title: 'Turnkey Interior Design Package', items: ['A comprehensive package where the designer handles everything from start to finish, including purchasing, delivery, setup, and finishing touches. Ideal for luxury homes or high-end clients.'], price: '$50,000 – $250,000', priceNote: 'For an entire home, depending on square footage and design consideration.', image: images.meadsDiningKitchen },
  { _id: 'package-interiors-05', line: 'interiors', numeral: '05', title: 'Basic Room Design Package', items: ['Space planning, furniture selection, color palette, and styling recommendations. Does not include execution or full project management.'], price: '$5,000 per room', image: images.meadsBedroom },
  { _id: 'package-interiors-06', line: 'interiors', numeral: '06', title: 'Evening Design Consultation', items: ['In-person evening consultation available for your convenience.'], price: '$750', priceNote: 'Two-hour minimum.', image: images.meadsFireplaceLiving },
  { _id: 'package-styling-01', line: 'styling', numeral: '01', title: 'The Style Edit', items: ['One-on-one personal style consultation', 'Create polished outfits using pieces you already own', 'Styling guidance for fit, proportion, layering and accessories', 'Recommendations for key pieces to complete your wardrobe'], price: '$500 per hour', note: 'A focused refresh designed to make your existing wardrobe work beautifully.' },
  { _id: 'package-styling-02', line: 'styling', numeral: '02', title: 'The Concierge', items: ['Personal style and lifestyle consultation', 'Wardrobe assessment and edit', 'Curated selection and sourcing of new wardrobe pieces', 'Full styling session with complete head-to-toe outfit creation', 'Accessory and finishing-piece recommendations'], price: '$5,000', note: 'A luxury concierge experience — your wardrobe, elevated and curated for you.' },
  { _id: 'package-styling-03', line: 'styling', numeral: '03', title: 'The Image Experience', items: ['Comprehensive personal image consultation', 'Curated wardrobe selections, sourcing and complete styling', 'Personal color consultation', 'Referrals for hair styling and color, makeup and beauty professionals', 'Beauty and aesthetic treatment recommendations and referrals', 'Coordinated image direction across wardrobe, hair, makeup and beauty'], price: '$10,000', note: 'More than a wardrobe — a complete image experience tailored to how you want to be seen.' },
];
const pkg = (id: string) => servicePackages.find((s) => s._id === id)!;

/* ---------- testimonials — client words, verbatim, trimmed to one held thought ---------- */
export const testimonials: Testimonial[] = [
  { _id: 'testimonial-virra', quote: 'What started as a client-designer relationship evolved into a really amazing friendship, and I am so grateful for that.', attribution: 'Virra', role: 'Interior design client' },
  { _id: 'testimonial-emily', quote: 'After going through a really difficult season, they made me feel beautiful from the inside out.', attribution: 'Emily', role: 'Personal styling client' },
];

/* ---------- posts ---------- */
const DRAFT = 'DRAFT — for client review. The paragraphs in this story were written for the site, not taken from your collateral. Edit freely, then clear this note.';

export const posts: Post[] = [
  {
    _id: 'post-the-art-of-personal-style',
    title: 'The art of personal style',
    slug: 'the-art-of-personal-style',
    category: 'styling',
    location: 'Orange County',
    publishedAt: '2026-08-10',
    standfirst: 'Jenn and Merlyn redefine modern styling through a lens of confidence, intention, and timeless design.',
    dek: 'Style is more than what you wear — it is how you feel.',
    leadImage: images.foundersGray,
    ratio: '4:5',
    photoCredit: 'Photography courtesy of the studio',
    body: [
      p('Style is more than what you wear — it’s how you feel. Jenn and Merlyn, the visionary duo behind Styling OC, believe that true transformation happens when style meets soul. Their approach is equal parts artistry and empathy, creating refined, modern looks that empower women to step fully into their confidence.'),
      h2('The design touch'),
      li('Personalized styling with a luxury eye'),
      li('Thoughtful details that tell your story'),
      li('Confidence-boosting looks that last'),
      li('A seamless blend of elevated + effortless'),
      quote('After going through a really difficult season, they made me feel beautiful from the inside out. Their genuine encouragement, support, and incredible attention to detail helped me rediscover my confidence and feel like myself again.', 'Emily', 'Personal styling client'),
      callout(pkg('package-styling-02')),
      p(em('Style isn’t just seen. It’s felt.')),
    ],
  },
  {
    _id: 'post-a-living-room-reconsidered',
    title: 'A living room in Orange County, reconsidered',
    slug: 'a-living-room-in-orange-county-reconsidered',
    category: 'interiors',
    location: 'Orange County',
    publishedAt: '2026-08-03',
    standfirst: 'Book-matched marble, a curved bouclé sofa and a room that finally faces the pool.',
    dek: 'A full-service project, from concept to the final cushion.',
    leadImage: images.livingMarble,
    ratio: '3:4',
    draftNote: DRAFT,
    body: [
      p('The room had good bones and a difficult centre. A double-height wall asked for something monumental; the furniture that came with the house answered with a sectional pushed into the corner. We began by turning everything toward the light.'),
      p('The fireplace wall is now a single slab of grey marble, book-matched so the veining meets in the middle like an inkblot. Either side, black shelving holds the objects the family actually uses: a few ceramics, the books they are reading, nothing arranged for a photograph.'),
      imageBlock(images.poolView, 'wide'),
      p('Seating is soft and round on purpose. Two curved sofas in cream bouclé face each other across a black stone table, so the conversation happens in the middle of the room and the view of the pool is shared rather than owned by one seat. A glass globe lamp adds the only shine.'),
      h2('How the project ran'),
      p('This was a full-service engagement: concept development, space planning, furniture and décor selection, ordering, contractor coordination and final styling. The family lived in the house throughout, so work was sequenced room by room and the marble was installed in a single day.'),
      callout(pkg('package-interiors-02')),
      p(em('Thoughtful design. Personalised spaces. Timeless living.')),
    ],
  },
  {
    _id: 'post-meet-emily',
    title: 'Meet Emily',
    slug: 'meet-emily',
    category: 'styling',
    location: 'Orange County',
    publishedAt: '2026-07-20',
    standfirst: 'A wardrobe for a season of transition.',
    dek: 'Emily came to us during a season of transition.',
    leadImage: null,
    ratio: '1:1',
    body: [
      p('Emily came to us during a season of transition. Together, we curated a wardrobe and aesthetic that reflects her strength, softness, and sense of self. The result? A renewed confidence that shines in every detail.'),
      quote('Working with Jenn and Merlyn was such a meaningful experience. They have a special gift for not only styling you beautifully, but also making you feel truly seen, cared for, and celebrated.', 'Emily', 'Personal styling client'),
      callout(pkg('package-styling-01')),
    ],
  },
];
const post = (id: string) => posts.find((x) => x._id === id)!;

/* ---------- singletons ---------- */
export const siteSettings: SiteSettings = {
  title: 'Styling OC',
  description: 'Styling OC is a luxury interior design and personal styling studio in Orange County, California, run by Jenn and Merlyn. Design that feels like home. Style that empowers.',
  tagline: 'Interiors · Personal Styling · Orange County',
  footerTagline: 'Thoughtful design. Personalised spaces. Timeless living.',
  nav: [
    { label: 'Interiors', href: '/#interiors' },
    { label: 'Personal styling', href: '/#styling' },
    { label: 'Journal', href: '/journal/' },
    { label: 'The studio', href: '/#studio' },
    { label: 'Inquire', href: '/#inquire' },
  ],
  footerColumns: [
    { title: 'The studio', items: [{ label: 'Jenn & Merlyn', href: '/#studio' }, { label: 'Journal', href: '/journal/' }, { label: 'Inquire', href: '/#inquire' }] },
    { title: 'Services', items: [{ label: 'Interior design', href: '/#interiors' }, { label: 'Personal styling', href: '/#styling' }, { label: 'Evening design consultation', href: '/#interiors' }] },
    { title: 'Contact', items: [{ label: 'Orange County, California', href: '' }] },
  ],
  email: 'hello@stylingoc.com',
  location: 'Orange County, California',
};

export const homePage: HomePage = {
  leadStory: post('post-a-living-room-reconsidered'),
  heroHeadline: 'Empowering the home and the person',
  latest: [post('post-the-art-of-personal-style'), post('post-a-living-room-reconsidered'), post('post-meet-emily')],
  featuredPost: post('post-the-art-of-personal-style'),
  interiorsEyebrow: 'Interior design',
  interiorsHeadline: 'Design that feels like home.',
  interiorsIntro: 'Full-service residential design, remodels, e-design and turnkey furnishing, interior and exterior. We work closely with real-estate agents on pre-listing makeovers and post-purchase transformations.',
  stylingEyebrow: 'Personal styling',
  stylingHeadline: 'Style that empowers. Confidence that lasts.',
  stylingIntro: 'Wardrobe editing, sourcing and full image direction. Three experiences, from a focused edit of what you already own to complete image direction across wardrobe, hair, makeup and beauty.',
  testimonial: testimonials[0],
  studioEyebrow: 'The studio',
  studioHeadline: 'Jenn & Merlyn',
  studioBody: [
    'A thoughtful collaboration. A beautiful transformation. A friendship that lasts.',
    'Two founders, one studio and one point of contact. We design homes and wardrobes for the same clientele in Orange County, and we are the people you talk to from the first call to the final styling.',
  ],
  studioPortrait: images.foundersDenim,
  pillars: ['Vision', 'Intention', 'Beauty', 'Balance'],
  inquiryEyebrow: 'Inquiries',
  inquiryHeadline: 'Tell us about your space.',
  inquiryIntro: 'Or your wardrobe. A few lines is enough.',
  inquiryNote: 'We reply within two business days.',
};
