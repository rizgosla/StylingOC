import * as React from 'react';

export interface FooterItem { label: string; href?: string }
export interface FooterColumn { title: string; items: FooterItem[] }

/** Three-column hairline-separated footer; tagline set in wide small caps across the bottom. */
export interface SiteFooterProps {
  wordmark?: string;
  columns?: FooterColumn[];
  tagline?: string;
  /** Small right-aligned note, e.g. a copyright line. */
  note?: string;
}
export function SiteFooter(props: SiteFooterProps): JSX.Element;
