import * as React from 'react';

/**
 * Testimonial pull quote — oversized accent quotation mark, italic editorial serif, small-caps attribution.
 */
export interface PullQuoteProps {
  quote: string;
  attribution: string;
  /** Optional qualifier, e.g. "Interior Design Client". */
  role?: string;
  /** 'night' sets it on the near-black ground. */
  tone?: 'day' | 'night';
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
}
export function PullQuote(props: PullQuoteProps): JSX.Element;
