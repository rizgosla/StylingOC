import * as React from 'react';

/**
 * Numbered service tier — the core commercial component, used for both the interiors
 * and personal-styling menus.
 */
export interface ServiceTierProps {
  /** Two-digit numeral in accent brass, e.g. "01". Signature element from the printed menus. */
  numeral: string;
  title: string;
  /** What is included. Keep to 3-6 items. */
  items?: string[];
  /** e.g. "$500 / hour", "$50,000 - $250,000". */
  price: string;
  /** Qualifier under the price, e.g. "depending on square footage". */
  priceNote?: string;
  /** Italic closing line. */
  note?: string;
  image?: string;
  imageAlt?: string;
  tone?: 'day' | 'night';
  /**
   * panel = column, three abreast inside ServiceMenu (default);
   * row = full-width hairline menu line, for menus of five or more;
   * withImage = image-led tier for feature pages.
   */
  layout?: 'panel' | 'row' | 'withImage';
}
export function ServiceTier(props: ServiceTierProps): JSX.Element;
