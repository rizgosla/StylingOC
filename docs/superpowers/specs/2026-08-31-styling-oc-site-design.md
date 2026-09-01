# Styling OC — editorial site (Astro + Sanity on Cloudflare Pages)

## Context

Styling OC (Jenn & Merlyn, Orange County) is a luxury interior-design + personal-styling studio. The client's reference is **Architectural Digest**: a magazine that happens to sell services. The repo already holds a complete design system (`Styling OC Design System/`) — tokens, Zodiak/Archivo type, brass accent, 15 React reference components, brand collateral, five photographs — plus a Sanity content sketch in `guidelines/astro-sanity.md`.

The user **rejects the demo site the design system renders** (text-over-photo heroes under dark scrims, centered masthead hero) but wants to keep its **type, colour, buttons and the set-type "Styling OC" wordmark**. The client must be able to **edit the site after launch** without a developer.

Decisions already made with the user:

| Decision | Choice |
| --- | --- |
| Stack | Astro (static output) + Sanity, Studio embedded at `/studio` |
| Editing model | Publish in Studio → Cloudflare deploy hook rebuilds → live in ~1 min |
| Hosting | Cloudflare Pages |
| Sanity project | Create during build (`npx sanity init`) |
| Scope v1 | **Home + Journal post template + 3 seeded posts** (service pages, projects index, studio page = later) |
| Hero treatment | **AD-style: type on white, never over photographs. No scrims.** |
| Imagery | Real photos only + clearly labelled "Photograph to come" placeholder frames |
| Post copy | Draft 3 posts; verbatim collateral copy where it exists, new prose flagged `DRAFT — for client review` |

## Repo layout (new)

```
StylingOC/
├─ Styling OC Design System/      (untouched — source of truth for tokens)
├─ fwdstylingocmedia/             (untouched)
└─ site/                          ← new Astro project (git init the repo root)
   ├─ astro.config.mjs            static output; sanity() + react() integrations
   ├─ sanity.config.ts            Studio config (structureTool, singletons)
   ├─ sanity/schemas/*.ts         content model (below)
   ├─ sanity/seed/                seed script + JSON for the 3 posts, packages, settings
   ├─ functions/api/inquiry.ts    Cloudflare Pages Function (inquiry → Sanity doc)
   ├─ public/fonts/Zodiak-*.woff2 copied from DS assets/fonts
   ├─ public/images/              the 5 photos + brand collateral copies
   └─ src/
      ├─ styles/tokens/*.css      copied verbatim from DS tokens/ (only fonts.css path edited)
      ├─ styles/global.css        @imports tokens + the few global layout classes
      ├─ lib/sanity.ts            loadQuery, urlFor, GROQ queries
      ├─ components/…             .astro ports (list below)
      ├─ layouts/Base.astro       head, fonts, nav, footer, reveal script
      └─ pages/
         ├─ index.astro           Home
         ├─ journal/[slug].astro  Post
         ├─ journal/index.astro   Journal index (cheap; same grid component)
         └─ studio/[...params]    provided by @sanity/astro (hash router since static)
```

Package versions: latest Astro 5.x (or 6 if `npm create astro` defaults there), `@sanity/astro`, `@astrojs/react` (Studio only — no React on public pages), `astro-portabletext`, `@sanity/image-url`, `@sanity/client`, `@fontsource-variable/archivo` (replaces the Google Fonts `@import`).

## Design

Rules carried over from the DS (all remain hard constraints): pure white page, ink `#252321`, one brass accent (`--accent-strong` for any text), no radius, no shadows, no cards/boxes — three rule weights carry structure, 12-col asymmetric grid, slow fades only, WCAG AA on everything, no icons/emoji.

What changes vs the DS demo: **no photo ever carries a headline.** Every image is a square-cornered plate with a 9px caption beneath; type lives on white next to or below it — the AD pattern.

### Masthead / nav (`Masthead.astro`)
AD-style stacked masthead on load:
1. full-black hairline top rule;
2. centered **STYLING OC** wordmark — Zodiak 500, `0.1em` tracking, `--text-display-m` (this is "the logo they are using"; the stacked `Styling / OC` lockup from the brand sheets is used in the footer);
3. 9px tagline under it: `Interiors · Personal Styling · Orange County`;
4. hairline, then a centered nav row at 11px caps `0.34em`: Interiors · Personal Styling · Journal · The Studio · **Inquire** (Inquire in `--accent-strong`). Interiors / Personal Styling / Studio link to home anchors in v1 (their pages come later); Journal → `/journal`.

After 24px of scroll it becomes a compact sticky bar (wordmark left at 1rem, links right, hairline bottom) — the DS's "solidify" behaviour, but starting on white so there is no transparent-over-image state. Mobile (≤640): compact bar always; a "Menu" text button (no hamburger glyph) opens a full-height white panel with the links in `--text-display-s` Zodiak. ~20 lines of vanilla JS.

### Home (`index.astro`) — top to bottom

1. **Lead story** — full-width image plate (3:2, `Placeholder` if no image) with caption. Beneath, on white: eyebrow (`Interiors · Newport Coast`, brass-strong 9px) + Zodiak headline at `--text-display-l` spanning cols 1–8; standfirst (13px all-caps sans, 0.06em) + "Read the story" `TextLink` in cols 9–12, baseline-aligned. Editors pick the lead post in Sanity.
2. **The latest** — section opener: black rule + eyebrow "The latest" + right-aligned "All stories" link. Three posts across, columns divided by 18% hairlines, deliberately uneven ratios (4:5 / 3:4 / 1:1) via the post's `ratio` enum. Each: brass numeral `01–03`, image, eyebrow (category · location), Zodiak title at `--text-display-s`, one-line dek. Hover: image to 86% opacity, meta rule darkens. Tablet: 2 across; mobile: stacked, numerals kept.
3. **Two service lines** — a split bordered top by a black rule and divided by a vertical hairline. Left: eyebrow "Interior design", Zodiak headline "Design that feels like home.", 2–3 sentences, then a compact price list in 11px caps drawn from `servicePackage` (e.g. `CONSULTATION · $500 / HOUR`, `TURNKEY · $50,000 – $250,000`). Right: "Personal styling" / "Style that empowers. Confidence that lasts." / three tiers with prices. One `TextLink` each ("See the menu" → anchor in v1). Prices are copy, stated plainly — DS rule.
4. **Feature post** (`SplitFeature`) — image 4:5 in cols 1–5, text in cols 7–12 with a top offset: eyebrow, Zodiak `--text-display-m` title, first paragraph with a Zodiak drop cap, "Read the story". Editors pick the featured post (defaults to the 2nd newest).
5. **Pull quote** — Virra's testimonial trimmed to one held thought, 5.5rem brass quotation mark, Zodiak italic 300, attribution after a 40px rule. Day tone on white (keeps the one-night-band budget free for a future evening-consultation callout).
6. **The studio** — portrait plate (founders, 4:5) cols 1–4; cols 6–12: eyebrow "The studio", Zodiak headline "Jenn & Merlyn", pillars row `Vision · Intention · Beauty · Balance` in 9px caps, two short paragraphs, "Meet the studio" link. Content editable in `homePage`.
7. **Inquiry** (`InquiryForm`) — black rule; left cols 1–4: eyebrow "Inquiries", headline "Tell us about your space.", intro; right cols 6–12: underline-only fields (name, email, phone, interest select [Interior design / Personal styling / Both], message), one filled brass submit "Begin an inquiry", 9px note "We reply within two business days." Posts to `/api/inquiry`. This is the **one filled CTA on the page**.
8. **Footer** (`SiteFooter`) — black rule, three hairline-divided columns (Studio / Services / Contact + Instagram), stacked `Styling / OC` lockup, tagline "Thoughtful design. Personalised spaces. Timeless living." in wide caps, copyright note in `--ink-faint` 9px.

### Journal post (`journal/[slug].astro`)

- **Head**: cols 2–10 — eyebrow (category · date), Zodiak headline `--text-display-l` max 20ch, standfirst 13px caps, byline row in 9px caps ("Styling OC · Photography to come" etc.), then a black rule.
- **Lead image**: full-width plate with caption (or Placeholder).
- **Body**: Portable Text in cols 4–9 (measure 64ch, offset — never centered). First paragraph gets a Zodiak drop cap (`::first-letter`). Renderers: paragraph, `h2` → Zodiak `--text-display-s`, blockquote → `PullQuote size="md"`, `imageBlock` → plate + caption with `width` enum (column / wide / full), `serviceCallout` → hairline-ruled line showing numeral, package title and price with a link. Bold/italic/link marks only.
- **Related**: "More stories" — same 3-up grid excluding the current post.
- Inquiry block + footer.
- Draft-flag rendering: if `post.draftNote` is set, render a 9px `--accent-strong` line "Draft — for client review" under the byline (visible until the client clears the field).

### Journal index (`journal/index.astro`)
Section opener + the 3-up grid paginated by CSS only (all posts; there will be 3). Thin page, reuses everything.

### Components to port (`.astro`, scoped `<style>`, tokens only)
`Button` (outline / solid / accent variants — CSS `:hover` replaces the JS handlers), `TextLink` (draw-underline via `::after`), `Eyebrow`, `Rule`, `Plate` (image + caption + ratio; falls back to `Placeholder`), `Placeholder` (paper-100 ground, 18% hairline, centered 9px caps "Photograph to come"), `Masthead`, `SiteFooter`, `StoryCard`, `StoryGrid`, `LeadStory`, `SplitFeature`, `ServiceLines`, `PullQuote`, `StudioBlock`, `InquiryForm`, `PortableText` + block renderers, `Reveal` (IntersectionObserver fade — 700ms / 8px, disabled under reduced-motion).

Source references for each port: `Styling OC Design System/components/**/*.jsx` (already read: Button, TextLink, Eyebrow, SiteNav, SiteFooter, EditorialHero, PullQuote, ServiceTier, InquiryForm). EditorialHero is **not** ported.

## Sanity content model (`sanity/schemas`)

Editors get content plus a closed set of enums — no colour, font or spacing controls (DS rule).

| Type | Kind | Fields |
| --- | --- | --- |
| `post` | document | `title`, `slug`, `category` (interiors / styling / studio), `location`, `publishedAt`, `standfirst`, `dek` (1 line for grids), `leadImage` {asset, `alt`, `caption`}, `ratio` (3:2 / 4:5 / 3:4 / 1:1 — grid tile shape), `body` (portable text: block, `imageBlock`{image, alt, caption, `width`: column/wide/full}, `quoteBlock`{quote, attribution, role}, `serviceCallout`{ref servicePackage}), `draftNote` (string, optional) |
| `servicePackage` | document | `line` (interiors / styling), `numeral`, `title`, `items[]`, `price`, `priceNote`, `note` — from `astro-sanity.md`, seeded from the two menus |
| `testimonial` | document | `quote`, `attribution`, `role` |
| `homePage` | singleton | `leadStory` (ref post), `latest` (refs, ordered; empty → 3 newest), `featuredPost` (ref), `interiorsHeadline/intro`, `stylingHeadline/intro`, `testimonial` (ref), `studioHeadline`, `studioBody`, `studioPortrait`, `pillars[]`, `inquiryHeadline/intro/note` |
| `siteSettings` | singleton | `tagline`, `footerTagline`, `nav[]` {label, href}, `footerColumns[]`, `email`, `phone`, `instagram`, `inquiryNotifyEmail` |
| `inquiry` | document (read-only in Studio) | `name`, `email`, `phone`, `interest`, `message`, `receivedAt` — written by the Pages Function; Studio shows an "Inquiries" inbox list |

Studio structure: `Home`, `Site settings` (singletons pinned at top), `Journal`, `Service packages`, `Testimonials`, `Inquiries`. Studio title "Styling OC".

Image pipeline: `@sanity/image-url` with `.fit('crop').auto('format')`, widths via `srcset` (640/1024/1600/2200), never `sharpen`/`saturation`. Hotspot/crop enabled on every image field so editors control the crop.

## Data layer (`src/lib/sanity.ts`)
- `sanityClient` from `sanity:client` (useCdn true, apiVersion pinned to build date).
- `loadQuery({query, params})` — thin wrapper today (published perspective), shaped like the sanity-astro `loadQuery` so Visual Editing can be switched on later without touching pages.
- GROQ: `homeQuery` (homePage + dereferenced posts/packages/testimonial + settings), `postBySlugQuery`, `allPostSlugsQuery`, `relatedPostsQuery`.
- Build fails loudly if `homePage` or `siteSettings` is missing (seed must have run).

## Cloudflare wiring
- **Pages project**: root `site/`, build `npm run build`, output `dist/`. Env: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_WRITE_TOKEN` (function only).
- **Rebuild on publish**: Cloudflare Pages *deploy hook* URL → Sanity *webhook* (Manage → API → Webhooks, trigger on create/update/delete of `post|homePage|siteSettings|servicePackage|testimonial`). Documented in `site/README.md` with screenshots-free step list; the code side needs nothing.
- **Inquiry function** `functions/api/inquiry.ts`: validates fields, honeypot field, creates an `inquiry` document via `@sanity/client` with `SANITY_WRITE_TOKEN`, returns 303 to `/?sent=1#inquiry`; the form shows a "Thank you" state from the query param (no JS required). Email notification (Resend/MailChannels) is a listed follow-up, not v1.
- Studio at `/studio` uses `studioRouterHistory: 'hash'` (required with static output). CORS origin for the Pages domain + `localhost:4321` added in Sanity manage.

## Seed content (`sanity/seed/seed.ts`, run once with the write token)
- 8 `servicePackage` docs verbatim from the two menus (interiors 01–05 + evening consultation; styling 01–03).
- 2 `testimonial` docs (Virra, Emily — verbatim, trimmed).
- 3 `post` docs:
  1. *The art of personal style* — styling; brand-sheet copy verbatim ("Style is more than what you wear…"), "The design touch" list as a block, Emily quote block.
  2. *A Newport Coast living room, reconsidered* — interiors; `interior-living-marble.jpeg` lead, `interior-pool-view.jpeg` wide image block, `serviceCallout` → Full-Service package; body prose is mine → `draftNote` set.
  3. *Meet Emily* — styling; "Emily came to us during a season of transition…" verbatim + quote; portrait → Placeholder (no usable Emily photo).
- `homePage` + `siteSettings` singletons with the copy above; founders portrait = `founders-denim.jpeg`.
- Images uploaded from `public/images` through the client's `assets.upload`.

## Implementation steps

1. `git init` at repo root; `.gitignore` (node_modules, dist, `.env`, `.astro`).
2. Scaffold `site/` (`npm create astro@latest -- --template minimal`), add `@sanity/astro @astrojs/react astro-portabletext @sanity/image-url @fontsource-variable/archivo`. `output: 'static'`.
3. Copy tokens/fonts/images from the DS; `global.css`; `Base.astro` with `<head>` (title/description/OG from settings, font preloads, theme-color).
4. Port primitives (Button, TextLink, Eyebrow, Rule, Plate, Placeholder, Reveal) → then Masthead + SiteFooter → verify in the browser at 1440 / 1024 / 390.
5. `npx sanity init` inside `site/` (user logs in once) → schemas → `sanity.config.ts` with structure + singletons → `/studio` loads.
6. Data layer + seed script; run seed; confirm docs in Studio.
7. Home sections in order (LeadStory, StoryGrid, ServiceLines, SplitFeature, PullQuote, StudioBlock, InquiryForm).
8. Post page + PortableText renderers + related grid; Journal index.
9. `functions/api/inquiry.ts` + thank-you state; test locally with `npx wrangler pages dev dist`.
10. `README.md`: Cloudflare Pages setup, env vars, deploy-hook ↔ webhook steps, how the client edits (with the Studio URL), how to add a post.
11. Accessibility + brand pass (below), then commit.

## Verification

- `npm run build` clean; `npm run preview`, open with Chrome DevTools MCP at 1440×900, 1024×768, 390×844: no horizontal scroll, masthead collapses on scroll, mobile menu opens/closes with keyboard, reveal fades run once and are disabled under `prefers-reduced-motion` emulation.
- Lighthouse (DevTools MCP) on `/` and one post: Accessibility ≥ 95, Performance ≥ 90 (static + no React on public pages), Best Practices ≥ 95.
- Contrast spot-check against DS numbers: no `--accent` (#9C7C4A) on text < 24px; no `--ink-faint` on anything but 9px captions; focus ring visible on every link/field/button by tabbing through home.
- Brand audit of the rendered pages against `readme.md`: no radius, no shadows, no boxed cards, no text over images, one filled CTA per page, sentence-case headlines, prices stated in full, no emoji/icons.
- Studio: log in at `/studio`, edit the lead-story standfirst, publish, confirm the local dev server (which fetches live) reflects it; confirm the inquiry function creates an `inquiry` doc and the form shows the thank-you state.
- Cloudflare (after the user connects the repo): one manual deploy, then one Studio publish triggers a rebuild via the hook.

## Out of scope (listed for the follow-up round)
Interiors / Personal Styling service pages (`ServiceMenu` + `ServiceTier`), Projects index + `BeforeAfter`, The Studio page, night-theme evening-consultation band, Visual Editing (Presentation tool; needs on-demand rendering), inquiry email notifications, newsletter capture, real project photography.
