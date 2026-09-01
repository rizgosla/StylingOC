import * as React from 'react';

/** Text link with a static hairline underline that draws to full opacity on hover. */
export interface TextLinkProps {
  children?: React.ReactNode;
  href?: string;
  tone?: 'ink' | 'accent' | 'inverse';
  /** Uppercase label styling with wide tracking — used for nav and captions. */
  caps?: boolean;
  style?: React.CSSProperties;
}
export function TextLink(props: TextLinkProps): JSX.Element;
