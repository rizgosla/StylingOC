# Styling OC — Design System

Styling OC is a luxury interior design and personal styling studio in Orange County, California, run by two founders, **Jenn and Merlyn**. Two connected service lines share one studio and one point of contact:

1. **Interior design** — full-service residential design, remodels, e-design and turnkey furnishing, interior and exterior. Works closely with real-estate agents on pre-listing makeovers and post-purchase transformations. Packages run from a `$500/hour` consultation to `$50,000–$250,000` turnkey.
2. **Personal styling** — wardrobe editing, sourcing and full image direction for the same clientele. Three tiers: The Style Edit (`$500/hour`), The Concierge (`$5,000`), The Image Experience (`$10,000`).

Positioning: **"Design that feels like home."** (interiors) and **"Style that empowers. Confidence that lasts."** (styling). Pillars: *Vision · Intention · Beauty · Balance.*

Reference direction, set by the client: **Architectural Digest**. Editorial, not corporate — a magazine that happens to sell services.

## Sources

Everything here is derived from nine client-supplied files (originals kept in `uploads/`, working copies in `assets/`):

- `assets/collateral/interior-services-menu.png` — the printed interior design services menu (packages 01–05, evening consultation). Source of the numeral treatment, the display wordmark, the tier copy and the "Thoughtful design. Personalised spaces. Timeless living." footer line.
- `assets/collateral/personal-styling-menu.png` — personal styling experiences menu (options 01–03). Note: this one is set in a grotesque sans, off-brand relative to the rest; the serif treatment in this system is the correct direction.
- `assets/collateral/brand-sheet-home.png` — brand sheet with the stacked wordmark, the "A thoughtful collaboration…" triplet, the pillars row and Virra's testimonial.
- `assets/collateral/brand-sheet-personal-style.png` — "The Art of Personal Style" sheet: drop-cap editorial body, "The Design Touch" list, Emily's testimonial on an espresso ground.
- `assets/images/*` — founder portraits (studio, warm, denim) and two interior photographs.

No codebase, Figma file, or font binaries were provided. No logo file was provided — see *Iconography*.

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | Global entry point — `@import` list only. Link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `elements.css` |
| `components/` | 15 React primitives, grouped by concern (below) |
| `explorations/` | The three type-and-colour directions and the six accent candidates the studio chose from |
| `guidelines/` | Foundation specimen cards + `astro-sanity.md` (three build options and the Sanity content model) |
| `assets/` | Photography and client collateral |
| `SKILL.md` | Agent-Skills wrapper for use outside this project |

## Components

Grouped by concern. Each has a sibling `.d.ts` (props contract) and `.prompt.md` (when to use it).

**core/** — `Button`, `TextLink`, `Eyebrow`
**navigation/** — `SiteNav`, `SiteFooter`
**editorial/** — `EditorialHero`, `SplitFeature`, `PullQuote`, `FounderBio`
**services/** — `ServiceMenu`, `ServiceTier`
**projects/** — `BeforeAfter`, `ProjectCard`, `ProjectIndex`
**forms/** — `InquiryForm`

The inventory comes from the brief's component list, one-to-one. Intentional additions: `Eyebrow` (the wide-tracked label appears on every supplied piece of collateral and was being hand-rolled in four places), `TextLink` (the brief names "buttons and links" as one family; they are split because the link is the default and the button is the exception), and `ServiceMenu` (the container that holds `ServiceTier` panels in the three-column printed-menu grid).

## Content fundamentals

**Voice.** Warm, plain, unhurried. Confident without selling. The studio speaks as **we**; the client is **you**. Never "our team" — there is no team, there are two people, and that is the pitch.

**Casing.** Sentence case for everything editorial, including headlines: "Design that feels like home." Title Case for package names, which are proper nouns: "Turnkey Interior Design Package", "The Image Experience". UPPERCASE with wide tracking for eyebrows, nav, captions, prices and the tagline — never for a sentence longer than about eight words.

**Sentence shape.** Short declaratives, often fragments, sometimes a triplet:

> A thoughtful collaboration. A beautiful transformation. A friendship that lasts.

> Thoughtful design. Personalised spaces. Timeless living.

> Elevated style · Personalised experience · Confidence

**Prices are copy, not fine print.** State them plainly and completely, with the qualifier attached: "`$50,000 – $250,000` for an entire home (depending on square footage and design consideration)". Never "starting at", never "investment", never a hidden price.

**Package descriptions** follow the collateral's pattern: a "what's included" list of 3–6 noun phrases, then one italic line of benefit — "A focused refresh designed to make your existing wardrobe work beautifully."

**Testimonials** are used verbatim and attributed by first name only (Virra, Emily). Trim to a single held thought; never paraphrase.

**No emoji** in system copy. (Emily's own testimonial on the source brand sheet ends with two emoji — client words stay as written, studio words do not use them.) No exclamation marks in studio voice. No "elevate your space", no "dream home", no "let's chat", no urgency, no scarcity, no CTA stacking. One call to action per screen.

**Editorial verb, not sales verb:** "Begin an inquiry", "See how we work", "Read the project", "Request the partner sheet".

## Visual foundations

**Direction.** Chosen from three built candidates (see `explorations/`): high-contrast Didone on pure white, with all-caps sans labels and a tight grid. The reference is *Architectural Digest* — masthead-scale display type, white ground, full-bleed photography with a tiny caption underneath, and density rather than airiness.

**Palette.** The page is **pure white** `#FFFFFF`. Type is a **softened black** `#252321` — pure black was cut deliberately; body copy sits at `#3D3A36`. Off-whites (`#FAF9F7`, `#F2F0EC`) are for panels and inset blocks only, never for a whole section. A single accent — **antique brass** `#9C7C4A`, carried over from the printed menus — touches only the tier numerals, eyebrow labels, rules under 44px, and one filled CTA per screen. It never fills a section and never carries body copy. Six accent candidates were compared in situ before this one was chosen; the alternates (flag red, cobalt, bottle green, clay, oxblood) are kept in `explorations/accent-options.html`.

**Night theme.** `:root[data-theme="night"]` is a dark editorial spread, not an inverted UI: a near-black `#141414` ground, warm paper ink `#F5F3EF`, the brass lifting to `#C2A164` to stay legible, rules at 20% opacity. Used for the evening-consultation callout and full-width testimonials. Dark sections are black — never a darkened version of the accent.

**Type.** **Zodiak** (Indian Type Foundry, supplied by the studio under the Fontshare Free Licence — files in `assets/fonts/`) carries every headline and the wordmark, at masthead scale (up to 136px) with −0.02em tracking and 0.98 leading. Headlines set at **weight 400 — confirmed by the studio as the display setting** — the wordmark at 500, and the italic at 300 is the testimonial and signature voice. Unlike Bodoni Moda it has no optical-size axis, so one drawing holds from 9px to 136px. **Archivo** carries everything else. Standfirsts are the AD move: a small all-caps sans line at 13px / 0.06em under a large serif headline — not an italic serif subline. Labels are 9px and 11px at 0.34–0.42em tracking; wide tracking does the work, so the sizes stay tiny. Body copy is 15px at weight 300, leading 1.8, measure capped at 64 characters.

**Numerals.** Service tiers are numbered 01–06 in Bodoni, brass, always two digits. The one element carried directly from the printed menus; it also numbers project cards in the index.

**Structure.** A tight 12-column grid: gutter `clamp(18px, 4vw, 64px)`, grid gap `clamp(14px, 1.6vw, 26px)`, page max 1560px. Content spans 3, 5, 6 or 9 columns and offsets — never tidy halves or thirds. Section padding is `clamp(56px, 7vw, 120px)`: roughly half the previous scale, because the AD reference is dense, not airy.

**Rules instead of boxes.** Three weights carry all structure: a full-black rule opens a section, a 45% rule marks inputs and hover, an 18% hairline divides columns and captions. There are no cards, no border boxes, no shadows — inner or outer — and **nothing in the system has a radius**, buttons included. Where a boundary is needed it is a rule; where separation is needed it is a column division.

**Photography.** Full-bleed, square-cornered, and the hero of every page. Warm, sunlit, un-filtered: bouclé, honed marble, white oak, blackened steel, California light. Portraits sit against neutral studio grounds. Headlines sit directly on the image, centered, over a bottom-weighted scrim (`--overlay-scrim`, plus `--overlay-band` under the text column) that keeps white type above 4.5:1 on the brightest photograph — never in a floating panel. Captions sit immediately below the image at 9px, wide-tracked, in `--ink-faint`.

**Transparency and blur** appear almost nowhere: the hero scrim, and a 2px backdrop blur on the before/after handle so it reads over both frames. No frosted panels.

**Motion.** Slow fades only. Reveals are a 700ms fade with an 8px rise on `cubic-bezier(.22,.61,.36,1)`; link underlines draw left-to-right in 280ms on `cubic-bezier(.65,0,.35,1)`. **Parallax has been removed** (`--parallax-shift: 0%`) — the studio chose fades only. No bounce, no spring, no scale, no rotation, no card lift. All durations collapse to 0 under `prefers-reduced-motion`.

**Hover states.** Links draw their underline to full opacity in brass. The outline button inverts (transparent → black fill, black → white text). Project images drop to 86% opacity and their metadata rule darkens from 18% to 45%. Nothing moves position, nothing scales.

**Press states.** No transform. Buttons deepen (black → `--ink-700`); links hold the drawn underline. Focus is a 1px brass outline at 3px offset.

**Layout fixtures.** The nav is the only fixed element: transparent over a hero, solidifying to white with a hairline bottom rule after 24px of scroll. No sticky CTAs, no cookie bars in mock-ups, no floating buttons.

**Accessibility is a hard rule.** Every element in this system must meet WCAG 2.1 AA — no exceptions, and it outranks aesthetic preference (see `CLAUDE.md`). Text ≥ 4.5:1, large text and non-text boundaries ≥ 3:1, focus always visible, hit targets ≥ 44px, motion honouring `prefers-reduced-motion`, real labels on every field, alt text on every image, and never meaning by colour alone.

Measured: ink on white is 15.4:1; `--ink-muted` 11.2:1; `--ink-faint` 3.4:1 (9px captions only — never a sentence). Brass on white measures **3.9:1 and fails at body size** — this is why the accent is documented as numerals, rules and marks 24px and above, plus the filled CTA at 11px uppercase. Every accent *label*, link and eyebrow uses `--accent-strong` (`#7E6238`, 5.6:1) or `--accent-deep` (`#65502F`, 7.9:1). Never the accent for body copy.

**Breakpoints.** Mobile-first, three stops: `≤640px` (single column, gutter 18px, section-y 56px, offsets removed, split features stack image-first, service tiers fall back to `layout="row"`, hero headline drops to `--text-display-m`), `641–1024px` (8-column grid, offsets halved, service menu drops to two columns), `≥1025px` (full 12-column asymmetry, three-column menus). The editorial offsets must be reconsidered, not scaled — a column stagger becomes 0 and the rhythm is carried by section padding instead.

## Iconography

**There is effectively none, and that is the rule.** Nothing in the supplied collateral uses an icon system: no icon font, no SVG set, no PNG glyphs. The pieces are built from type, hairline rules and photography. The only non-letterform marks in the source material are:

- a **thin crescent moon** beside the "Evening Design Consultation" line on the interior menu (the one decorative glyph in the brand);
- the **oversized serif quotation mark** opening every testimonial — set in Bodoni, in brass, at 5.5rem;
- **em dashes and mid-dots** (`·`) as list markers and separators, in place of bullets or check icons.

So: no icon library is linked, and none should be added. If a future surface genuinely needs a glyph (a play arrow, an external-link mark), draw it as a 1px-stroke Unicode character or a hairline SVG matching the rule weight — and add it here. **Do not** introduce Lucide, Heroicons, Font Awesome, or emoji: circular icons and filled glyphs are exactly the SaaS-template signal this brand avoids.

**Logo.** No logo file was supplied and none has been drawn. The wordmark is *set type* — two approved lockups, both in `guidelines/type-wordmark.card.html`: "STYLING OC" in Bodoni at 0.1em tracking with an all-caps sans tagline beneath (used on collateral and the centered nav), and a stacked "Styling / OC" ranged left (used on brand sheets and interior pages). If the studio has a real mark, send the vector and it should replace both.

## Substitutions to confirm

- **Display serif**: resolved. Zodiak is supplied by the studio and loaded locally from `assets/fonts/` — no substitution.
- **Label / body sans**: Archivo stands in for the wide-tracked grotesque on the menus (likely Futura or Founders Grotesk).
- Fonts currently load from Google Fonts via `@import` in `tokens/fonts.css`; there are no local font binaries in the project.
