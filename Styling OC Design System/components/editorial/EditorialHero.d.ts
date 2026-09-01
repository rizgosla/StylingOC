import * as React from 'react';

export interface HeroMeta { label: string; value: string }

/**
 * Full-bleed editorial hero: photography as hero, masthead headline centered on the image.
 * Fades in over 700ms; there is no parallax in this system.
 */
export interface EditorialHeroProps {
  image: string;
  /** Required for anything meaningful; pass "" only for decorative imagery. */
  imageAlt?: string;
  eyebrow?: string;
  headline: string;
  /** All-caps sans standfirst lines under the headline. */
  sublines?: string[];
  /** Hairline scope row across the foot of the image (project openers). */
  meta?: HeroMeta[];
  /** Tiny caption set below the image, outside the scrim. */
  caption?: string;
  /** Defaults to 'center' — the masthead treatment. */
  align?: 'left' | 'center' | 'right';
  height?: string;
  scrim?: boolean;
  children?: React.ReactNode;
}
export function EditorialHero(props: EditorialHeroProps): JSX.Element;
