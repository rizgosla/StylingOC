import * as React from 'react';

export interface Portrait { src: string; alt?: string }

/**
 * Founder block — dual portrait with a staggered top offset, editorial bio, signature attribution.
 */
export interface FounderBioProps {
  portraits?: Portrait[];
  eyebrow?: string;
  title: string;
  body?: string[];
  /** Italic signature line, e.g. "— Jenn & Merlyn". */
  signature?: string;
  /** Brand pillars rendered as a small-caps row above the signature. */
  pillars?: string[];
  action?: React.ReactNode;
  layout?: 'portraitsLeft' | 'portraitsRight';
}
export function FounderBio(props: FounderBioProps): JSX.Element;
