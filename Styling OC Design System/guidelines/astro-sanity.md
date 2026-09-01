# Lifting this system into Astro + Sanity

Three viable shapes, in order of how much of this system survives the move.

## Option A — Astro + `styles.css` verbatim (recommended)
Copy `styles.css` and `tokens/` into `src/styles/` untouched and import it once in a base layout. Port each `components/**/*.jsx` to an `.astro` component by moving the inline style objects to `style` attributes or a scoped `<style>` block; the custom properties keep working with no build step. Islands (`client:visible`) are needed for exactly three components: `SiteNav` (scroll solidify), `EditorialHero` (parallax), `BeforeAfter` (drag).

- Pros: tokens stay the single source of truth; near-zero JS; the hairline/whitespace system is CSS-only anyway.
- Cost: manual port of 14 components.

## Option B — Astro + the React components as-is
Add `@astrojs/react` and import the `.jsx` files directly. Fastest path; every component works day one. Cost: React ships for components that need no interactivity, and inline style objects are harder for a future designer to tune than CSS.

## Option C — Astro + Tailwind mapped to the tokens
Expose the tokens in `tailwind.config` (`colors.surface: 'var(--surface)'` etc). Only worth it if the team already writes Tailwind — the system's vocabulary is hairlines, offsets and measure, none of which Tailwind expresses better than plain CSS.

## Sanity content model
Schemas that map one-to-one onto the components, so an editor never has to think about layout:

| Sanity type | Fields | Renders as |
| --- | --- | --- |
| `servicePackage` | `line` (interiors / styling), `numeral`, `title`, `items[]`, `price`, `priceNote`, `note` | `ServiceTier` |
| `project` | `name`, `location`, `scope`, `year`, `heroImage`, `body` (portable text), `beforeImage`, `afterImage`, `ratio` | Project detail page + `ProjectCard` |
| `testimonial` | `quote`, `attribution`, `role`, `tone` | `PullQuote` |
| `founder` | `name`, `portrait`, `bio` | `FounderBio` |
| `page` | `title`, `sections[]` (array of blocks below) | Any template |

**Editor control level (chosen): a few enums per block.** Editors pick content plus a small closed set of layout options — nothing freeform. Per block that means: `imageSide` (left / right), `offset` (top / center / bottom), `tone` (day / night), `columns` (2 / 3), `ratio` (3:4, 4:5, 1:1, 16:9), `align` (left / center). No colour pickers, no font controls, no spacing fields, no rich-text styling beyond bold, italic and links. If a layout need falls outside the enums, it is a component change, not a content change.

Section blocks: `heroBlock`, `splitFeatureBlock` (image, side, offset, numeral, body), `serviceMenuBlock` (references `servicePackage`, ordered), `projectGridBlock`, `quoteBlock`, `founderBlock`, `inquiryBlock`. Keep `imageSide` and `offset` as editor-visible enums — the asymmetry is editorial judgement, not decoration.

Image pipeline: Sanity's `@sanity/image-url` with `.fit('crop').auto('format')`; never let it apply a `sharpen` or `saturation` preset — the photography is deliberately warm and soft. Set `ratio` per project so the index grid stays uneven.
