import * as React from 'react';

/** Container for ServiceTier panels - heavy top rule, section head, columns divided by vertical hairlines. */
export interface ServiceMenuProps {
  eyebrow?: string;
  title?: string;
  /** Short standfirst set in the right-hand columns. */
  lede?: string;
  columns?: number;
  tone?: 'day' | 'night';
  /** ServiceTier children in panel layout. */
  children?: React.ReactNode;
}
export function ServiceMenu(props: ServiceMenuProps): JSX.Element;
