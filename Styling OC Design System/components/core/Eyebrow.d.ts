import * as React from 'react';

/** Wide-tracked 9px uppercase label. The system's primary way of titling a section. */
export interface EyebrowProps {
  children?: React.ReactNode;
  /** Brass tier numeral, e.g. "01". */
  numeral?: string;
  /** Extends a hairline rule across the remaining width. */
  rule?: boolean;
  /** Defaults to 'accent' (--accent-strong, 5.6:1). */
  tone?: 'accent' | 'ink' | 'muted' | 'inverse';
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}
export function Eyebrow(props: EyebrowProps): JSX.Element;
