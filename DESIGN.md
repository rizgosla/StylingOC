---
name: Styling OC
description: An editorial spread on white: masthead-scale Zodiak, captioned photographic plates, three hairline weights and one antique-brass accent.
colors:
  antique-brass: "#9C7C4A"
  brass-strong: "#7E6238"
  brass-deep: "#65502F"
  brass-lift: "#C2A164"
  ink: "#252321"
  ink-muted: "#3D3A36"
  ink-faint: "#8E8A84"
  white: "#FFFFFF"
  paper-50: "#FAF9F7"
  paper-100: "#F2F0EC"
  paper-200: "#E7E4DE"
  rule-hairline: "rgba(37,35,33,0.18)"
  rule-strong: "rgba(37,35,33,0.45)"
  night-ground: "#141414"
  night-ink: "#F5F3EF"
typography:
  display-xl:
    fontFamily: "Zodiak, Didot, Times New Roman, serif"
    fontSize: "clamp(3.75rem, 9vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  display-l:
    fontFamily: "Zodiak, Didot, Times New Roman, serif"
    fontSize: "clamp(3rem, 6vw, 5.75rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  display-m:
    fontFamily: "Zodiak, Didot, Times New Roman, serif"
    fontSize: "clamp(2.25rem, 3.8vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  display-s:
    fontFamily: "Zodiak, Didot, Times New Roman, serif"
    fontSize: "clamp(1.5rem, 2.2vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo Variable, Archivo, Founders Grotesk, Helvetica, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "0.005em"
  italic:
    fontFamily: "Zodiak, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: "0.005em"
  standfirst:
    fontFamily: "Archivo Variable, Archivo, Founders Grotesk, Helvetica, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 300
    lineHeight: 1.75
    letterSpacing: "0.06em"
  body:
    fontFamily: "Archivo Variable, Archivo, Founders Grotesk, Helvetica, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 300
    lineHeight: 1.8
    letterSpacing: "0.005em"
  label:
    fontFamily: "Archivo Variable, Archivo, Founders Grotesk, Helvetica, Arial, sans-serif"
    fontSize: "0.5625rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.34em"
  label-l:
    fontFamily: "Archivo Variable, Archivo, Founders Grotesk, Helvetica, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.34em"
  numeral:
    fontFamily: "Zodiak, Didot, Times New Roman, serif"
    fontSize: "1.625rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  none: "0px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "20px"
  space-6: "28px"
  space-7: "40px"
  space-8: "56px"
  space-9: "80px"
  space-10: "112px"
  section-y: "clamp(64px, 8vw, 144px)"
  section-y-tight: "clamp(44px, 5vw, 88px)"
  gutter: "clamp(18px, 6.5vw, 150px)"
  grid-gap: "clamp(14px, 1.6vw, 30px)"
  column-gap: "clamp(24px, 2.4vw, 40px)"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label-l}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
    height: "44px"
  button-solid-hover:
    backgroundColor: "{colors.ink-muted}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-l}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  button-accent:
    backgroundColor: "{colors.brass-strong}"
    textColor: "{colors.white}"
    typography: "{typography.label-l}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
    height: "44px"
  button-accent-hover:
    backgroundColor: "{colors.brass-deep}"
    textColor: "{colors.white}"
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-l}"
    rounded: "{rounded.none}"
    padding: "0 0 5px 0"
    height: "24px"
  text-link-hover:
    textColor: "{colors.brass-strong}"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px 0"
    height: "44px"
  eyebrow:
    textColor: "{colors.brass-strong}"
    typography: "{typography.label}"
  caption:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    padding: "12px 0 0 0"
---

# Design System: Styling OC

## Overview

**Creative North Star: "The Editorial Spread"**

Styling OC is set like a magazine, not built like a website. The client-set reference is Architectural Digest: a masthead-scale serif on a pure white ground, photographs presented as captioned plates rather than as backdrops, structure carried by hairline rules instead of boxes, and a page that is dense rather than airy. The set-type wordmark "STYLING OC" opens every page between a black rule and a hairline, and the same masthead closes it. Everything the reader meets between those two rules is type on white with a photograph beside it.

The system runs on two families and one accent. Zodiak carries every headline, numeral and the italic voice at a single weight (400, with the wordmark at 500 and the italic at 300); Archivo carries labels, standfirsts, body and every button. Tiny wide-tracked uppercase labels (9px and 11px at 0.34em) do the work that colour and icons would do elsewhere. The one accent, Antique Brass, arrived from the studio's printed menus and is rationed: numerals, drawn underlines, the required-field asterisk, the one "Inquire" item in the nav, and the one filled call to action a screen is allowed. Text-sized brass always steps down to Brass Strong so it clears AA.

Confirmed rejections, all of them visible in the shipped code: no headlines over photographs, no scrims or overlays, no cards or boxes, no shadows, no radius anywhere, no icons or emoji, no parallax. Motion is a slow fade and an 8px rise, once, and nothing else.

**Key Characteristics:**
- Type on white; every photograph is a square-cornered plate with a 9px caption beneath, never a background.
- Masthead-weighted modular type ramp (Zodiak display up to 136px, ratio ~1.32) over a 15px / 300-weight Archivo body.
- Three rule weights carry all structure: black opens, 45% marks inputs and hover, 18% divides.
- One accent, rationed by size: Antique Brass for marks 24px and up, Brass Strong for any text.
- Dense editorial grid: 12 asymmetric columns, hairlines drawn in the gaps, gutters that widen to 150px.
- Flat, unrounded, iconless; hover draws a brass underline and nothing moves.

## Colors

A white page, a softened black ink, three warm off-whites for insets, and a single antique brass held at three depths.

### Primary
- **Antique Brass** (`antique-brass`): the studio's brass, carried from the printed menus. On the shipped site it colours only large or non-text marks: the two-digit tier and story numerals, the drawn hover underline on every link, the oversized quotation mark, the active nav underline. It measures 3.9:1 on white, so it never sets text under 24px.
- **Brass Strong** (`brass-strong`): the text-safe brass (5.6:1). Eyebrows, the "Inquire" nav link, link hover colour, the required-field asterisk, the price label, the focus ring, the input focus underline, and the fill of the accent button.
- **Brass Deep** (`brass-deep`): the darkest brass (7.9:1). The accent button's hover fill; otherwise held in reserve for accent text that needs more contrast.
- **Brass Lift** (`brass-lift`): the night-theme accent. Under `[data-theme="night"]` it replaces Antique Brass so the accent stays legible on the near-black ground.

### Neutral
- **Ink** (`ink`): the darkest value in the system; pure black was cut deliberately. Headlines, wordmark, labels, the black rule, the solid button and the outline button's hover fill. 15.4:1 on white.
- **Ink Muted** (`ink-muted`): body copy, deks, captions, muted eyebrows, the solid button's hover fill. 11.2:1; captions were moved here from Ink Faint so 9px text still clears AA.
- **Ink Faint** (`ink-faint`): defined for the night theme's muted text; on the day theme it appears nowhere at text size. 3.4:1, so never a sentence.
- **White** (`white`): the page. The whole page, not a container.
- **Paper 50 / 100 / 200** (`paper-50`, `paper-100`, `paper-200`): warm off-whites. Paper 100 is the ground under every plate while it loads and the square product ground behind service photographs; Paper 200 is the text-selection colour. Never a whole section.
- **Rule Hairline** (`rule-hairline`): ink at 18%. Column dividers, the line under the masthead tagline, the resting underline on story-card rules, the line between menu items.
- **Rule Strong** (`rule-strong`): ink at 45%. Input underlines, the outline button's border, the short attribution rule on a pull quote, the story-card rule on hover.
- **Night Ground / Night Ink** (`night-ground`, `night-ink`): the dark editorial spread. Tokenised and complete in the stylesheet, not yet placed on a shipped surface.

### Named Rules
**The Type-on-White Rule.** Text sits on white (or on a paper inset), never on a photograph. There are no scrims, overlays or bands; a headline that needs an image gets a plate beside or above it, not behind it.

**The Brass-at-Size Rule.** Antique Brass (#9C7C4A) is for numerals, rules, underlines and marks 24px and larger. Any brass text under 24px, including every eyebrow, label and link, uses Brass Strong (#7E6238) or Brass Deep (#65502F). Brass never fills a section and never carries body copy.

**The One Filled CTA Rule.** A screen may carry at most one filled button, and the default call to action is a text link with a drawn underline. On the shipped home page the count is zero: the inquiry submit is a text link, and the only brass in the navigation is the "Inquire" label.

## Typography

**Display Font:** Zodiak (with Didot, Times New Roman, serif)
**Body Font:** Archivo Variable (with Archivo, Founders Grotesk, Helvetica, Arial, sans-serif)
**Label Font:** Archivo Variable, uppercase and wide-tracked
**Italic Voice:** Zodiak Italic at weight 300

**Character:** A high-contrast serif at masthead scale, drawn once at every size because Zodiak has no optical axis, against a light grotesque that stays small and lets tracking do the work. The pairing reads as a magazine department page: a large serif headline, a tiny all-caps sans standfirst beneath it, a 15px light body.

### Hierarchy
- **Display XL** (400, `clamp(3.75rem, 9vw, 8.5rem)`, 0.98): the masthead register, up to 136px. Reserved for page-scale statements; the shipped home page uses Display L and below.
- **Display L** (400, `clamp(3rem, 6vw, 5.75rem)`, 0.98, -0.02em): section headlines (the styling menu title, the feature story title) and the footer wordmark at 500 with 0.1em tracking.
- **Display M** (400, `clamp(2.25rem, 3.8vw, 3.5rem)`, 1.08): the studio and inquiry headlines, the large pull quote, and the masthead wordmark at 500 with 0.1em tracking and uppercase.
- **Display S** (400, `clamp(1.5rem, 2.2vw, 2rem)`, 1.15): story-card titles, the small-screen menu items, the "Thank you." confirmation.
- **Numeral** (400, 1.625rem, 1, 0.02em): two-digit brass numerals ("01") above story cards and beside menu items; the service menu enlarges the same face to `clamp(1.5rem, 2.6vw, 2.875rem)` at weight 300.
- **Title** (300, 1.1875rem, 1.6): the lede paragraph beside a feature plate or under a menu title, in Archivo, often under a Zodiak drop cap (3.6em, floated).
- **Italic** (300, 1.1875rem, 1.55): the Zodiak italic voice for the studio lede, the service benefit line and testimonials; pull quotes scale it to Display M and Display S.
- **Standfirst** (300, 0.8125rem, 1.75, 0.06em, uppercase): the AD line under a serif headline; also the price label size.
- **Body** (300, 0.9375rem, 1.8, 0.005em): running copy in Ink Muted, measure capped at 64ch (narrow: 40ch). Body S is 0.8125rem at 1.75 for deks and notes.
- **Label** (400, 0.5625rem, 0.34em, uppercase): eyebrows, captions, the masthead and footer tagline (0.42em), the compact-bar nav.
- **Label L** (400, 0.6875rem, 0.34em, uppercase): navigation, buttons, text links, the "Menu" button.

### Named Rules
**The Wide-Tracked Tiny Label Rule.** Labels are 9px or 11px, uppercase, tracked at 0.34em to 0.42em, and never larger. Hierarchy comes from tracking and case, not from size or weight.

**The Standfirst Rule.** The line under a serif headline is a small all-caps sans at 13px and 0.06em, never an italic serif subline. The italic is reserved for quotations, ledes and benefit lines.

## Layout

The page is the full viewport width (`--max-page: none`) with gutters that grow from 18px to 150px (`clamp(18px, 6.5vw, 150px)`), so at 1900px the content sits inside generous margins without a boxed container. Inside the gutters a 12-column grid with a `clamp(14px, 1.6vw, 30px)` column gap and a 28px row gap carries every section. Content spans offset, asymmetric runs, never tidy halves: the feature plate takes columns 2 to 6 with its text in 7 to 11 and column 12 empty; the studio text sits in columns 3 to 6 against a plate in 7 to 11; the inquiry intro takes 1 to 4 and the form 6 to 12. Three-across story and service grids use equal columns with a `calc(column-gap * 2)` gap and a hairline drawn absolutely in each gap, so every plate is the same width and the divider never steals column space.

Vertical rhythm is deliberately dense. Sections pad `clamp(64px, 8vw, 144px)` (`section-y`) or `clamp(44px, 5vw, 88px)` (`section-y-tight`); the closing story grid trims to 67% of the tight value because the pinned section below brings its own lead. Inside sections the spacing scale (4, 8, 12, 16, 20, 28, 40, 56, 80, 112px) does the work, with 12px between a plate and its caption, 20 to 28px between stacked text blocks, and 56 to 80px between stacked cards on small screens. Body measure is 64ch; ledes 36 to 44ch; headlines are balanced at 12 to 14ch.

The lead is "the stage": a 16:9 plate in the centre column with three 3:4 plates down each side sharing its exact height (stage width = 32(W - gap)/41 of the row), and the eyebrow, headline, standfirst and link centred beneath it on one axis with 8px gaps. The masthead is in flow: black rule, centred wordmark, 9px tagline, hairline, centred nav row, hairline. A compact fixed bar (wordmark left, links right, hairline-black bottom rule) slides down over 560ms once the reader has scrolled past the masthead; it is the only fixed element, and it is white, never transparent.

Breakpoints are three: at or below 640px the grid becomes one column, the stage's right rail disappears and the left rail becomes a row of three, the nav collapses to a "Menu" text button that opens a full-height white panel with numbered Display S links, and hairline dividers move from the gaps to `border-top` on stacked items; 641 to 1024px runs an 8-column grid with halved offsets and two-across grids where the third item drops full-width under a hairline; 1025px and up is the full asymmetric twelve.

### Named Rules
**The Hairline-in-the-Gap Rule.** Column dividers are absolutely positioned hairlines drawn in the grid gap, not borders on the cells. Equal-width plates are the proof.

**The Dense-Not-Airy Rule.** Section padding tops out at 144px and row gaps at 28px. Air comes from the gutters and the measure, not from stacking empty space between sections.

## Elevation & Depth

The system is flat. There are no shadows, no inner shadows, no frosted or blurred panels, no tonal layering of surfaces, and no lifted states; the one `box-shadow` in the code is a zero-blur inset hairline used as a stroke on an empty plate frame, not an elevation. Depth is conveyed by three rule weights and by the plate itself: a photograph reads as an object on the page because it is square-cornered, edge-to-column, and captioned, not because it is raised. Hover never lifts: a story card's image drops to 86% opacity and its meta rule darkens from 18% to 45%; a link draws a brass underline; a button swaps fill. Focus is a 1px Brass Strong outline at 3px offset. Off-whites (Paper 100) mark an inset ground for a product photograph or a loading plate, never a panel with an edge.

### Named Rules
**The Three Rules Rule.** Structure is carried by exactly three rule weights, all 1px: a black rule (Ink) opens a section or the masthead; a 45% rule (Rule Strong) marks an input, the outline button's edge, a hovered card's meta line and a quotation's attribution; an 18% hairline (Rule Hairline) divides columns and captions. Where a boundary is needed it is a rule; where separation is needed it is a column division.

**The Flat Rule.** No element casts, receives or fakes a shadow, at rest or on hover. If a state needs emphasis it changes colour or draws a rule.

## Shapes

Nothing in the system has a radius: buttons, inputs, plates, the fixed bar and the menu panel are all square-cornered (`0px`, tokenised as `--radius-0` and `--radius-1`). Borders appear only as single 1px rules at one of the three weights, and only on one edge unless a rule opens and closes a block (the inquiry status message has a 45% top and an 18% bottom). Photographs are rectangular plates at fixed ratios (16:9 for the stage, 4:5 for stories and features, 3:4 for the stage rails, 1:1 grounds for service photographs) with `object-fit: cover` and a 9px caption 12px beneath. The recurring silhouette is a tall rectangle under a short line of small caps.

### Named Rules
**The Nothing-Rounded Rule.** Radius is 0px everywhere, including inputs and buttons. A rounded corner is the first sign that a surface has left the system.

**The Captioned Plate Rule.** Every photograph is a full-column, square-cornered plate with a 9px wide-tracked caption in Ink Muted beneath it. A plate never carries text on top, and while the photograph is missing the frame stays: Paper 100 ground, inset hairline, "Photograph to come".

## Components

The component feel is editorial and confident: the same hairline restraint everywhere, but the one filled CTA and the brass link underlines carry real presence.

### Buttons
- **Shape:** rectangular, no radius (`0px`), minimum height 44px, Label L uppercase at 0.34em, padding 14px 28px (small: 10px 18px at 9px; large: 18px 40px).
- **Outline (default):** transparent fill, 1px Rule Strong border, Ink text. Hover inverts to an Ink fill with white text and an Ink border.
- **Solid:** Ink fill, white text. Hover deepens to Ink Muted.
- **Accent:** Brass Strong fill with white text (Antique Brass would be 3.9:1); hover deepens to Brass Deep. This is the one filled CTA a screen may carry.
- **Hover / Focus / Active:** fills and borders cross-fade over 280ms on the editorial ease; active state is Ink Muted with white text; focus is the shared 1px brass outline at 3px offset. No transform, no shadow, no icon.

### Text Links
- **Style:** the default call to action. Label L uppercase in Ink, 5px bottom padding, minimum height 24px, a full-width hairline in `currentColor` at 24% opacity as the resting underline. An accent tone sets the label in Brass Strong; a `caps=false` form inherits the surrounding body size (used for the email and phone in the inquiry intro).
- **Hover / Focus:** a second hairline in Antique Brass draws from left to right to full width over 280ms on the rule ease, and the label turns Brass Strong. The inquiry submit button and the footer links carry the same underline locally.
- **Card title links:** the underline is drawn with a background-size gradient from 0 to 100% width rather than a pseudo-element, same brass, same 280ms.

### Plates
- **Corner Style:** square (`0px`).
- **Background:** Paper 100 while loading; the photograph fills at `object-fit: cover`.
- **Shadow Strategy:** none (see Elevation & Depth). The empty state carries an inset hairline stroke only.
- **Border:** none.
- **Caption:** Label, uppercase, 0.34em, Ink Muted, 12px below the frame; centred when the plate is height-fitted.

### Story Cards
- **Character:** not a card in the boxed sense; a vertical stack of brass numeral, plate, 18% rule, brass-strong kicker, Display S title and a Body S dek, with 16px between stack items and 12px inside the meta block.
- **Hover:** the plate fades to 86% opacity and the rule darkens to Rule Strong over 280ms; the title draws its brass underline. Nothing moves.
- **Grid:** three across with hairlines in the gaps, staggered reveal at 90ms per card.

### Inputs / Fields
- **Style:** underline only. Transparent background, no side or top border, a 1px Rule Strong bottom rule, 10px vertical padding, minimum height 44px, Body type in Ink. Labels are muted eyebrows (Label, Ink Muted) with a Brass Strong asterisk for required fields. Fields pack into a three-column grid with 28px row and `column-gap` column spacing so the form reads as one block of type.
- **Focus:** the bottom rule turns Brass Strong; keyboard focus adds the 1px brass outline at 3px offset.
- **Error / Sent:** a status block between a Rule Strong top and a hairline bottom; the error variant turns its top rule Brass Strong. Invalid fields carry `aria-invalid`; no red, no icon.
- **Submit:** a text link, not a filled button.

### Navigation
- **Masthead (in flow):** black rule, "STYLING OC" in Zodiak 500 at Display M with 0.1em tracking, uppercase, centred; a 9px tagline at 0.42em beneath; hairline; a centred row of Label L links with 44px hit height; hairline.
- **Link states:** transparent bottom rule at rest, Antique Brass bottom rule on hover, focus and `aria-current`. The "Inquire" link alone is set in Brass Strong.
- **Compact bar:** fixed, white, hairline-black bottom rule, wordmark at 1rem left and 9px links right; slides in over 560ms after the masthead scrolls away. Always opaque.
- **Small screens (at or below 640px):** the link row is replaced by a "Menu" label button; the panel is a full-height white sheet with a black rule, numbered Display S links divided by hairlines, and the tagline pinned to the bottom.

### Eyebrows
- **Style:** Label (9px, 400, 0.34em, uppercase, line-height 1.35). Default colour is Brass Strong; ink and muted tones exist for section titles and form labels. Optional brass numeral before it and a hairline that fills the remaining width after it.
- **Placement:** the first line of a text stack, above a serif headline, or as the section opener under a black rule.

### Pull Quotes
- **Style:** an oversized Zodiak opening quotation mark at 5.5rem in Antique Brass at 75% opacity, the quotation in Zodiak Italic 300 at Display M (30ch measure), and an attribution row: a 40px Rule Strong line then a muted eyebrow. Inline variant drops the mark to 4rem.

### Motion
- **Reveal:** elements enter with a 700ms fade and an 8px rise on `cubic-bezier(.22,.61,.36,1)`, once, staggered 90ms in grids.
- **State:** colour, border and fill changes take 280ms on the same ease; underlines draw over 280ms on `cubic-bezier(.65,0,.35,1)`; the compact bar slides over 560ms.
- **Reduced motion:** every duration collapses to 0ms and reveals render in place; a stage film holds still.

### Named Rules
**The Link-Is-the-Rule Rule.** The default call to action is a text link with a drawn brass underline. Buttons are the exception, and a form's submit is a link.

**The Slow-Fade Rule.** Motion is a fade and at most 8px of travel, once, on the editorial ease. No springs, no scale, no rotation, no card lift, no parallax (`--parallax-shift: 0%`), and everything collapses to zero under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** set every headline in Zodiak at weight 400 with -0.02em tracking and 0.98 to 1.15 leading, in sentence case; package names alone take Title Case.
- **Do** open a section with a 1px black rule and an eyebrow, and divide columns with an 18% hairline drawn in the grid gap.
- **Do** present every photograph as a square-cornered plate at a fixed ratio with a 9px uppercase caption in Ink Muted 12px beneath it.
- **Do** use Brass Strong (#7E6238) for any brass text under 24px, and reserve Antique Brass (#9C7C4A) for numerals, underlines, marks and the oversized quotation mark.
- **Do** make the call to action a text link with the left-to-right brass underline; allow at most one filled button per screen.
- **Do** keep labels at 9px or 11px, uppercase, tracked 0.34em to 0.42em, and let tracking carry the hierarchy.
- **Do** keep body copy at 15px, weight 300, leading 1.8, in Ink Muted, on a measure of 64ch or less.
- **Do** keep every interactive element at 44px minimum hit height with the 1px brass focus outline at 3px offset.
- **Do** keep motion to a 700ms fade with an 8px rise and 280ms colour and underline transitions, all collapsing to 0ms under reduced motion.

### Don't:
- **Don't** place a headline, label or any text over a photograph, and don't add a scrim, gradient band or overlay to make it legible; the tokens exist in the stylesheet but the site does not use them.
- **Don't** draw a card, panel or bordered box; use a rule or a column division instead.
- **Don't** add a shadow, inner shadow, backdrop blur or lifted hover state anywhere.
- **Don't** round a corner on any element, buttons and inputs included; radius is 0px.
- **Don't** add an icon, icon font, SVG glyph set or emoji; the system is built from type, rules and photographs, with mid-dots and em dashes as separators.
- **Don't** set text under 24px in Antique Brass (#9C7C4A), or fill a section or a whole surface with brass.
- **Don't** put more than one filled button on a screen, or replace the text-link submit with a filled block.
- **Don't** tint a whole section with Paper 50, 100 or 200; off-whites are for plate grounds and insets only.
- **Don't** use parallax, springs, scale, rotation or any travel beyond 8px; don't animate position on hover.
- **Don't** let the fixed bar or menu panel go transparent over content; both are opaque white with a rule.
