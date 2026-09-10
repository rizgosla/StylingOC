# Architectural Digest
URLs examined:
- FEATURE: https://www.architecturaldigest.com/story/erin-wassons-art-filled-malibu-home-tells-her-story-as-a-collector-and-collaborator (2018 celebrity home tour; full text scraped, browser view was open)
- PHOTO ESSAY: https://www.architecturaldigest.com/story/inside-a-highly-minimalist-spanish-house (2025 syndicated AD Spain tour; full text scraped, browser hit the metered paywall after the headline block)
- GUIDE: https://www.architecturaldigest.com/story/living-room-visual-clutter-removal (2026 AD It Yourself; full text scraped and browsed)
- Rejected for GUIDE: https://www.architecturaldigest.com/story/4-ways-to-style-a-bookshelf (video-led shopping post, no step structure); /story/how-to-style-a-bookshelf returned 404.

Screenshots (all 1900x1100 desktop window, saved as .jpg because the Chrome tool emits JPEG):
- .firecrawl/shots/ad-feature-1.jpg (top of page: nav + empty ad slot + start of full-bleed hero)
- .firecrawl/shots/ad-feature-2.jpg (bottom of hero, caption, kicker, headline, dek, byline block)
- .firecrawl/shots/ad-feature-3.jpg (first body paragraphs and the side-by-side portrait pair)
- .firecrawl/shots/ad-feature-4.jpg (full-bleed body plate with caption hanging left, then text resumes)
- .firecrawl/shots/ad-feature-5.jpg (in-column slideshow "1 / 11" with chevrons, credit, long caption, hairline rules, author bio)
- .firecrawl/shots/ad-photo-essay-1.jpg (top: nav, shopping sub-nav, ad slot, start of a contained hero)
- .firecrawl/shots/ad-photo-essay-2.jpg (hero bottom, caption, kicker ARCHITECTURE, headline, dek, By / Photography by / date)
- .firecrawl/shots/ad-photo-essay-3-paywall.jpg (the "Subscribe to continue" wall that replaced the body)
- .firecrawl/shots/ad-guide-1.jpg (top: full-bleed hero starts under the nav)
- .firecrawl/shots/ad-guide-2.jpg (hero bottom, two-line caption, kicker AD IT YOURSELF, headline, dek, byline, date, affiliate note above a hairline)
- .firecrawl/shots/ad-guide-3.jpg (narrower body column with right ad rail, inline newsletter box, first step heading "Disguise exposed cords", column-width image)
- .firecrawl/shots/ad-guide-4.jpg (image caption + credit, next step headings "Float some furniture" and "Simplify your palette")

## Hero pattern
Plate sits ABOVE the headline in all three lenses. The feature and the guide use a full-bleed landscape plate (edge to edge of the 1900 window, roughly 3:2, cropped to about 1900x1000 so it fills the viewport under the nav); the syndicated photo essay uses a contained portrait plate (approx 900px wide, 4:5) centred on white. A small AD watermark sits in the bottom-right corner of every photo. The caption is always present, set under the plate flush-left to the page margin (not the text column), tiny sans, sentence case, with the credit ("Photo by Christopher Patey" / "Photo: Brett Beyer") in lighter grey appended on the same line after two spaces. Under the caption comes a centred stack: kicker in tiny tracked caps sans ("CELEBRITY STYLE", "ARCHITECTURE", "AD IT YOURSELF"), headline in a light serif around 44px, centred, two lines max; dek in a plain sans around 17px, centred, sentence case, no full stop; then "By Juliet Izon" (with a round avatar on the older piece) and a grey date. The photo essay adds a second byline line "Photography by Paco Marin". The headline never sits over the image; text and photo are strictly stacked.

## Body column
Feature: one centred column about 1130px wide at 1900 (818px in the 0.72-scale screenshot), body serif around 19px, giving roughly 105-115 characters per line, which is on the long side. Guide: the column is pushed left of centre to make room for a 300px ad rail on the right, about 840px wide, roughly 75 characters per line. No drop cap. First paragraph is set exactly like the rest (no bold, no larger lede); the only opener treatment on the guide is a small italic affiliate disclaimer above a hairline rule. Paragraph spacing is a full line; no indents. Links are underlined in the body (bold-underlined on the guide).

## Image rhythm
Feature: text opens with two paragraphs, then a pair of portraits side by side (each about half the column, 4:5 and 3:2 mixed heights, top-aligned, captions under each), then two or three paragraphs, then a full-bleed landscape plate that breaks out of the column to the window edge (caption hangs left under it, at the page margin, two lines: caption then credit), then two paragraphs, then a contained portrait plate centred in the column with grey letterbox bars either side, then a 1/11 slideshow module in the column (image, then "1 / 11" counter left with prev/next chevron buttons right, credit line, a long caption paragraph under it, hairline rule below). Roughly one image every two to three paragraphs; widths alternate column / wide / full-bleed. Photo essay: from the scrape, every one or two paragraphs is followed by a single plate with a one-sentence caption naming the objects and makers ("In the living room, a BKF chair, sofa and rug by Kave Home..."), so text-to-image ratio is close to 1:1; occasionally two consecutive plates. Guide: each step heading gets zero or one column-width landscape image (3:2), placed after the step's paragraph, with caption + credit under it; later steps use a smaller "related story" card (thumbnail beside a linked headline) instead of a plate. Captions are sentence case, small sans, left-aligned to the image edge.

## Quote / caption
No pull quotes in any of the three pieces; quotes stay inline in the body. Captions: about 12-13px sans, dark grey, sentence case, left-aligned under the image (full-bleed plates hang the caption at the page margin, not the text margin); credit in lighter grey on the same line (feature) or its own line (guide). Slideshow captions are longer (a full paragraph, about 14px) and sit under a small credit line. The author bio at the foot is a hairline rule, then a square headshot left with a serif bio paragraph right.

## Guide structure
No numbering at all. Steps are H2 subheads in the same light serif as the headline at roughly 28px, sentence case, imperative phrasing ("Disguise exposed cords", "Float some furniture", "Simplify your palette", "Let pieces breathe", "Embrace asymmetry"). Each step is one or two paragraphs; about half the steps carry a column-width image immediately after the text, the rest carry none or a related-story card. No bulleted or numbered lists inside steps. Closing device: a "More Great Stories From AD It Yourself" bulleted link list, then the author bio block, then topic tags ("Explore: Home Decor, organization, small spaces"). The kicker names the franchise (AD IT YOURSELF) and does the work a "Guide" label would do.

## Adoptable / not
- [ADOPT] Plate above, headline below: the hero photo is a captioned plate and the title block is pure type on white underneath it. This is exactly the target rule.
- [ADOPT] Centred title stack order: tracked-caps kicker, light serif headline, plain sans dek, byline, date. Map kicker to the tiny wide-tracked caps label.
- [ADAPT: set dek in small caps sans rather than AD's sentence-case sans] The dek scale (about 17px, centred, one or two lines) is right; only the case treatment changes.
- [ADOPT] Caption placement: small sans caption directly under the plate, credit in lighter grey on the same line; for full-bleed plates the caption hangs at the page margin.
- [ADAPT: cap the measure] AD's feature column runs 105-115 characters per line at 1900; bring it down to about 70-80 with a narrower column and keep the plates wider than the text.
- [ADOPT] Alternating widths: column-width pair, full-bleed single, contained portrait with letterbox space. Three plate widths are enough.
- [ADOPT] Side-by-side pair of mixed ratios, top-aligned, each with its own caption.
- [REJECT: no boxes/cards/shadows/radius] The in-column newsletter box, the related-story cards with thumbnails, and the rounded "Save" button are all boxed UI.
- [REJECT: no icons] Slideshow chevron buttons, the bookmark icon floating in the left margin, the play "Listen" button.
- [REJECT: no scrims] The AD watermark burned into every photo corner; keep photos clean.
- [ADOPT] Hairline rules only: AD uses one thin grey rule above the affiliate note, under the slideshow, and above the author bio. Assign these to the three hairline weights.
- [ADAPT: use numbered or unnumbered serif subheads] The guide's H2-as-step in the headline serif is a clean pattern; decide whether to add a 01/02 numeral label in tracked caps above each.
- [REJECT: no cards] Guide "related story" thumbnail cards mid-article; replace with a plain text link line if cross-linking is needed.
- [ADOPT] Author bio as hairline + small square portrait + serif paragraph, no box.
