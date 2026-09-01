import * as React from 'react';

/**
 * Asymmetric split: 6-column image beside a 4-column text block, offset vertically.
 */
export interface SplitFeatureProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  /** Accent numeral, e.g. "01". */
  numeral?: string;
  title: string;
  body?: string[];
  caption?: string;
  action?: React.ReactNode;
  imageSide?: 'left' | 'right';
  /** Vertical offset of the text block — never 'center' by default. */
  offset?: 'top' | 'center' | 'bottom';
  /** CSS aspect-ratio for the image. */
  ratio?: string;
}
export function SplitFeature(props: SplitFeatureProps): JSX.Element;
