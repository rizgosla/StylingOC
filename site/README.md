# Styling OC — website

Editorial site for Styling OC (interior design + personal styling, Orange County).
Astro static site, content in Sanity, hosted on Cloudflare Pages. The design tokens
and rules come from `../Styling OC Design System/` — that folder is the source of truth
for type, colour and spacing; `src/styles/tokens/` is a verbatim copy.

```
site/
├─ src/pages/            index.astro (Home), journal/index.astro, journal/[slug].astro
├─ src/components/       Astro ports of the design-system components (no React on public pages)
├─ src/lib/sanity.ts     data layer: GROQ queries + local fallback
├─ src/styles/           tokens (copied from the design system) + global.css
├─ sanity/schemas/       the content model editors see in Studio
├─ sanity/seed/          content.ts (seed + local fallback) and seed.ts (writes it to Sanity)
├─ functions/api/        Cloudflare Pages Function that stores inquiries
└─ sanity.config.ts      Studio config; the Studio is served at /studio
```

## Run it locally

```sh
npm install
npm run dev          # http://localhost:4321
```

With no `.env` the site renders from `sanity/seed/content.ts`. That is deliberate: the
design can be built and reviewed before the CMS exists. Once `PUBLIC_SANITY_PROJECT_ID`
is set, everything is read from Sanity and the Studio appears at `/studio`.

## Connect Sanity (one time)

1. `npx sanity login` (opens a browser) then, from this folder:
   `npx sanity init --bare --create-project "Styling OC" --dataset production`
   — copy the printed project id.
2. Copy `.env.example` to `.env` and fill in `PUBLIC_SANITY_PROJECT_ID`.
3. In [sanity.io/manage](https://www.sanity.io/manage) → the project → **API**:
   - **CORS origins**: add `http://localhost:4321` and the production URL (with credentials).
   - **Tokens**: create an *Editor* token, put it in `.env` as `SANITY_WRITE_TOKEN`.
4. `npm run seed` — uploads the five photographs and writes the packages, testimonials,
   three Journal posts, Home and Site settings. Safe to re-run.
5. `npm run dev` → open `http://localhost:4321/studio` and log in.

## Deploy on Cloudflare

The dashboard's default flow (Workers & Pages → Create → connect a Git repository) creates a
**Worker**. `wrangler.jsonc` in this folder is set up for it: the Astro build in `dist/` is
served as static assets and `worker/index.ts` handles `POST /api/inquiry`.

| Setting | Value |
| --- | --- |
| Path (root directory) | `site` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Variables and secrets | `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET=production`, `PUBLIC_SITE_URL=https://<your-domain>`, `SANITY_WRITE_TOKEN` (encrypt it — used only by the inquiry function) |

The same repository also works as a classic **Pages** project (root `site`, build
`npm run build`, output `dist`): there the `functions/` folder is picked up automatically and
`POST /api/inquiry` becomes a Pages Function. Either way the form validates, stores an
`inquiry` document in Sanity (visible under **Inquiries** in the Studio) and redirects back to
`/?inquiry=sent#inquire`.

### Rebuild when the client publishes

1. Cloudflare Pages → the project → **Settings → Builds & deployments → Deploy hooks** →
   create one (e.g. "Sanity publish") and copy its URL.
2. sanity.io/manage → the project → **API → Webhooks → Create webhook**:
   URL = the deploy hook, trigger on **Create, Update, Delete**, filter
   `_type in ["post","homePage","siteSettings","servicePackage","testimonial"]`,
   HTTP method POST. Projection can stay empty.

From then on, pressing **Publish** in the Studio rebuilds the site; it is live in about a
minute.

## How the client edits the site

Open `https://<your-domain>/studio` and sign in.

- **Home** — pick the lead story, the three "latest" stories and the feature story; edit the
  service intros, the studio paragraphs and portrait, the inquiry copy.
- **Journal** — add a post: title, standfirst, one-line grid text, lead photograph (with alt
  text), category, date, and the body. The body offers paragraphs, one heading level, lists,
  photographs (column / wide / full), pull quotes and a service callout. There are no colour,
  font or spacing controls by design. Leave the *Draft note* filled while a story is being
  reviewed — the page shows a small "Draft — for client review" line and stays out of search
  engines until it is cleared.
- **Service packages** — the two menus; prices are copy and should be stated in full.
- **Testimonials** — client words, verbatim, first name only.
- **Site settings** — navigation, footer columns, taglines, email / phone / Instagram.
- **Inquiries** — read-only inbox of form submissions.

Design rules the components enforce (from the design system): white ground, softened black
ink, one brass accent used for numerals, eyebrows, short rules and a single filled button per
page; no radius, no shadows, no boxes; photographs are captioned plates and never carry
headlines; slow fades only.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Astro dev server (+ Studio at `/studio` when Sanity is configured) |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm run check` | `astro check` — type-checks `.astro` files |
| `npm run seed` | Write `sanity/seed/content.ts` to the Sanity dataset |
| `npm run pages:dev` | Serve `dist/` through Wrangler so `/api/inquiry` runs locally (needs `.dev.vars` with the Sanity vars) |

## Not in this version

Interiors / Personal Styling pages with the full menus, a Projects index with before/after,
The Studio page, the night-theme evening-consultation band, click-to-edit Visual Editing,
email notifications for inquiries.
