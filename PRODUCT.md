# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: affluent Orange County homeowners, and people (mostly women) who want a personal restyle of themselves. They arrive weighing whether to trust two people with their home or their wardrobe, and the job the site does is to let them decide to send an inquiry.

Secondary, unconfirmed as a site audience: real-estate agents commissioning pre-listing makeovers and post-purchase transformations. The design-system brief names this channel; the user did not select it as a visitor the Home page must win. Do not build agent-facing surfaces without asking.

Post-launch editor: the two founders (or someone on their behalf) editing content in Sanity Studio without a developer.

## Product Purpose

Styling OC is a luxury interior-design and personal-styling studio in Orange County, California, run by two founders, Jenn and Merlyn. The site is the studio's editorial front door. Success in year one is inquiries first: a qualified inquiry submitted through the site is the outcome everything serves, and credibility for word-of-mouth referrals is the mechanism that gets people there.

## Positioning

Two connected service lines share one studio and one point of contact: interiors ("Design that feels like home.") and personal styling ("Style that empowers. Confidence that lasts."). The claim a neighbouring studio cannot copy is the pairing itself: the same two people design your rooms and dress you, and the relationship is the product ("a friendship that lasts"). There is no team. The studio speaks as "we" and means two people.

Pillars: Vision · Intention · Beauty · Balance.

Client-set reference: Architectural Digest. Editorial, not corporate. A magazine that happens to sell services.

## Operating Context

- Two service lines, each with a printed price menu the site restates verbatim:
  - Interiors, packages 01–06: Consultation-Only ($500 per hour), Full-Service ($20,000 – $40,000), E-Design ($3,000 per room), Turnkey ($50,000 – $250,000 for an entire home), Basic Room Design ($5,000 per room), Evening Design Consultation ($750, two-hour minimum).
  - Personal styling, tiers 01–03: The Style Edit ($500 per hour), The Concierge ($5,000), The Image Experience ($10,000).
- Prices are confirmed current by the user (2026-09-07). Prices are copy, stated plainly and completely with the qualifier attached. Never "starting at", "investment", or hidden.
- The single conversion on every page is the inquiry form (name, email, phone, interest, message). It posts to `/api/inquiry`, which stores an `inquiry` document in Sanity; the Studio shows an Inquiries inbox. Email notification is a listed follow-up, not shipped.
- Editing flow: founders publish in Sanity Studio at `/studio`; a deploy hook rebuilds the static site. Editors get content plus closed enums only, never colour, font or spacing controls.
- Local review flow: with no Sanity project id, the site renders from `site/sanity/seed/content.ts`, so design can be reviewed before the CMS is connected.

## Capabilities and Constraints

- Stack in place: Astro (static output) in `site/`, Sanity content model in `site/sanity/schemas`, Studio embedded at `/studio` with a hash router, Cloudflare Workers deploy (static assets from `dist/` plus a Worker for the inquiry API; classic Pages also works). No React on public pages.
- v1 scope: Home, Journal index, Journal post template, three seeded posts. Deferred: Interiors and Personal Styling service pages, Projects index with before/after, The Studio page, night-theme evening-consultation band, Visual Editing, inquiry email notifications, newsletter capture.
- Content model terminology: post (category interiors / styling / studio), servicePackage (line, numeral, title, items, price, priceNote, note), testimonial, homePage singleton, siteSettings singleton, inquiry.
- Hard content rules from the design system, treated as product truth: sentence case for headlines, Title Case for package names, one call to action per screen, no emoji or icons, no exclamation marks in studio voice, no "elevate your space", "dream home", "let's chat", no urgency or scarcity. Editorial verbs: "Begin an inquiry", "See how we work", "Read the story".
- Accessibility outranks aesthetic preference: WCAG 2.1 AA on everything (see below).
- Undecided: whether real-estate agents are a served audience; whether an email notification provider will be added; whether the site domain is stylingoc.com.

## Brand Commitments

- Name: Styling OC. Wordmark is set type, not a logo file: "STYLING OC" letterspaced (masthead, collateral) and a stacked "Styling / OC" lockup (footer, brand sheets). If the studio supplies a real mark it replaces both.
- Tagline: "Interiors · Personal Styling · Orange County". Footer line: "Thoughtful design. Personalised spaces. Timeless living." Brand triplet: "A thoughtful collaboration. A beautiful transformation. A friendship that lasts."
- Voice: warm, plain, unhurried; confident without selling. Studio is "we", client is "you". Short declaratives, often fragments, sometimes a triplet.
- Binding visual constraint volunteered by the user: type on white, never headlines over photographs, no scrims or overlays; photographs are captioned plates. The design system's type (Zodiak, Archivo), colour (white, softened black, one brass accent), buttons and wordmark are kept. The design system's demo `EditorialHero` is rejected and must not be ported. The user's mantra: "keep it minimalist, thoughtful white space is your best friend." Refer to `Styling OC Design System/readme.md` for the token source of truth.

## Evidence on Hand

- Photography confirmed as Styling OC's own work with rights to publish: the N Meads project (`Media/*.jpg`, ten frames, copied into `site/public/images/meads-*.jpg`). Also two interior frames and three founder portraits from the design system (`site/public/images/interior-*.jpeg`, `founders-*.jpeg`). The five printed package flyers are in `site/public/images/flyer-*.jpg` and `fwdstylingocmedia/`.
- Client collateral: interior services menu, personal styling menu, two brand sheets (`Styling OC Design System/assets/collateral/`, originals in `uploads/`). Package copy and pillars come from these verbatim.
- Testimonials on file, first name only: Virra (interiors client) and Emily (styling client). Public-use approval NOT confirmed by the user; keep verbatim, do not add more, and flag for client sign-off before launch.
- Contact: `hello@stylingoc.com` and the stylingoc.com domain are in the seed but NOT confirmed as the client's. Treat as placeholders until confirmed. Instagram handle: none on file.
- No usable photograph of Emily; no logo file; no press, case-study metrics, or client counts. Do not fabricate any of these.
- Journal post copy: brand-sheet prose is verbatim; new prose written for the Newport Coast living-room post is flagged `draftNote` for client review.

## Product Principles

1. Prove the studio through its work, not its claims: real photographs, real prices, real words from clients, nothing invented.
2. One decision per screen: every page exists to move a homeowner or styling client toward a single inquiry, with no competing calls to action.
3. Two people, one relationship: the pairing of interiors and personal styling under Jenn and Merlyn is the story; never flatten it into a generic agency.
4. The founders must be able to change any content themselves after launch; anything an editor cannot reach in Studio is a defect.
5. Accessibility and honest pricing outrank aesthetic preference.

## Accessibility & Inclusion

WCAG 2.1 AA is a hard rule inherited from the design system and confirmed as product policy: text contrast ≥ 4.5:1 (brass `#9C7C4A` fails at body size, so accent text uses `--accent-strong` or `--accent-deep`), large text and boundaries ≥ 3:1, visible focus on every interactive element, hit targets ≥ 44px, real labels on every field, alt text on every image, meaning never by colour alone, and all motion collapsing to zero under `prefers-reduced-motion`.
