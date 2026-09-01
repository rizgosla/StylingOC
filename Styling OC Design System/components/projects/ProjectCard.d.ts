import * as React from 'react';

/** Project card — image with hairline-separated metadata. No border, shadow, or radius. */
export interface ProjectCardProps {
  image: string;
  imageAlt?: string;
  name: string;
  location?: string;
  /** e.g. "Full-service · 4,200 sq ft". */
  scope?: string;
  href?: string;
  /** CSS aspect-ratio — vary across the index grid. */
  ratio?: string;
  numeral?: string;
}
export function ProjectCard(props: ProjectCardProps): JSX.Element;
