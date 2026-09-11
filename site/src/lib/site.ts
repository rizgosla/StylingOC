/* Site-wide switches.

   HOME_ONLY: while the site is a single home page, nothing may lead off it. The
   journal and lab routes live under src/pages/_parked/ (Astro skips underscore
   folders), and every component that would link to a story or the journal index
   renders plain text instead. Flip to false and move the folders back to publish
   the rest of the site. */
export const HOME_ONLY = true;

/** True when a link may render as a link right now. On-page anchors, mailto/tel
    and external addresses always may; internal routes only when the site has them. */
export function isLiveLink(href: string | undefined | null): boolean {
  if (!href) return false;
  if (!HOME_ONLY) return true;
  if (href.startsWith('/#') || href.startsWith('#') || href === '/') return true;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return true;
  return false;
}
