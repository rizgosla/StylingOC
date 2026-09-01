import * as React from 'react';

/** Rectangular CTA — the only button treatment in the system. Nothing here has a radius. */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Renders as an anchor when set. */
  href?: string;
  /**
   * outline = default; solid = black fill for high emphasis;
   * accent = the one filled brass button allowed per screen;
   * onImage = over full-bleed photography.
   */
  variant?: 'outline' | 'solid' | 'accent' | 'onImage';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
