import * as React from 'react';

export interface NavLink { label: string; href: string }

/**
 * Thin letterspaced site nav — transparent over a hero image, solidifying on scroll.
 */
export interface SiteNavProps {
  wordmark?: string;
  /** center splits links either side of the wordmark; left pins it hard-left. */
  align?: 'center' | 'left';
  links?: NavLink[];
  cta?: NavLink;
  /** Start transparent (use only when the first section is full-bleed imagery). */
  transparent?: boolean;
  /** Scroll offset in px at which the bar solidifies. */
  solidAfter?: number;
  /** Label of the current page. */
  active?: string;
}
export function SiteNav(props: SiteNavProps): JSX.Element;
